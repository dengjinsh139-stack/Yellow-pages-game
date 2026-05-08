# 乐器语言合成器 — 设计框架文档

**版本**: v3.25.9  
**文件**: `sound-effects/instrument-language-synth.html` (~8750 行)  
**架构**: 单文件零后端 HTML 应用，直接部署到 GitHub Pages

---

## 目录

1. [整体架构](#1-整体架构)
2. [音频引擎](#2-音频引擎)
3. [乐器系统](#3-乐器系统)
4. [音符映射引擎](#4-音符映射引擎)
5. [文字演奏主链路](#5-文字演奏主链路)
6. [MIDI 系统](#6-midi-系统)
7. [角色声纹系统](#7-角色声纹系统)
8. [Expression Segment Auto Curve](#8-expression-segment-auto-curve)
9. [WAV 导出系统](#9-wav-导出系统)
10. [参数与状态系统](#10-参数与状态系统)
11. [乐器入库标准](#11-乐器入库标准)
12. [已知问题与注意事项](#12-已知问题与注意事项)

---

## 1. 整体架构

### 1.1 页面结构

```
┌─────────────────────────────────────────────┐
│  导航栏 (nav-config.js 统一管理版本号)         │
├─────────────────────────────────────────────┤
│  启动遮罩层 (startOverlay) — 点击启动音频引擎  │
├─────────────────────────────────────────────┤
│  音频工具栏 (audioToolbar) — 隐藏              │
├─────────────────────────────────────────────┤
│                                               │
│  ┌─────────┬─────────────┬──────────┐       │
│  │ 左栏    │   中栏       │  右栏    │       │
│  │         │              │          │       │
│  │ 乐器选择 │  可视化      │  参数    │       │
│  │ 预设短语 │  频谱        │  控制器  │       │
│  │ 歌曲MIDI │  音符键盘    │  状态    │       │
│  │ 语义分类 │  音符序列    │  历史    │       │
│  │ 角色声纹 │              │  关于    │       │
│  │ 高级设置 │              │          │       │
│  └─────────┴─────────────┴──────────┘       │
│                                               │
└─────────────────────────────────────────────┘
```

### 1.2 三栏骨架（不可破坏）

```css
.workbench {
    display: grid;
    grid-template-columns: 280px 1fr 300px;
    gap: 20px;
}
.left-panel   { /* 乐器选择 + 预设 + 歌曲 + 语义 + 角色声纹 + 高级 */ }
.center-panel { /* 可视化 + 键盘 + 序列 */ }
.right-panel  { /* 参数控制 + 状态 + 历史 + 关于 */ }
```

**⚠️ 黄金规则**: 任何新乐器、新功能、新面板都不能破坏这个三栏 grid 骨架。

### 1.3 单文件架构

| 段落 | 行数 | 内容 |
|------|------|------|
| `<head>` | ~40 行 | meta、title、Tone.js MIDI 库、版本注入 |
| `<style>` | ~2000 行 | CSS 变量、三栏布局、动画、响应式、暗色主题 |
| HTML 结构 | ~800 行 | 三栏骨架、按钮、输入框、面板 |
| JavaScript | ~5800 行 | 全部逻辑（见下文拆分） |

---

## 2. 音频引擎

### 2.1 AudioContext 生命周期

```
[未启动] → 点击遮罩层 → initAudio() → audioContext 创建 → 加载钢琴采样
                                              ↓
                                         [运行中]
                                              ↓
                                     可切换乐器、播放、导出
```

**关键状态变量**:
```javascript
let audioContext;           // 主实时音频上下文
let analyser;               // 频谱分析器
let masterGain;             // 主音量增益节点
let canvas, canvasCtx;      // 可视化 Canvas
let animationId;           // requestAnimationFrame ID
```

### 2.2 音频图 (Audio Graph)

```
┌─────────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│ 音源        │───→│ 乐器增益  │───→│ 效果链   │───→│ analyser │
│ (BufferSource│    │ (per-note)│    │ (EQ/HPF/│    │          │
│  /Oscillator)│   │           │    │  Reverb)│    │          │
└─────────────┘    └──────────┘    └────┬────┘    └────┬─────┘
                                         │                │
                                         └───────────────→│
                                                          ↓
                                                    ┌──────────┐
                                                    │ destination│
                                                    │ (扬声器)   │
                                                    └──────────┘
```

### 2.3 混响链 (Reverb Chain)

```javascript
// 实时播放
干声 → convolver (混响) → wetGain ─┐
                                   ├──→ 合并 → destination
原声 → dryGain ────────────────────┘

// 导出时统一使用 createExportReverbChain()
```

---

## 3. 乐器系统

### 3.1 乐器注册表 (INSTRUMENT_REGISTRY)

```javascript
const INSTRUMENT_REGISTRY = {
    'piano':        { id: 'piano',        label: '钢琴',       emoji: '🎹', ... },
    'guitar':       { id: 'guitar',       label: '虚拟人声',   emoji: '🎸', ... },
    'flute':        { id: 'flute',        label: '长笛',       emoji: '🪈', ... },
    'xylophone':    { id: 'xylophone',    label: '木琴',       emoji: '🎹', ... },
    'waterdrop':    { id: 'waterdrop',    label: '水滴合成器', emoji: '💧', ... },
    'saxophone':    { id: 'saxophone',    label: '萨克斯',     emoji: '🎷', ... },
    'synth':        { id: 'synth',        label: '合成器',     emoji: '🎛️', ... },
    'train':        { id: 'train',        label: '火车',       emoji: '🚂', ... },
    'mouthtrumpet': { id: 'mouthtrumpet', label: '嘴巴小号',   emoji: '🎺', ... },
    'kalimba':      { id: 'kalimba',      label: '卡林巴',     emoji: '✨', ... },
    'smallrobot':   { id: 'smallrobot',   label: 'Small机器人', emoji: '🤖', ... },
    'bigrobot':     { id: 'bigrobot',     label: 'Big机器人',   emoji: '🤖', ... },
};
```

**⚠️ 这是唯一真理来源**，禁止在任何地方手写 instrument id。

### 3.2 采样乐器 vs 合成乐器

| 乐器 | 类型 | 采样数量 | 加载方式 |
|------|------|----------|----------|
| piano | 采样 | 10 (D4~B5) | `loadSamples()` |
| guitar | 采样 | 10 vocal | `loadVocalSamples()` |
| flute | 采样 | 10 | `loadFluteSamples()` |
| xylophone | 采样 | 10 | `loadXylophoneSamples()` |
| waterdrop | 采样 | 10 | `loadWaterdropSamples()` |
| saxophone | 采样 | 10 | `loadSaxophoneSamples()` |
| synth | 采样 | 10 | `loadSynthSamples()` |
| train | 采样 | 10 | `loadTrainSamples()` |
| mouthtrumpet | 采样 | 10 | `loadMouthtrumpetSamples()` |
| kalimba | 采样 | 10 | `loadKalimbaSamples()` |
| smallrobot | 采样 | 10 | `loadSmallrobotSamples()` |
| bigrobot | 采样 | 10 | `loadBigrobotSamples()` |

### 3.3 采样配置 (sampleConfig)

```javascript
const sampleConfig = {
    'piano': {
        basePath: '../sound-effects/piano-samples/',
        samples: {
            'D4': { file: 'D4.mp3', freq: 293.66 },
            'E4': { file: 'E4.mp3', freq: 329.63 },
            // ... 共10个
        }
    },
    // 每个乐器一份
};
```

### 3.4 乐器切换链路

```
用户点击乐器按钮
    ↓
selectInstrument(instrument)
    ↓
[检查 audioContext 是否初始化]
    ├── 未初始化: 记录 pendingInstrument, 更新 UI, 提示"请先启动音频引擎"
    └── 已初始化: 继续
    ↓
pendingInstrument = instrument
    ↓
disablePlaybackControls()  // 禁用播放按钮
    ↓
ensureInstrumentReady(instrument) // 加载采样（带缓存）
    ↓
[检查 hasInstrumentSamples]
    ├── 已就绪: 直接返回 true
    └── 未就绪: 创建 instrumentLoadPromises[instrument] 异步加载
    ↓
currentInstrument = instrument
pendingInstrument = null
    ↓
applyInstrumentDefaults(instrument) // 应用默认参数
    ↓
generateNoteKeyboard() // 重新生成键盘
    ↓
enablePlaybackControls() // 启用播放
    ↓
播放试听音 (playSampleTone 440Hz)
```

### 3.5 Race Condition 防护

```javascript
// 切乐器时
pendingInstrument = instrument;        // 记录目标
// 加载期间 currentInstrument 不变    // 旧乐器仍可播放
disablePlaybackControls();             // 禁止播放
await ensureInstrumentReady();         // 异步加载
// 加载完成后
currentInstrument = instrument;        // 正式切换
pendingInstrument = null;
enablePlaybackControls();
```

**⚠️ P0 教训**: 不能直接 `await loadInstrumentSamples(); currentInstrument = instrument;`，必须在加载完成后再更新 currentInstrument。

---

## 4. 音符映射引擎

### 4.1 五声音阶

```javascript
const pentatonicNotes = ['D4', 'E4', 'F4', 'A4', 'B4', 'D5', 'E5', 'F5', 'A5', 'B5'];
// 中国传统五声音阶：宫(D)、商(E)、角(F#→F)、徵(A)、羽(B)
// 去掉 G4/G5 保持 10 键对齐
```

### 4.2 两种映射模式

| 模式 | 名称 | 映射方式 | 适用场景 |
|------|------|----------|----------|
| `dialogue-fixed` | 对白固定 | 根据字符 hash 固定映射到 5 个核心音 | 默认模式 |
| `legacy-tone-region` | 传统音区 | 按声调映射到不同音区 | 经典模式 |

**核心音符** (dialogueCoreNotes):
```javascript
['A4', 'B4', 'D5', 'E5']  // 5个核心音 + F5 轻声/无声调
```

**legacy 音区**:
```javascript
const legacyToneRegions = [
    { notes: ['D4','E4','F4'],    name: '低音区',  range: [1,4] },   // 四声
    { rest: true,                  name: '休止区',  range: [5,5] },   // 轻声
    { notes: ['A4','B4','D5'],    name: '中音区',  range: [6,10] },  // 一声
    { notes: ['E5','F5','A5'],    name: '高音区',  range: [11,16] }, // 二声
    { notes: ['B5'],              name: '顶音区',  range: [17,20] }  // 三声
];
```

### 4.3 charToNote 映射

```javascript
function charToNote(char, mappingMode = 'dialogue-fixed') {
    // dialogue-fixed: 字符 hash → 核心音
    // legacy-tone-region: 字符 hash + 音高归一化 → 音区音
}
```

### 4.4 标点气口系统

```javascript
const dialoguePunctuationPauses = {
    '，': 220, '、': 180, '。': 420, '？': 380,
    '！': 360, '：': 260, '；': 300, '…': 700, '—': 320
};
```

---

## 5. 文字演奏主链路

### 5.1 完整链路

```
用户输入文本
    ↓
playText()
    ↓
analyzeEmotion(text)              // 情感分析（影响全局参数）
    ↓
textToEvents(text)                // 文本 → 事件序列
    ├── 语义分类检测 → 插入 phraseMidi 事件
    ├── 逐字分音 → note/pause/characterVoice 事件
    └── 标点气口 → pause 事件
    ↓
applyExpressionSegments(events, segments)  // Expression Segment 参数注入
    ↓
playEventSequence(events)          // 顺序播放事件
    ├── note 事件 → playTone() 或 playSampleTone()
    ├── pause 事件 → sleep()
    ├── phraseMidi 事件 → playMidiData()
    └── characterVoice 事件 → playCharacterVoice()
    ↓
可视化更新 + 历史记录
```

### 5.2 事件类型

```javascript
// 普通音符
{ type: 'note', note: 'D4', frequency: 293.66, duration: 300, velocity: 0.8,
  char: '你', position: 0, mappingMode: 'dialogue-fixed',
  expressionTempoScale: 1.0, expressionVelocityScale: 1.0,
  expressionCurveType: 'flat', expressionCurveFactor: 1.0,
  expressionSegmentId: 0, expressionPauseAfterMs: 0 }

// 停顿
{ type: 'pause', pauseMs: 220 }

// 语义 MIDI
{ type: 'phraseMidi', category: 'comfort', position: 5 }

// 角色声纹
{ type: 'characterVoice', character: '小牧', position: 0,
  expressionTempoScale: 1.0, expressionVelocityScale: 1.0,
  expressionCurveType: 'flat', expressionCurveFactor: 1.0 }
```

### 5.3 播放调度

```javascript
// 实时播放时事件的时间推进
let currentTime = audioContext.currentTime;
for (const evt of events) {
    if (evt.type === 'pause') {
        currentTime += evt.pauseMs / 1000;
    } else if (evt.type === 'note') {
        playToneAtTime(evt, currentTime);
        currentTime += (evt.duration * tempoScale * curveFactor) / 1000;
    }
    // ...
}
```

---

## 6. MIDI 系统

### 6.1 歌曲 MIDI

```
用户选择 MIDI 文件
    ↓
handleMidiFile(event)  // 文件选择处理器
    ↓
parseMidi(arrayBuffer) // @tonejs/midi
    ↓
playMidi(midiData)     // 解析音符 → 按 BPM 播放
```

### 6.2 语义触发 MIDI

```javascript
// 预置 MIDI 文件
const phraseTriggerCategories = {
    'comfort': { name: '安慰', emoji: '🤗', midiFile: '../midis/comfort.mid', ... },
    // 更多分类...
};

// 触发方式
textToEvents() 检测到关键词 → 插入 phraseMidi 事件
    ↓
playEventSequence 遇到 phraseMidi → 加载并播放对应 MIDI
```

### 6.3 MIDI 播放计算

```javascript
const msPerTick = 60000 / (params.bpm * midiData.ticksPerQuarter);
// 每个 MIDI 事件的时间 = tick * msPerTick
```

---

## 7. 角色声纹系统

### 7.1 角色注册

```javascript
const characterVoiceRegistry = {
    '小牧':   { voiceId: 'xylophone', shaping: null },   // 木琴
    '艾米':   { voiceId: 'piano',     shaping: null },   // 钢琴
    '芙洛芙': { voiceId: 'flute',     shaping: null },   // 长笛
};
```

### 7.2 Voice Shaping 解析链

```javascript
resolveVoiceShaping(characterName)
    → 全局 shaping (params.voiceShaping)
    → 乐器默认 shaping (voiceRegistry[instrument].defaultShaping)
    → 角色覆盖 shaping (characterVoiceRegistry[characterName].shaping)
```

### 7.3 BPM 缩放 (V3.25.9)

```javascript
const CHARACTER_VOICE_BASE_BPM = 120;

// 实时播放 / 时长计算 / 离线导出 统一使用：
const bpmScale = params.bpm / CHARACTER_VOICE_BASE_BPM;
const finalPlaybackRate = clamp(bpmScale * expressionTempoScale * expressionCurveFactor, 0.5, 2.0);

// 应用到 source.playbackRate.value
// 时长 = audioBuffer.duration / finalPlaybackRate + pauseAfterMs/1000
```

### 7.4 三条路径

| 路径 | 函数 | BPM 缩放 |
|------|------|----------|
| 实时播放 | `playCharacterVoice()` | ✅ finalPlaybackRate |
| 时长计算 | `calculateAudioDuration()` | ✅ finalPlaybackRate |
| WAV 导出 | `renderAudioToBuffer()` | ✅ finalPlaybackRate |

---

## 8. Expression Segment Auto Curve

### 8.1 生成流程

```
用户输入文本
    ↓
点击「自动生成」
    ↓
generateExpressionSegments()
    ├── splitTextIntoSegments(text)  // 按标点切分
    └── autoCurveExpressionSegments(rawSegments)  // V1 自动分析
    ↓
renderExpressionSegments()  // 渲染段卡片 UI
```

### 8.2 V1 自动分析维度

| 维度 | 触发条件 | tempoScale | velocityScale | pauseAfterMs | curveType |
|------|----------|------------|---------------|--------------|-----------|
| 疑问句 | `？` | 0.88 | 1.05 | 350 | hesitate |
| 惊叹句 | `！` | 1.08 | 1.18 | 420 | accelerate |
| 省略号 | `……` | 0.78 | 0.85 | 650 | hesitate |
| 逗号 | `，` | 0.95 | 0.95 | 180 | decelerate |
| 分号 | `；` | 0.92 | 0.98 | 280 | easeInOut |
| 句号 | `。` | 0.92 | 0.88 | 300 | decelerate |
| 命令词 | 来去快上走冲… | 1.12 | 1.15 | — | accelerate |
| 危险词 | 小心危险爆炸… | 0.85 | 1.22 | +250 | hesitate |
| 安慰词 | 安心放心别怕… | 0.90 | 0.88 | — | easeInOut |
| 犹豫词 | 嗯呃可能好像… | 0.88 | 0.82 | — | hesitate |
| 重复字 | 连续≥3字重复 | 1.08 | 1.05 | — | accelerate |
| 长句 | ≥12字 | -0.05 | — | — | — |
| 短句 | ≤3字 | +0.05 | — | — | — |

### 8.3 边界钳制

```javascript
tempoScale = clamp(0.75, 1.25, tempoScale);
velocityScale = clamp(0.75, 1.30, velocityScale);
pauseAfterMs = clamp(0, 800, pauseAfterMs);
```

### 8.4 手动覆盖机制

```javascript
// 用户修改段参数时
updateSegment(index, field, value)
    → expressionSegments[index]._manual = true

// 再次点击「自动生成」时
autoCurveExpressionSegments()
    → 若 existing._manual === true: 保留手动值
    → 若 existing._manual === false: 重新分析
```

UI 标识: **⚡自动** / **✏️手动**

### 8.5 应用到事件

```javascript
applyExpressionSegments(events, segments)
    → 字符→段映射
    → 每个 event 注入 expressionTempoScale / expressionVelocityScale
    → 段内最后一个 event 注入 expressionPauseAfterMs
    → 段内逐字计算 expressionCurveFactor
```

---

## 9. WAV 导出系统

### 9.1 导出链路

```
用户点击「导出 WAV」
    ↓
exportWav()
    ├── calculateAudioDuration(events)  // 计算总时长
    ├── OfflineAudioContext(duration, sampleRate)
    ├── renderAudioToBuffer(events, offlineContext)
    │   ├── 创建 exportReverbChain（统一混响）
    │   ├── 遍历 events 顺序渲染
    │   │   ├── note → renderNoteToBuffer()
    │   │   ├── characterVoice → renderCharacterVoice()
    │   │   └── pause → 推进时间
    │   └── destination 连接
    └── 编码为 WAV Blob → 自动下载
```

### 9.2 实时与导出统一

```javascript
// 实时播放
playSampleTone(freq, note, duration, velocity)
    → createReverbChain(audioContext)  // 实时混响

// 导出
renderNoteToBuffer(note, offlineContext, currentTime)
    → createExportReverbChain(offlineContext)  // 导出混响

// 两者使用同一 playSampleTone / renderSampleToBuffer 核心逻辑
```

---

## 10. 参数与状态系统

### 10.1 全局默认参数

```javascript
const defaultParams = {
    bpm: 120,               // BPM速度
    notesPerBeat: 1,        // 每拍音符数（所有乐器统一为1）
    masterVolume: 100,      // 全局音量
    audioOffset: 0,         // 音频偏移
    tempoMin: 200,          // 播放间隔最小
    tempoMax: 400,          // 播放间隔最大
    tempoRandom: true,      // 随机波动
    noteDuration: 500,      // 音符时长
    reverb: 0,              // 混响（全局默认0）
    chordDuration: 4,       // 和弦长度
    rhythmRandom: false,    // 节奏随机
    voiceShaping: {         // Voice Shaping 全局默认
        hpfFreq: 100, mudCutFreq: 250, mudCutGain: -2,
        highCutFreq: 10000, highCutGain: -1,
        attackMs: 5, releaseMs: 100, overlapMs: 10, semanticGap: 100
    }
};
```

### 10.2 乐器级默认参数 (instrumentDefaults)

每个乐器独立一套默认值，切换时自动应用。

### 10.3 状态变量

```javascript
let isPlaying = false;           // 是否正在播放
let currentInstrument = 'piano';   // 当前乐器
let pendingInstrument = null;    // 待加载乐器
let instrumentLoading = false;   // 采样加载中
let expressionSegments = [];     // 表达段数组
let samplesLoaded = false;        // 钢琴采样是否加载
let chordsLoaded = false;         // 和弦是否加载
const instrumentLoadPromises = {}; // 乐器加载 Promise 缓存
```

---

## 11. 乐器入库标准

### 11.1 必备字段

```javascript
{
    id: 'instrument_id',
    name: '中文名',
    englishName: 'English Name',
    type: 'sample',
    category: 'percussion/melodic/effect',
    basePath: '../sound-effects/instrument-samples/',
    defaultVolume: 1.0,
    attack: 0.01,
    release: 0.3
}
```

### 11.2 必须接入的播放路径

1. **文字演奏**: `playText()` → `textToEvents()` → `charToNote()` → `playTone()`
2. **WAV导出**: `renderAudioToBuffer()` → `exportWav()`
3. **歌曲 MIDI**: `playMidi()`
4. **语义触发 MIDI**: `textToEvents()` 检测关键词
5. **角色声纹**: `characterVoiceConfig` / `characterVoiceRegistry` / `playCharacterVoice()`

### 11.3 入库检查清单

| 步骤 | 内容 |
|------|------|
| 1 | UI `data-instrument="instrument_id"` |
| 2 | INSTRUMENT_REGISTRY 注册 |
| 3 | `instrumentDefaults[instrument_id]` 默认参数 |
| 4 | `sampleConfig[instrument_id]` 采样配置 |
| 5 | `loadInstrumentSamples` 注册 loader |
| 6 | `hasInstrumentSamples(instrument_id)` 检查 |
| 7 | `instrumentOffsets` / `voiceRegistry` / `noteVolumes` / `chordVolumes` 注册 |
| 8 | `instrumentColors` / `activeColors` / CSS 变量 `--instrument_id` |
| 9 | `playTone` 中注册采样分支 |
| 10 | `isSampleInstrument` 加入导出路径 |
| 11 | `waveTypeMap` 注册 |
| 12 | 所有名称映射（instrumentNames / exportNames / statusNames） |

---

## 12. 已知问题与注意事项

### 12.1 P0 问题

| 问题 | 位置 | 状态 |
|------|------|------|
| `handleMidiFile` 重复定义 | 第6503行 + 第8219行 | ⚠️ 待处理（暂未导致明显故障） |

### 12.2 技术债务

| 问题 | 说明 |
|------|------|
| 125 处 `console.log` | 调试残留，可选清理 |
| 31 处 `/* ... */` 注释块 | CSS 段注释，无害 |
| 614 处 `// ...` 单行注释 | 旧代码注释，无害 |

### 12.3 设计限制

| 限制 | 说明 |
|------|------|
| playbackRate 改变音高 | 角色声纹 BPM 缩放会同时改变速度和音高，V1 接受此设计 |
| 单文件规模 | ~8750 行，继续增长需考虑拆分为 modules |
| Safari 兼容性 | 需手动恢复 suspended audioContext |
| 无 time-stretch | 角色声纹未做时间拉伸，仅靠 playbackRate |

---

## 附录：版本历史（近期）

| 版本 | 日期 | 改动 |
|------|------|------|
| v3.24.1 | 2026-04-20 | legacy-tone-region 稳定 hash 修复 |
| v3.24.7 | 2026-04-22 | 卡林巴采样入库 |
| v3.24.10 | 2026-04-24 | Small机器人采样入库 |
| v3.25.0 | 2026-04-24 | Big机器人采样入库 |
| v3.25.1 | 2026-04-24 | 所有乐器默认发音密度统一为 1 |
| v3.25.2 | 2026-04-24 | 所有乐器默认混响归零 |
| v3.25.3 | 2026-04-24 | Expression Segment Auto Curve V1 |
| v3.25.4 | 2026-04-24 | P0 修复：音频引擎未启动时选乐器崩溃 |
| v3.25.5 | 2026-04-24 | 沙克斯→萨克斯 |
| v3.25.6 | 2026-04-24 | 合成器 notesPerBeat 8→1 |
| v3.25.9 | 2026-04-24 | 角色声纹 BPM 控制 V1 |

---

*文档生成于 2026-05-08*
