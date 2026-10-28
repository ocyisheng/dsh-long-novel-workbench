#!/usr/bin/env node
/**
 * 把账本里「随机 id」的行改回提案当初给的 id，让「已采纳的提案」和「账本」对得上号。
 *
 * 背景：0.8.4 之前 acceptProposal 只把 patch 传给 upsertLedgerItem，而 propose 工具的
 * 标准写法是 [{kind, id, patch}] —— id 在外层，写库时被丢掉，账本另发一个随机 id。
 * 内容是对的，只是 id 对不上；这条脚本把老数据的 id 补回去。
 *
 * 账本页读的是 SQLite（ledger_items / outlines），JSON 只是兜底镜像，
 * 所以两边都要改：先走 bookdb 的 upsert + delete，再同步 JSON。
 *
 * 只在「按内容能唯一匹配」时才改：
 *   outlines → 按 chapter
 *   facts    → 按 subject + predicate
 *   其它     → 按 name（没有 name 就 title）
 * 目标 id 已被别的行占用就跳过，不覆盖。
 *
 * 用法：
 *   node scripts/align-ledger-ids.mjs --root <StoryDesk 数据根> [--project <id>] [--write]
 * 不带 --write 只打印将要改成什么。--write 会先备份 novel.db 与相关 JSON。
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import * as bookdb from '../lib/bookdb.js'

const argv = process.argv.slice(2)
const arg = (name, fallback = '') => {
  const i = argv.indexOf('--' + name)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const root = arg('root')
if (!root) throw new Error('need --root <StoryDesk 数据根>')
const onlyProject = arg('project')
const write = argv.includes('--write')

const DB_KINDS = ['facts', 'characters', 'events', 'foreshadow', 'conflicts', 'locations', 'highlights']
const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim()

function matchIndex(kind, rows, patch) {
  if (kind === 'outlines') return rows.findIndex((r) => Number(r?.chapter) === Number(patch.chapter))
  if (kind === 'facts') {
    return rows.findIndex((r) => norm(r?.subject) === norm(patch.subject) && norm(r?.predicate) === norm(patch.predicate))
  }
  const name = patch.name || patch.title
  if (!name) return -1
  return rows.findIndex((r) => norm(r?.name) === norm(name) || norm(r?.title) === norm(name))
}

const lib = JSON.parse(readFileSync(path.join(root, 'library.json'), 'utf8'))
const projects = (lib.projects || []).filter((row) => !onlyProject || row.id === onlyProject)

let total = 0
for (const row of projects) {
  const dir = row.dataDir ? path.resolve(row.dataDir) : path.join(root, 'projects', row.id)
  const proposalsPath = path.join(dir, 'proposals.json')
  if (!existsSync(proposalsPath)) continue
  const proposals = JSON.parse(readFileSync(proposalsPath, 'utf8'))

  const plan = []
  const tables = new Map()
  const load = async (kind) => {
    if (!tables.has(kind)) {
      const fromDb = kind === 'outlines' ? await bookdb.listOutlines(dir) : await bookdb.listLedgerItems(dir, kind)
      if (fromDb.length) tables.set(kind, fromDb)
      else {
        const p = path.join(dir, kind + '.json')
        tables.set(kind, existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) || [] : [])
      }
    }
    return tables.get(kind)
  }

  for (const proposal of proposals) {
    if (proposal.status !== 'accepted') continue
    for (const fix of proposal.data?.ledgerFixes || proposal.data?.items || []) {
      const kind = String(fix.kind || '')
      if (kind !== 'outlines' && !DB_KINDS.includes(kind)) continue
      let patch = fix.patch ?? fix.item ?? {}
      if (typeof patch === 'string') { try { patch = JSON.parse(patch) } catch { continue } }
      const wanted = patch.id || fix.id
      if (!wanted) continue
      const rows = await load(kind)
      const index = matchIndex(kind, rows, patch)
      if (index < 0) continue
      const current = rows[index]
      if (String(current.id) === String(wanted)) continue
      if (rows.some((r, i) => i !== index && String(r?.id) === String(wanted))) continue
      plan.push({ kind, index, from: current.id, to: wanted, label: current.name || current.title || `第${current.chapter}章` })
      current.id = wanted
    }
  }

  total += plan.length
  console.log(`\n== ${row.id}（${dir}）`)
  console.log(`   计划改 id：${plan.length} 条`)
  const byKind = plan.reduce((a, x) => ((a[x.kind] = (a[x.kind] || 0) + 1), a), {})
  console.log('   分布：', Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join('，') || '无')
  for (const x of plan.slice(0, 6)) console.log(`   · ${x.kind} ${x.label}：${x.from} → ${x.to}`)
  if (plan.length > 6) console.log(`   · …还有 ${plan.length - 6} 条`)
  if (!write || !plan.length) continue

  // 备份
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = path.join(dir, `.id-align-${stamp}`)
  mkdirSync(backup, { recursive: true })
  for (const name of ['novel.db', 'novel.db-wal', 'novel.db-shm', ...new Set([...plan.map((x) => x.kind + '.json'), 'proposals.json'])]) {
    const p = path.join(dir, name)
    if (existsSync(p)) copyFileSync(p, path.join(backup, name))
  }

  // 落库：先按新 id upsert，再删旧 id（人物/地点会连带实体与别名一起搬）
  const groups = new Map()
  for (const x of plan) {
    if (!groups.has(x.kind)) groups.set(x.kind, [])
    groups.get(x.kind).push(x)
  }
  for (const [kind, list] of groups) {
    const rows = tables.get(kind)
    for (const x of list) {
      const next = rows[x.index]
      if (kind === 'outlines') await bookdb.upsertOutline(dir, next)
      else {
        await bookdb.upsertLedgerItem(dir, kind, next)
        await bookdb.deleteLedgerItem(dir, kind, x.from)
      }
    }
  }

  // 同步 JSON 镜像
  for (const kind of new Set(plan.map((x) => x.kind))) {
    const mirror = path.join(dir, kind + '.json')
    if (!existsSync(mirror)) continue
    const json = JSON.parse(readFileSync(mirror, 'utf8')) || []
    if (!Array.isArray(json)) continue
    const rows = tables.get(kind)
    for (const x of plan.filter((y) => y.kind === kind)) {
      const hit = json.find((r) => String(r?.id) === String(x.from))
      if (hit) hit.id = x.to
    }
    writeFileSync(mirror, JSON.stringify(json, null, 2))
    void rows
  }
  console.log(`   已写入（备份在 ${backup}）`)
}

if (total) await bookdb.closeBook(path.join(root, 'projects', onlyProject || '')) // 兜底：尽量释放句柄
console.log(`\n合计 ${total} 条${write ? '（已写入）' : '（预览，加 --write 才落盘）'}`)
