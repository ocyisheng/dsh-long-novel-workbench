#!/usr/bin/env node
/**
 * 提案页单页截图：把提案卡片真的展开，看内联 diff / 账本字段 / 闸门折叠长什么样。
 *
 * 只在临时副本上造数据，绝不写真实 StoryDesk。
 *
 * 用法：
 *   node scripts/ui-shot.mjs --root <StoryDesk 数据根> --chrome <chrome 路径> --out <输出目录>
 */

import { execFileSync } from 'node:child_process'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { handleRpc } from '../index.js'

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const work = arg('out', join(tmpdir(), 'nd-ui-shot'))
const chrome = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const src = arg('root', arg('STORY_DESK_ROOT', ''))
const root = join(work, 'data')
const site = join(work, 'site')
const projectArg = arg('project', '')

async function main() {
  if (!existsSync(chrome)) throw new Error(`找不到 Chrome：${chrome}`)
  if (!existsSync(join(src, 'library.json'))) throw new Error(`不是 StoryDesk 根目录：${src}`)

  await mkdir(root, { recursive: true })
  await cp(join(src, 'library.json'), join(root, 'library.json'))
  await cp(join(src, 'projects', 'proposals.json'), join(root, 'projects', 'proposals.json')).catch(() => {})
  const keep = ['project.json', 'attention.json', 'reviews.json', 'proposals.json', 'runs.json', 'usage.json', 'settings.json', 'facts.json', 'characters.json', 'events.json', 'foreshadow.json', 'conflicts.json', 'highlights.json', 'outlines.json', 'locations.json', 'presets.json', 'world.json']
  const { readdir } = await import('node:fs/promises')
  for (const id of await readdir(join(src, 'projects'))) {
    if (id === 'proposals.json') continue
    await mkdir(join(root, 'projects', id), { recursive: true })
    for (const name of keep) {
      await cp(join(src, 'projects', id, name), join(root, 'projects', id, name)).catch(() => {})
    }
  }

  process.env.STORY_DESK_ROOT = root
  const call = (op, payload = {}) => handleRpc({ op, payload }, {}, {})
  const projects = await call('projects.list', {})
  const list = Array.isArray(projects) ? projects : (projects.projects ?? [])
  const projectId = projectArg || String(list[0]?.id ?? '')
  if (!projectId) throw new Error('没有作品可渲染')
  await cp(join(src, 'projects', projectId, 'chapters'), join(root, 'projects', projectId, 'chapters'), { recursive: true }).catch(() => {})

  const tocRes = await call('chapter.list', { projectId })
  const chapterRows = Array.isArray(tocRes) ? tocRes : (tocRes.chapters ?? [])
  const first = chapterRows.find((row) => Number(row.words) > 0) ?? chapterRows[0]
  const chapterGet = {}
  for (const row of chapterRows.slice(0, 4)) {
    if (!row?.chapter) continue
    chapterGet[row.chapter] = await call('chapter.get', { projectId, chapter: row.chapter })
  }
  const body = String(chapterGet[first?.chapter]?.text ?? '')
  const lines = body.split('\n').map((line) => line.trim()).filter((line) => line.length >= 8)
  const quote = lines[0] ?? '他推开门，风把灯吹得一晃。'
  const afterQuote = quote
    .replace('推开门', '挑起门帘')
    .replace('风把灯吹得一晃', '风灌进来，火苗贴着灯罩抖了抖')

  const store = await import('../lib/store.js')
  const chapterNo = Number(first?.chapter) || 1
  if (lines.length) {
    await store.addReviews(root, projectId, [
      { chapter: chapterNo, source: 'logic', severity: 'major', quote: quote.slice(0, 12), issue: '这一段动作和上一章结尾重复了一次', suggestion: '把「推门」换成掀帘，动作更轻也更符合此刻的谨慎' },
      { chapter: chapterNo, source: 'ai-style', severity: 'minor', quote: quote.slice(0, 10), issue: '「吹得一晃」是常见套话', suggestion: '改成具体的火苗动作' },
    ]).catch(() => {})
  }
  const reviewRes = await call('review.list', { projectId })
  const reviewRows = Array.isArray(reviewRes) ? reviewRes : (reviewRes.reviews ?? [])
  const reviewIds = reviewRows.slice(-2).map((review) => review.id).filter(Boolean)

  const made = []
  if (lines.length) {
    const patch = await store.createProposal(root, projectId, {
      kind: 'patch-paragraph',
      chapter: chapterNo,
      title: `第 ${chapterNo} 章 · 开场动作改得更具体`,
      summary: '把套话换成具体动作，删掉重复的推门。',
      data: {
        patches: [
          { chapter: chapterNo, before: quote, after: afterQuote || `${quote}（改）`, why: '「推门」与上一章重复，套话削弱了紧张感。', reviewIds },
          { chapter: chapterNo, before: lines[1] ?? '', after: (lines[1] ?? '') + '他没回头。', why: '补一个不回头的动作，把注意力留在门外。', reviewIds: reviewIds.slice(0, 1) },
        ],
      },
      gates: { fidelity: 'pass', residue: 'pass', prose: { normalized: true }, aistyle: { score: 12, pass: false } },
    })
    made.push(patch?.id)
  }
  const bookFix = await store.createProposal(root, projectId, {
    kind: 'book-fix',
    chapter: 0,
    title: '全书 · 三章的「夜色」描写同质化',
    summary: '同一类比喻在不同章重复出现，按章给出改法。',
    data: {
      opinion: '三章都在用「夜色如墨」，读者会疲劳。建议按场景换比喻：城外用风，院里用灯，屋里用人。',
      patches: [
        { chapter: chapterNo, before: '夜色如墨', after: '夜色压在瓦上', why: '城外场景更适合写风与瓦。', reviewIds: [] },
        { chapter: chapterNo + 1, before: '夜色如墨', after: '灯把夜色推开了三尺', why: '院里以灯为主体。', reviewIds: [] },
        { chapter: chapterNo + 2, before: '夜色如墨', after: '他脸上没有夜色的份', why: '屋里以人为焦点。', reviewIds: [] },
      ],
    },
    gates: { fidelity: 'pass', residue: 'fail', prose: { normalized: true }, aistyle: { score: 34, pass: false } },
  })
  made.push(bookFix?.id)
  const ledgerFix = await store.createProposal(root, projectId, {
    kind: 'ledger-fix',
    chapter: 0,
    title: '账本 · 补齐三个主要人物的目标与缺陷',
    summary: '人物卡缺目标与缺陷，写下去会前后不一致。',
    data: {
      ledgerFixes: [
        { kind: 'characters', patch: { name: '沈砚', role: 'protagonist', age: '二十七', goal: '查清父亲旧案的真相', flaw: '只信证据，不信人', relationships: ['裴九：师兄弟', '柳氏：母子'] } },
        { kind: 'characters', patch: { name: '裴九', role: 'supporting', goal: '保住仵作行当的口碑', flaw: '遇事先护自己' } },
        { kind: 'facts', patch: { subject: '沈砚', attribute: '持有物', value: '半枚铜鱼符', chapter: chapterNo, note: '父亲遗物' } },
      ],
    },
    gates: { fidelity: 'pass', residue: 'pass', prose: { normalized: true }, aistyle: { score: 8, pass: true } },
  })
  made.push(ledgerFix?.id)

  const fixtures = {}
  const ops = [
    ['projects.list', {}], ['project.context', { projectId }], ['chapter.list', { projectId }],
    ['review.list', { projectId }], ['proposal.list', { projectId }], ['run.get', { projectId }],
    ['ledger.get', { projectId }], ['usage.summary', { projectId }], ['align.status', { projectId }],
    ['settings.get', { projectId }], ['storage.status', { projectId }], ['roles.list', {}],
    ['ledger.entities', { projectId, kind: 'characters' }],
  ]
  for (const [op, payload] of ops) fixtures[op] = await call(op, payload).catch(() => ({}))
  // 提案列表：把刚造的提案排到最前面，保证截图点得到
  const pending = fixtures['proposal.list']
  const proposals = Array.isArray(pending) ? pending : (pending?.proposals ?? [])
  const ordered = [...proposals].sort((a, b) => {
    const ia = made.includes(a.id) ? made.indexOf(a.id) : 99
    const ib = made.includes(b.id) ? made.indexOf(b.id) : 99
    return ia - ib
  })
  fixtures['proposal.list'] = { proposals: ordered }
  fixtures.chapterGet = chapterGet

  await mkdir(site, { recursive: true })
  await cp(join(import.meta.dirname, '..', 'client.js'), join(site, 'client.js'))
  await ensureReact(site)

  const shots = [
    { name: 'proposals-collapsed', click: -1 },
    { name: 'proposal-bookfix', click: 0 },
    { name: 'proposal-bookfix-gates', click: 0, focus: '.nd-gates' },
    { name: 'proposal-ledger', click: 1 },
  ]
  const profile = join(work, 'chrome')
  await mkdir(join(work, 'shots'), { recursive: true })
  for (const shot of shots) {
    const hash = `#proposals?novel-desk=1&click=${shot.click}${shot.focus ? `&focus=${encodeURIComponent(shot.focus)}` : ''}`
    await writeFile(join(site, 'index.html'), html(fixtures, projectId), 'utf8')
    const file = join(work, 'shots', `${shot.name}.png`)
    execFileSync(chrome, [
      '--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
      '--virtual-time-budget=9000', '--window-size=1680,1000', `--screenshot=${file}`,
      `file://${join(site, 'index.html')}${hash}`,
    ], { maxBuffer: 64 * 1024 * 1024, stdio: 'ignore' })
    console.log(`- ${shot.name} -> ${file}`)
  }
}

