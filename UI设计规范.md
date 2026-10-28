# 前端 UI 设计风格（美学规范）

> 作品：
> 平台：  
> 风格基调：纸、墨、朱砂——专业写作工具的专属视觉语言  
> 文档范围：仅涵盖视觉与交互美学，不含布局结构、路由、API、状态管理等非美学内容  
> 最后核对：2026-10-20

---

## 一、设计理念

UI 视觉源自「书写材料世界」的隐喻，三种材料对应三种核心视觉元素：

| 材料 | 视觉映射 | 十六进制 | 定位 |
|------|---------|---------|------|
| 米白暖纸 | 页面整体底色 | `#F4F1EA` | 主背景，非纯白，降低长时间阅读的视觉疲劳 |
| 墨水黑 | 正文与标题文字 | `#23262B` | 主文字色，非纯黑，对比度温和 |
| 朱砂红 | 主强调色 | `#A8402C` | 激活态、主 CTA、语义强调，贯穿全局 |
| 暖棕线 | 描边与分割 | `#E4E2D9` | 卡片边框、输入框边框、分割线，与底色同色相深化 |

整体属性：**高密度信息工具**、专业写作场景、桌面优先、无深色模式、无移动端真机适配。

---

## 二、色板系统

所有色值定义于 CSS 变量，通过 Tailwind 统一消费。

### 2.1 核心色板

| 语义 | 变量 | 色值 | 说明 |
|------|------|------|------|
| 底色 | `--background` | `#F4F1EA` | 米白暖纸，页面主背景 |
| 正文色 | `--foreground` / `--ink` | `#23262B` | 墨水黑，正文、标题 |
| 卡片底 | `--card` | `#FFFFFF` | 纯白，浮层卡片底色 |
| 主强调 | `--primary` / `--a` | `#A8402C` | 朱砂红，激活态 / 主按钮 / 强调文字 |
| 次底色 | `--secondary` | `#F0EEE6` | 次级背景，略暖于底色 |
| 强调交互底 | `--accent` / `--a-soft` | `#F3E8E2` | 朱砂淡染底，hover / active / 选中态 |
| 次文字 | `--muted-foreground` / `--sub` | `#70777F` | 沉墨灰，次要文字 |
| 辅助文字 | `--faint` | `#7D848C` | 辅助 / 来源 / 元数据文字 |
| 描边 | `--border` / `--line` / `--input` | `#E4E2D9` | 暖棕描边 |
| 焦点环 | `--ring` | `#A8402C` | 输入框 / 交互焦点环，朱砂红 |

### 2.2 语义扩展色

| 语义 | 变量 | 色值 | 用途 |
|------|------|------|------|
| 成功 | `--success` / `--green` | `#2E7D32` | 保存成功、确认、通过 |
| 成功软底 | `--success-soft` / `--green-soft` | `#E9F3E9` | 成功状态淡染背景 |
| 警告 | `--warning` / `--amber` | `#B8860B` | 保存中、待处理 |
| 警告软底 | `--warning-soft` / `--amber-soft` | `#F7EFDC` | 警告状态淡染背景 |
| 危险 / 冲突 | `--destructive` / `--red` | `#B23A48` | 冷玫红，删除、冲突、错误（与朱砂红区分） |
| 危险软底 | `--red-soft` | `#F9E7EA` | 危险状态淡染背景 |
| 信息（弱化） | `--info` | `#58708A` | 辅助信息，弱化使用 |
| 信息软底 | `--info-highlight` | `rgb(88 112 138 / 8%)` | 设定蓝高亮（弱化） |

### 2.3 图表色系（5 色）

| 色 | 变量 | 色值 |
|----|------|------|
| chart-1 | `--chart-1` | `#A8402C`（朱砂红） |
| chart-2 | `--chart-2` | `#B23A48`（冷玫红） |
| chart-3 | `--chart-3` | `#B8860B`（琥珀） |
| chart-4 | `--chart-4` | `#2E7D32`（绿） |
| chart-5 | `--chart-5` | `#58708A`（信息蓝） |

