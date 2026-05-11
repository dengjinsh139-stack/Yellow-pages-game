# Note Density Reducer v2 施工单

## 一、当前基线

- **文件**: `sound-effects/instrument-language-synth.html`
- **版本**: v3.27.2
- **Git commit**: `667fdaf45f71fe17c202240aea64af33bec35cd7`
- **当前已存在**:
  - `NOTE_DENSITY_REDUCER` 配置对象（negationWords / actionWords / enabled / maxEffectiveCharsPerSentence）
  - `applyNoteDensityReduction(events, originalText)` 函数
  - `isEffectiveChar(char)` 函数
- **当前不存在**:
  - `NOTE_DENSITY_MODE_CONFIG`
  - `getNoteDensityTargetCount()`
  - `NOTE_DENSITY_PROTECTED_PHRASES`
  - UI 模式选择控件

## 二、施工目标

在现有 `applyNoteDensityReduction` 基础上，增加**发音密度模式 UI** + **protected phrases** + **模式化压缩参数**。

## 三、硬性原则（禁止破坏）

1. ❌ 不修改 `#textInput` 原文
2. ❌ 不删除字幕原文
3. ❌ 只减少 performance events / note events
4. ✅ `characterVoice` 事件 100% 保留
5. ✅ `phraseMidi` / 语义 MIDI 事件 100% 保留
6. ✅ `pause` / 标点事件默认保留
7. ✅ 实时播放和 WAV 导出使用同一套压缩后 events
8. ✅ 不破坏 Expression Segment
9. ✅ 不破坏歌曲 MIDI 模式
10. ✅ 不破坏 `.workbench` 三栏结构
11. ✅ 不引入新的全局脚本错误

## 四、新增配置

### 4.1 模式配置常量

```javascript
const NOTE_DENSITY_MODE_CONFIG = {
  full: {
    label: '完整',
    maxNotes: Infinity,
    ratio: 1.0,
    description: '尽量保留全部有效字符发音'
  },
  natural: {
    label: '自然',
    maxNotes: 10,
    ratio: 0.65,
    description: '默认压缩，保留自然说话感'
  },
  compact: {
    label: '简洁',
    maxNotes: 7,
    ratio: 0.45,
    description: '明显减少发音数量'
  },
  minimal: {
    label: '极简',
    maxNotes: 4,
    ratio: 0.25,
    description: '只保留少量锚点音'
  }
};
```

### 4.2 受保护短语

```javascript
const NOTE_DENSITY_PROTECTED_PHRASES = [
  '不对劲', '不太对劲', '不安全', '不能去', '不要过去',
  '别过去', '别靠近', '有危险', '太危险', '快回来',
  '快走', '快跑', '停下', '等等', '别动', '不要动',
  '不要说', '不能说', '我不能说', '我不该告诉你',
  '忘掉', '快忘掉'
];
```

### 4.3 目标 note 数计算

```javascript
function getNoteDensityTargetCount(effectiveCount, mode) {
  const config = NOTE_DENSITY_MODE_CONFIG[mode] || NOTE_DENSITY_MODE_CONFIG.natural;
  if (mode === 'full') return effectiveCount;
  const ratioTarget = Math.ceil(effectiveCount * config.ratio);
  return Math.min(config.maxNotes, ratioTarget, effectiveCount);
}
```

## 五、UI 改造

### 5.1 HTML 添加

在左栏「基础演奏」区域，找到现有的 🎶 发音密度控件附近，增加：

```html
<div class="control-group">
  <div class="control-label">
    <span>🎶 发音密度模式</span>
    <span class="control-value" id="noteDensityModeValue">自然</span>
  </div>
  <select id="noteDensityMode" style="width:100%;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:var(--text);font-size:0.8rem;">
    <option value="full">完整 - 尽量保留全部发音</option>
    <option value="natural" selected>自然 - 默认压缩（约10音）</option>
    <option value="compact">简洁 - 明显减少（约7音）</option>
    <option value="minimal">极简 - 只保留锚点（约4音）</option>
  </select>
  <small style="font-size:0.65rem;color:var(--text-dim);margin-top:4px;display:block;">
    控制乐器实际发出的音符数量，不改变文字内容
  </small>
</div>
```

### 5.2 事件绑定

在 `updateParams()` 中增加：

```javascript
const densityModeEl = document.getElementById('noteDensityMode');
if (densityModeEl) {
  params.noteDensityMode = densityModeEl.value || 'natural';
}
const densityModeValueEl = document.getElementById('noteDensityModeValue');
if (densityModeValueEl) {
  const cfg = NOTE_DENSITY_MODE_CONFIG[params.noteDensityMode] || NOTE_DENSITY_MODE_CONFIG.natural;
  densityModeValueEl.textContent = cfg.label;
}
```

在 `init()` 或 DOMContentLoaded 中增加事件监听：

```javascript
densityModeEl.addEventListener('change', () => {
  updateParams();
  // 可选：如果当前正在播放，刷新 notesDisplay
  if (isPlaying) {
    refreshNoteDisplay();
  }
});
```

初始化默认值：

```javascript
params.noteDensityMode = params.noteDensityMode || 'natural';
```

## 六、applyNoteDensityReduction 升级

### 6.1 函数签名扩展