async function ensureReact(dir) {
  const local = join(import.meta.dirname, '..', '.ui-cache')
  await mkdir(local, { recursive: true })
  const files = [
    ['react.js', 'https://unpkg.com/react@18.3.1/umd/react.production.min.js'],
    ['react-dom.js', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js'],
  ]
  for (const [name, url] of files) {
    const dest = join(dir, name)
    if (existsSync(join(local, name))) {
      await cp(join(local, name), dest)
      continue
    }
    if (existsSync(dest)) continue
    const res = await fetch(url)
    if (!res.ok) throw new Error(`下载 ${name} 失败（${res.status}）`)
    const text = await res.text()
    await writeFile(join(local, name), text, 'utf8')
    await writeFile(dest, text, 'utf8')
  }
}

function html(fixtures, projectId) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>novel-desk proposal shot</title>
<style>html,body{margin:0;padding:0;background:#fff;font-family:system-ui,sans-serif}#root{min-height:100vh}#debug{display:none}</style></head>
<body><div id="root"></div><pre id="debug"></pre>
<script src="react.js"></script><script src="react-dom.js"></script>
<script>
const FIX = ${JSON.stringify(fixtures)};
const mounts = {};
const response = (value) => ({ status: 200, ok: true, json: async () => ({ ok: true, value }) });
window.__mockErrors = [];
window.fetch = async (url, init) => {
  const body = JSON.parse((init && init.body) || '{}');
  const op = body.op;
  if (op === 'chapter.get') return response(FIX.chapterGet[Number(body.chapter)] || null);
  if (op === 'app.open') return response({ url: 'http://127.0.0.1:64615/', opened: true });
  if (Object.prototype.hasOwnProperty.call(FIX, op)) return response(FIX[op]);
  window.__mockErrors.push('未 mock 的 op: ' + op);
  return response({});
};
window.__ModuleLoader__ = { load({ id, factory }) {
  const require = (name) => (name === 'react' ? window.React : name === 'react-dom' ? window.ReactDOM : (() => { throw new Error('unknown module ' + name) })());
  try { mounts[id] = factory(require); } catch (error) { window.__mountError = String(error && error.stack || error); }
} };
window.onerror = (msg, src, line, col) => { window.__mockErrors.push('onerror: ' + msg + ' @' + line + ':' + col); };
window.addEventListener('unhandledrejection', (e) => { window.__mockErrors.push('unhandledrejection: ' + (e.reason && e.reason.message || e.reason)); });
try { localStorage.setItem('nd.project', ${JSON.stringify(projectId)}); } catch (e) {}
if (location.hash.length > 1) { try { localStorage.setItem('nd.page', 'proposals'); } catch (e) {} }
</script>
<script src="client.js"></script>
<script>
const mod = mounts['dsh-long-novel-workbench'];
const registered = [];
const ctx = {
  slots: { inject(name, cb) { try { cb(); } catch (e) { window.__mockErrors.push('inject ' + name + ': ' + e.message); } }, register(spec, Component) { registered.push({ spec, Component }); return () => {}; } },
  effect(fn) { try { fn(); } catch (e) {} return () => {}; },
  get() { return undefined; },
};
let status = 'module not loaded';
try {
  mod.apply(ctx);
  const overlay = registered.find((r) => r.spec.name === 'shell.overlay');
  if (!overlay) status = 'no shell.overlay';
  else { window.ReactDOM.createRoot(document.getElementById('root')).render(window.React.createElement(overlay.Component)); status = 'mounted'; }
} catch (error) { status = 'apply failed: ' + error.message; }
setTimeout(function () {
  const m = /click=(-?\\d+)/.exec(location.hash);
  const idx = m ? Number(m[1]) : -1;
  if (idx >= 0) {
    const heads = document.querySelectorAll('.nd-proposal-head');
    if (heads[idx]) heads[idx].click();
  }
}, 2000);
setTimeout(function () {
  const f = /focus=([^&]+)/.exec(location.hash);
  if (!f) return;
  const el = document.querySelector(decodeURIComponent(f[1]));
  if (el) el.scrollIntoView({ block: 'center' });
}, 3200);
setTimeout(function () {
  const lines = ['mount: ' + status];
  if (window.__mountError) lines.push('mountError: ' + window.__mountError.split('\\n').slice(0, 4).join(' | '));
  if (window.__mockErrors.length) lines.push('errors: ' + window.__mockErrors.slice(0, 8).join(' || '));
  document.getElementById('debug').textContent = lines.join('\\n');
}, 4000);
</script></body></html>`
}

await main()