### 2.4 顶栏深色区

| 变量 | 色值 | 用途 |
|------|------|------|
| `--topbar` | `#20242B` | 顶栏背景 |
| `--top-text` | `#EDEFF2` | 顶栏主文字 |
| `--top-sub` | `#9AA3AE` | 顶栏次文字 |
| `--top-dim` | `#5A616B` | 顶栏暗文字 |
| `--top-line` | `#3A4250` | 顶栏分割线 |

### 2.5 面板 / 侧边栏色

| 变量 | 色值 | 说明 |
|------|------|------|
| `--panel` / `--bg` / `--sidebar` | `#FBFAF6` | 面板色，比纯白底略暖，米白暖纸不透明 |

---

## 三、字体系统

### 3.1 字体族

| 场景 | 字体栈 | 说明 |
|------|--------|------|
| UI 界面 | LarkHackSafariFont / 系统无衬线 / PingFang SC / Microsoft YaHei / Arial | 界面元素、按钮、标签、菜单 |
| 正文编辑 | Songti SC / Noto Serif SC / Source Han Serif SC / ui-serif / Georgia / Cambria / Times New Roman | 章节正文编辑区，衬线配对，适合网文阅读 |
| 等宽 | source code pro, monospace | 代码、技术信息 |

UI 用系统无衬线栈，正文用中文宋体 + 西文 Georgia，异质配对成立，衬线正文对网文阅读是正确选择。

### 3.2 字阶（字号分级）

| 层级 | 字号 | 用途 |
|------|------|------|
| 正文编辑区 | 14.5px（默认，可切 13 / 14.5 / 16） | 章节正文 |
| 章节 / 面板标题 | ~13px / 12.5px | 标题 |
| 次级文字 | 11–12px | 辅助说明 |
| meta / 来源 | 10.5px | 元数据、时间、来源 |

- 全系统字阶跨度约 **1.4×**（10.5 → 14.5px），属于扁平字阶，远低于工具类 2.2× 的参考下限。
- 标题只是「大一点的正文」，层级区分主要靠字重（600 / 700）与颜色（sub / ink）而非尺度。
- 中文默认 14.5px 略小于 15px 可读性建议值；编辑器 16px 档为舒适值。

### 3.3 排版细节

- 正文段落：`line-height: 2`，`text-align: justify`（两端对齐），`text-indent: 2em`（首行缩进 2 字符）。
- 段落间距：`padding: 5px 6px`，`border-radius: 5px`，`margin: 2px -6px`。
- 段落 hover：背景 `#faf9f5` 轻微高亮。
- 选中文本：`background: rgb(59 130 246 / 20%)`。
- 正文使用衬线字体，与 UI 无衬线形成材质对比。

---

## 四、圆角分级

| 等级 | 值 | 典型用途 |
|------|-----|---------|
| 极小圆角 | `calc(var(--radius) - 2px)` | 微小元素 |
| 小圆角 | `calc(var(--radius) - 1px)` | 输入框、操作按钮 |
| 基准圆角 | `var(--radius) = 0.5rem（8px）` | 卡片、主按钮 |
| 大圆角 | `calc(var(--radius) + 2px)` | 浮层、弹窗 |
| 胶囊圆角 | `999px` | pill / chip / tag |
| 小标签圆角 | `4px` | 类型 tag / 置信度 tag |
| 输入圆角 | `5px` | 输入框、操作按钮 |
| 主按钮圆角 | `7px` | 主按钮、mini-btn |
| 卡片圆角 | `8px` | 卡片、分段控件 |
| 单选卡圆角 | `9px` | radio-card |

现有基准 `--radius: 0.5rem` 唯一，shell（大容器）与 card 差距小（8 vs 8），面板 / 弹窗 / 卡片读不出层级差。浮层建议给 12–14px 增加浮起感。

---

## 五、阴影系统