```javascript
function applyNoteDensityReduction(events, originalText, options = {}) {
  const mode = options.mode || params.noteDensityMode || 'natural';
  
  // full 模式直接返回
  if (mode === 'full') {
    return events;
  }
  
  // ... 其余逻辑不变，但 targetCount 改用 getNoteDensityTargetCount
```

### 6.2 protected phrases 处理

在压缩逻辑中，增加短语级保护：

1. 扫描 `originalText`，找出所有 `NOTE_DENSITY_PROTECTED_PHRASES` 匹配位置
2. 对每个匹配，标记其 `sourceCharIndex` 范围内的 note 事件为 `protected`
3. 压缩时，`protected` note 优先保留，禁止删到语义反转
4. 如果目标数极低（如 minimal=4），至少保留短语中的否定词

### 6.3 压缩逻辑调整

当前逻辑（句首2 + 句尾2 + 中段配额）保留，但：

- `targetCount` 从硬编码 `10` 改为 `getNoteDensityTargetCount(effectiveCount, mode)`
- 中段配额根据 mode 动态调整
- 增加 `protected` note 的强制保留逻辑

## 七、统一事件入口

确认以下函数都从 `textToEvents()` 获取压缩后事件：

- `playText()`
- `refreshNoteDisplay()`
- `calculateAudioDuration(events)`
- `renderAudioToBuffer(events, offlineContext)`
- `exportToWAV()`

如果任何函数绕过 `textToEvents()` 直接调用 `textToNotes()`，需要修正。

## 八、日志输出

在 `applyNoteDensityReduction` 中，当压缩实际发生时输出一次：

```javascript
console.log('[NoteDensityReducer]', {
  mode,
  originalText,
  effectiveCount,
  targetCount,
  beforeNotes: noteEvents.length,
  afterNotes: reducedNoteCount
});
```

只在压缩发生时输出，避免每次输入都打 log。

## 九、QA 用例（施工后必须跑）

### Case 1: 自然模式
```javascript
params.noteDensityMode = 'natural';
textToEvents('你不要过去那里好像有点不太对劲')
  .filter(e => e.type === 'note')
  .map(e => e.char).join('');
```
- 期望：长度 <= 10
- 期望：包含「不」
- 禁止：变成「你不要过去那里好对劲」（破坏「不太对劲」语义）

### Case 2: 简洁模式
```javascript
params.noteDensityMode = 'compact';
```
- 期望：长度 <= 7
- 期望：仍保留否定感

### Case 3: 极简模式
```javascript
params.noteDensityMode = 'minimal';
```
- 期望：长度 <= 4
- 期望：不完全丢失否定词

### Case 4: 完整模式
```javascript
params.noteDensityMode = 'full';
```
- 期望：不压缩，接近原始字符数

### Case 5: 有标点不处理
```javascript
params.noteDensityMode = 'natural';
textToEvents('你不要过去，那里好像有点不太对劲。');
```
- 期望：默认不压缩（有 pause 事件）

### Case 6: 短句不处理
```javascript
textToEvents('别过去');
```
- 期望：3 个 note，不压缩

### Case 7: 角色名保护
```javascript
textToEvents('小牧你不要过去那里好像有点不太对劲');
```
- 期望：`characterVoice: 小牧` 保留
- 期望：后半句按 natural 模式压缩

### Case 8: 导出一致性
```javascript
const events = textToEvents('你不要过去那里好像有点不太对劲');
const noteCount = events.filter(e => e.type === 'note').length;
```
- 期望：`noteCount` = 实时播放 note 数 = WAV render note 数
- 期望：导出 buffer 非静音

### Case 9: 运行时检查
```javascript
[
  typeof applyNoteDensityReduction,
  typeof getNoteDensityTargetCount,
  typeof NOTE_DENSITY_MODE_CONFIG
]
```
- 期望：`['function', 'function', 'object']`

### Case 10: LayoutGuard
```javascript
const wb = document.querySelector('.workbench');
[getComputedStyle(wb).display, wb.children.length]
```
- 期望：`['grid', 3]`

## 十、版本号

本次施工完成后：
- 更新 `nav-config.js` 中 `APP_VERSION` 为 **v3.28.0**
- 提交信息格式：`feat(synth): Note Density Reducer v2 - 发音密度模式 + 受保护短语`
- 推送后报出版本号

## 十一、禁止事项清单

| ❌ 禁止 | 说明 |
|---------|------|
| 修改 textInput.value | 只改 events，不改 DOM 输入 |
| 删除字幕原文 | 字幕保持完整 |
| 压缩有标点句 | 默认不压缩，保留 pause |
| 压缩 characterVoice | 100% 保留 |
| 压缩 phraseMidi | 100% 保留 |
| 只改 playText 不改 export | 统一走 textToEvents |
| 破坏 Expression Segment | 不要改 center-tabs 相关 |
| 破坏歌曲 MIDI 模式 | 不要改 song-related 函数 |
| 改 .workbench 三栏 | grid + 3子元素保持 |
| 引入全局脚本错误 | 每次改完跑 `new Function()` 语法检查 |

---

**施工完成后汇报格式**：
1. 新增乐器列表 → 无（本次不改乐器）
2. 采样覆盖情况 → 无（本次不改采样）
3. 已验证功能 → 按 Case 1~10 逐个报结果
4. LayoutGuard 结果 → grid + 3子元素确认
5. 已知限制 → 如有保留