所有阴影使用暖棕底色相 `rgb(64 50 38)`，符合「三层有色影」精神，克制不滥用，全系统仅两套配方（shadow 阶梯 + proto-soft）。

| 等级 | 值 | 用途 |
|------|-----|------|
| 2xs / xs | `0px 1px 2px 0px rgb(64 50 38 / 2%)` | 极轻微浮起 |
| sm | `0px 1px 3px 0px rgb(64 50 38 / 3%), 0px 1px 1px -1px rgb(64 50 38 / 2%)` | 轻微浮起 |
| 基准 shadow / proto-soft | `0px 1px 3px 0px rgb(64 50 38 / 7%), 0px 6px 20px rgb(64 50 38 / 8%)` | 卡片、面板、浮层 |
| md | `0px 2px 6px 0px rgb(64 50 38 / 8%), 0px 2px 4px -2px rgb(64 50 38 / 5%)` | 中等浮起 |
| lg | `0px 4px 12px 0px rgb(64 50 38 / 10%), 0px 4px 6px -2px rgb(64 50 38 / 6%)` | 大型浮层 |
| xl | `0px 6px 16px 0px rgb(64 50 38 / 12%), 0px 6px 10px -3px rgb(64 50 38 / 7%)` | 弹窗、抽屉 |
| 2xl | `0px 8px 24px 0px rgb(64 50 38 / 14%)` | 最重浮层 |

阴影公式 `blur ≥ y × 2` 成立（如 20 ≥ 6×2），影子自然柔和。

---

## 六、图标规范

| 档位 | 尺寸 | 用途 |
|------|------|------|
| sz-title | 16px | 标题区图标 |
| sz-panel | 14px | 面板标题图标 |
| sz-btn | 13px | 按钮图标 |
| sz-topbar | 12px | 顶栏图标 |
| sz-meta | 11px | 元数据图标 |
| sz-tiny | 10px | 极小图标 |
| sz-empty | 26px | 空态图标 |

- 图标库：**lucide-react**，禁用 Emoji。
- 全局 `stroke-width: 1.8`，空态 `1.5`。
- 圆头端点：`stroke-linecap: round`，`stroke-linejoin: round`。
- `fill: none`，`stroke: currentColor`（随文字颜色继承）。
- 图标尺寸语义命名，全局一致，远优于「随手 Lucide」。

---

## 七、组件视觉规范

### 7.1 按钮（Button）

- 交互系统：通过 `::after` 伪元素叠加 `--elevate-1` / `--elevate-2` 处理 hover / active 状态（elevate 遮罩系统）。
- 变体：default / destructive / outline / secondary / ghost / link。
- 自定义颜色时必须配对前景色（如 `bg-primary text-primary-foreground`）。
- 主按钮圆角 7px，朱砂填充白字；outline 变体带暖棕描边。

### 7.2 徽标（Badge）

- 变体：default / destructive / outline / secondary。
- 无特殊尺寸分级，随上下文字号。

### 7.3 提醒（Alert）

- 变体：default / destructive / success / warning。
- 配对图标（CheckCircle / AlertTriangle 等），size-4。

### 7.4 空态（Empty）

- 图标：26px，stroke-width 1.5，颜色 `line`（#E4E2D9）。
- 文字：12px，`faint`（#7D848C），line-height 1.8，padding 26px 10px。
- 居中布局，图标 + 标题 + 描述 + CTA 按钮。
- 场景 / 事件面板空态缺「新建」引导 CTA（已知不足）。

### 7.5 保存状态 pill（胶囊）

| 状态 | 背景 | 边框 | 文字 | 备注 |
|------|------|------|------|------|
| 已保存 (ok) | `green-soft` (#E9F3E9) | `#BBD8BB` | `green` (#2E7D32) | 静态 |
| 未保存 (no) | `gray-soft` (#EFF0F2) | `line` (#E4E2D9) | `gray` (#8A9099) | hover 变朱砂 |
| 保存中 (saving) | `amber-soft` (#F7EFDC) | — | `amber` (#B8860B) | — |
| 保存失败 (error) | `red-soft` (#F9E7EA) | — | `red` (#B23A48) | hover 可重试 |

- 圆角 999px，字号 11px，字重 500，line-height 1.6。
- 四态完整，颜色语义正确（灰 / 琥珀 / 绿 / 玫红）。

### 7.6 实体行

- 名称：13px / 600 / ink，超出省略号。
- 类型 tag：`a-soft` 底 + 朱砂字 + 4px 圆角，10.5px，白名 nowrap。
- 置信度 tag：`gray-soft` 底 + sub 字 + 4px 圆角，10.5px，tabular-nums。
- 来源文字：10.5px / faint，max-width 80px 截断。
- 默认行背景透明；hover 时行背景变 `soft`（#F0EEE6），右侧浮现操作条（白底，1px line 边，7px 圆角，阴影，opacity 0→1，transition 0.15s）。
- 操作条按钮：ok（绿）/ no（辅助）/ del（冷玫红），hover 对应颜色。
- 触屏下操作条常显，按钮热区放大至 ≥36px，图标放大至 16px。

### 7.7 分段控件（Seg）

- 容器：`soft` 底 + line 边 + 8px 圆角，padding 2px，gap 2px。
- 选中项：朱砂填充 `#A8402C`，白字，字重 600，圆角 6px。
- 未选中：透明底，sub 字，11.5px。

### 7.8 单选卡（Radio Card）

- 默认：`panel` 底（#FBFAF6），line 边，9px 圆角，padding 9px 10px，居中文字。
- 激活：`a-soft` 底 + 朱砂边 `#E2CFC4`，名称朱砂字，描述朱砂字，tag 绿色。
- 名称 12.5px / 600 / ink；描述 10.5px / sub；tag 9.5px / green。

### 7.9 说明文字（Hint Note）

- `panel` 底 + dashed line 边 + 8px 圆角，padding 8px 10px，11px / sub，line-height 1.6。
- 加粗部分用朱砂字 `#A8402C`。

### 7.10 冲突卡（Conflict Item）

- 白底，1px line 边，8px 圆角，overflow hidden。
- 语义由头部徽章承载：red / amber / gray 三档，分别用 `red-soft` / `amber-soft` / `gray-soft` 底 + 对应字。
- 内容对比行：`panel` 底，7px 圆角，padding 6px 9px，12px。

### 7.11 分段导航（右栏 tab）

- 四等分卡片，icon + 文字 + 计数。
- 默认：transparent 底，sub 字，12.5px，圆角 8px。
- 激活：白底 + 阴影 + 朱砂字 + 600 粗，计数色随激活变朱砂。
- hover：`soft` 底（#F0EEE6）。
- 图标 14px，stroke-width 1.8，随文字颜色。
- 计数 10.5px / 500 / faint，tabular-nums。

---

## 八、交互反馈与动效

### 8.1 过渡与动画

- 全部为 150ms 的 hover / transition 级反馈（背景、边框、透明度）。
- 无 `@keyframes` 主打入场动画——对写作工具是正确取舍（不打扰创作）。
- 实体行 hover 浮现操作条，箭头旋转展开，反馈即时。
- 保存成功 pill 文案瞬变，无过渡反馈（建议加 300ms 柔和状态切换，P2 优化项）。

### 8.2 交互色阶

| 交互 | 视觉表现 |
|------|---------|
| hover（通用） | 背景 `soft`（#F0EEE6），或边框变朱砂 `#A8402C` |
| hover（主按钮） | opacity 0.9，保持朱砂底 |
| hover（危险按钮） | 背景 `red-soft`（#F9E7EA），冷玫红边 + 冷玫红字 |
| hover（次级按钮 / mini-btn） | 边框 + 文字变朱砂 `#A8402C` |
| active / selected | 朱砂填充 `#A8402C`，白字，字重 600 |
| focus | 焦点环朱砂 `#A8402C` |

### 8.3 触屏适配（@media hover: none）

- hover-only 操作条常显（`.vops` / `.ch-ops`）。
- 操作按钮热区放大至 ≥36px，图标放大至 16px。
- `opacity-0[class*="group-hover:opacity-100"]` 强制 opacity 1。

---

## 九、视觉层级与密度

### 9.1 强调色使用（朱砂红）

朱砂红在界面中同时承担约 5 类角色：激活 tab、primary 按钮、链接 / 强调文字、tag 底、hover 边框。

- **评审建议**：朱砂红应仅保留「激活 + 主 CTA + 语义强调」三个角色；hover 边框、次级 tag 降级为中性色，避免「到处都在强调」的视觉噪音。

### 9.2 字阶层级

- 字阶跨度小（1.4×），标题与正文区分弱，低对比显示器上易糊。
- 建议：章节标题区提升至 16–18px，默认正文字号可提到 15px；meta 字号 10.5px 在 100% 缩放下偏小。

### 9.3 圆角层级

- 基准 8px 被用于 card 与 shell，层级差不明显。
- 建议：弹窗 / 浮层给 12–14px 大圆角，增加浮起感。

### 9.4 密度形态

- 整体为「高密度信息工具」，数据密度优先，层级区分靠颜色 / 底而非留白。
- 缺一个明显视觉重心，信息在视觉上较为平铺。

---

## 十、已知美学问题与改进建议

| 优先级 | 问题 | 影响 |
|--------|------|------|
| P0 | 右栏 8 个 tab 在 ~280px 宽度下末位文字溢出截断 | 末位「全量考据」不可辨识 |
| P0 | 全量考据面板无 Esc / 遮罩关闭，遮罩挡住顶栏「设置」 | 关闭通道不足，操作受阻 |
| P0 | 深链 / 刷新无法定位到指定作品与章节 | 视觉定位失效 |
| P1 | 朱砂红承担 5 类角色，强调溢出 | 视觉重心分散，层级弱 |
| P1 | 字阶跨度 1.4×，标题与正文区分弱 | 信息层级模糊 |
| P2 | 无 <1024px 响应式断点 | 触屏 / 窄屏体验缺失 |
| P2 | 保存成功 pill 无过渡反馈 | 状态切换生硬 |
| P3 | 弹窗 / 卡片圆角与基准 8px 无差异 | 浮层缺乏浮起感 |
| P3 | 场景 / 事件空态缺「新建」引导 CTA | 空态引导不足 |

---

## 附录：核心视觉变量速查

```css
/* 背景 */
--background: #F4F1EA;   /* 米白暖纸 */
--card: #FFFFFF;         /* 纯白卡片 */
--panel: #FBFAF6;        /* 面板色（略暖） */

/* 文字 */
--foreground: #23262B;   /* 墨水黑正文 */
--sub: #70777F;          /* 次文字 */
--faint: #7D848C;        /* 辅助文字 */

/* 强调 */
--primary: #A8402C;      /* 朱砂红主强调 */
--accent: #F3E8E2;       /* 朱砂淡染底 */
--ring: #A8402C;         /* 焦点环 */

/* 描边 */
--border: #E4E2D9;       /* 暖棕描边 */

/* 语义 */
--success: #2E7D32;
--warning: #B8860B;
--destructive: #B23A48;
--info: #58708A;

/* 阴影 */
--shadow: 0px 1px 3px 0px rgb(64 50 38 / 7%), 0px 6px 20px rgb(64 50 38 / 8%);

/* 圆角 */
--radius: 0.5rem;        /* 8px 基准 */

/* 字体 */
--font-sans: 系统无衬线栈;
--font-serif: Songti SC / Noto Serif SC / Georgia;
```

---

*本文档仅提取前端 UI 的美学与视觉交互规范，来源于项目设计 token 文件（`tailwind-theme.css`、`typography.css`、`index.css`）与 UI 设计评审报告，未包含布局结构、路由、API 及代码实现细节。*