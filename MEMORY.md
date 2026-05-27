# MEMORY.md

## 乐器语言合成器 - 乐器入库规则

新增乐器必须遵守的标准（2026-05-07 用户制定）：

### 核心原则
1. **不破坏三栏骨架**：workbench 必须保持 grid、3子元素、left-panel/center-panel/right-panel
2. **不破坏现有功能**：文字演奏、MIDI、语义触发、角色声纹、两种映射模式、Expression Segment、实时/WAV导出
3. **不要随机不稳定**：legacy-tone-region 禁止 Math.random()，必须稳定映射

### 新乐器配置标准
- 必备字段：id, name, englishName, type, category, basePath, defaultVolume, attack, release
- dialogueCoreNotes: ['A4','B4','D5','E5']
- legacyRequiredNotes: D4,E4,F4,A4,B4,D5,E5,F5,A5,B5
- fallbackPolicy: 'nearest-sample-preferred'（缺采样优先 nearest sample 变调，不直接切 synth）

### 必须接入的播放路径
1. 文字演奏：playText() → textToEvents() → charToNote() → playTone()
2. WAV导出：renderAudioToBuffer() → exportWav()（实时和导出用同一逻辑）
3. 歌曲MIDI
4. 语义触发MIDI
5. 角色声纹：characterVoiceConfig / characterVoiceRegistry / playCharacterVoice()

### Race Condition 防护（P0历史问题）
- 切乐器时立即记录 pendingInstrument / selectedInstrument
- 播放前检查 core notes 是否 ready
- 未 ready 禁用按钮或 await ensureInstrumentCoreReady()
- 不能只做 await loadInstrumentSamples(); currentInstrument = instrument;

### 🆕 新增乐器入库流程（2026-05-25 制定，2026-05-27 验证完善）
**按顺序执行，避免先传音频后代码不匹配的问题：**

1. **我先做代码骨架**（你们不需要提前传文件）
   - UI 添加 `instrument-btn` 按钮 + CSS 变量
   - `instrumentDefaults` 添加默认参数
   - `instrumentRegistry` / `instrumentMetadata` 注册乐器
   - `sampleConfig` 添加占位配置（走 synth fallback，确保有声）
   - `noteVolumes` 添加 10键音量映射（最容易漏！）
   - `chordVolumes` 添加和弦音量（容易漏！）
   - `loadInstrumentSamples` 添加 loader 映射
   - `loadXXXSamples` 添加占位函数
   - `hasInstrumentSamples` 适配检查
   - `playTone` 分支逻辑适配（synth fallback 列表）
   - `renderAudioToBuffer` isSampleInstrument 列表适配
   - `waveforms` 添加波形映射
   - 角色声纹如需新增 → 同步配置
   - **中文名称映射**（所有引用点统一检查：selectInstrument, ensureInstrumentReady, instrumentNames 等）
   - **instrumentColors / activeColors** 颜色主题

2. **推送 GitHub**
   - 更新 `nav-config.js` 版本号
   - `git push origin main`
   - **立即报出版本号**
   - **创建空采样目录 + .gitkeep**（让用户知道放哪）

3. **你们发音频文件**
   - 直接发群里（mp3/wav 都行）
   - 或上传到 GitHub `assets/audio/samples/[乐器ID]/`
   - 命名：`D4.mp3`, `E4.mp3`, `F4.mp3`, `A4.mp3`, `B4.mp3`, `D5.mp3`, `E5.mp3`, `F5.mp3`, `A5.mp3`, `B5.mp3`

4. **我接入采样**
   - 替换占位 `loadXXXSamples()` 为真实采样加载
   - 补全 `sampleConfig` 里的 `basePath` + `samples{}`
   - **移除 synth fallback 兜底**（从 playTone fallback 列表删除该乐器）
   - **删除 .gitkeep**（目录已有真实文件）
   - 跑 QA checklist（见下方）
   - 再次推送 + 报版本号 + 交付报告

**⚠️ 禁止反向操作：** 不要先发音频文件给我，等我先做好代码骨架。

### 新增乐器 QA Checklist（14项，逐条勾选）
每次新增乐器后，必须确认以下14项全部到位：

| # | 检查项 | 说明 | 常见遗漏 |
|---|--------|------|----------|
| 1 | CSS 变量 | `--instrument_id: #颜色` | |
| 2 | UI 按钮 | `instrument-btn` DOM | |
| 3 | instrumentDefaults | 默认参数（tempo/音量等） | |
| 4 | instrumentMetadata shaping | Voice Shaping 默认配置 | |
| 5 | sampleConfig | 采样路径 + gain 配置 | **高频遗漏！** |
| 6 | noteVolumes | 10键音量映射 | **高频遗漏！** |
| 7 | chordVolumes | 和弦音量 | |
| 8 | loadInstrumentSamples loader | 映射到 loadXXXSamples | |
| 9 | instrumentColors / activeColors | 颜色主题 | |
| 10 | hasInstrumentSamples | 检查 ready buffer | |
| 11 | playTone synth fallback | 采样未到位前兜底 | 采样到位后**移除** |
| 12 | ensureInstrumentReady names | 加载状态中文名 | |
| 13 | renderAudioToBuffer isSampleInstrument | WAV导出采样分支 | |
| 14 | waveforms | synth fallback 波形类型 | |
| 15 | loadXXXSamples 函数 | 实际采样加载逻辑 | |
| 16 | 中文名称映射 | selectInstrument, playTone, names 等所有引用点 | |

**交付时必须按格式汇报**：
- 新增乐器列表
- 采样覆盖情况
- 已验证功能
- LayoutGuard结果
- 已知限制

详细规则见 memory/2026-05-07.md

---
## Yellow-pages-game (我的工作站)

**GitHub 仓库**: `dengjinsh139-stack/Yellow-pages-game`
**网站地址**: https://dengjinsh139-stack.github.io/Yellow-pages-game/
**状态**: 公开仓库，GitHub Pages 已启用

### GitHub 身份认证
- Token 已移至环境变量 `GITHUB_TOKEN` 中管理
- 推送命令: `git push origin main`

### 当前版本: v3.24.5

**版本历史:**
- **v3.24.5** (2026-05-25) - 同步仓库当前版本号
- **v3.16.3** (2026-05-05) - UI/布局重构：右栏紧凑化（移除 overflow-y 滚动隐藏、压缩 Voice Shaping 高度、A/B 紧凑布局），左栏合并四个高级入口为单一「高级设置」，Effects 和 Export 首屏可见
- **v3.15.0** (2026-05-04) - 角色声纹WAV导出脱离实时audioContext依赖；findNearestSample防御性类型检查
- **v3.7.0** (2026-04-22) - 去掉 G4/G5 保持10键对齐，版本号统一动态读取 nav-config.js
- **v3.6.23** (2026-04-20) - 和弦时长规则统一：实时播放与导出共用 computeChordTiming()，修复 chordDuration=0 时导出仍渲染和弦的 bug
- **v3.6.22** (2026-04-20) - 和弦功能通用化：采样未加载时仍可播放和弦，覆盖所有乐器
- **v3.6.21** (2026-04-20) - 导出WAV功能全面修复（P0+P1）：修复btn id错误、严格对齐playSampleTone、统一混响链、加详细日志
- **v3.6.20** (2026-04-20) - 修复语法错误（第4035行重复闭合括号导致脚本无法解析）
- **v3.6.19** (2026-04-20) - 添加调试标记（SCRIPT_START/END、函数类型检查）
- **v3.6.18** (2026-04-20) - 事件绑定重构（inline onclick → JS 统一绑定）
- **v3.6.14** (2026-04-20) - 乐器语言合成器：启动按钮修复（函数暴露到全局 window）
- **v3.6.13** (2026-04-20) - 乐器语言合成器：导出混响修复（干声→湿声）
- **v3.6.12** (2026-04-20) - 乐器语言合成器：木琴导出进入正确采样分支
- **v3.6.10** (2026-04-20) - 乐器语言合成器：WAV 导出采样响度修复（对齐实时播放）
- **v3.6.9** (2026-04-20) - 乐器语言合成器：WAV 导出修复（钢琴静音 + 统一节奏引擎 + 静音检测）
- **v3.6.7** (2026-04-20) - 乐器语言合成器：修复音符高亮错位与后段漏音问题
- **v3.6.5** (2026-04-20) - 乐器语言合成器：标点符号气口系统
- **v3.4.1** (2026-04-16) - 统一版本号（修正与主站版本不一致问题），木琴完成全部10个真实采样
- **v3.4.1** (2026-04-16) - 统一版本号（修正与主站版本不一致问题），木琴完成全部10个真实采样
- v3.3.46 (2026-04-16) - 木琴完成全部10个真实采样 (D4,E4,F4,A4,B4,D5,E5,F5,A5,B5)
- v3.3.45 (2026-04-16) - 木琴添加 E4 真实采样
- v3.3.44 (2026-04-16) - 木琴添加 E5 真实采样
- v3.3.43 (2026-04-16) - 木琴添加 B5 真实采样
- v3.3.42 (2026-04-16) - 木琴添加 D4 真实采样
- v3.3.41 (2026-04-16) - 木琴添加 B4 真实采样
- v3.3.40 (2026-04-16) - 木琴添加 D5 真实采样
- v3.3.39 (2026-04-16) - 木琴添加 A4 真实采样
- v3.3.38 (2026-04-16) - 木琴添加 A5 真实采样
- **v3.3.37** (2026-04-16) - 乐器语言合成器：将"小提琴"改为"木琴"
- **v3.3.36** (2026-04-15) - 乐器语言合成器添加 WAV 音频导出功能
- **v3.3.35** (2026-04-15) - 乐器语言合成器添加乐器默认参数

### ⚠️ 导航栏隐藏约定（重要）
以下导航项已**永久隐藏**，不要恢复：
- 📁 项目 (projects-login.html)
- 📊 项目能力 (capabilities.html)
- 💰 理财相关 (finance-login.html)

保留项：🏠 首页、🎮 游戏中心、🎮 游戏世界、🎵 音频应用、📈 任务管理器
- 若未来 nav-config.js 更新时这些项被恢复，需再次删除
**统一版本号来源**：`nav-config.js` 中的 `APP_VERSION`，由 `pre-commit hook` 自动管理。
- **不要**在 HTML 中写死版本号（页面加载后 JS 会用 `APP_VERSION` 自动覆盖显示）
- 只改 `nav-config.js` 中的版本号，不要改 HTML 源码里的版本文字
- 新页面需要：`script src="../nav-config.js"`，然后 JS 用 `APP_VERSION` 替换 DOM
- Hook 规则：PATCH >= 40 时 MINOR + 1, PATCH = 0
- 推送前检查：`grep APP_VERSION nav-config.js` 确认是当前版本

### ⚠️ 推送约定（重要）
**每次 git push 时必须主动报出当前版本号。**
用户需要知道推送后的确切版本。推送后立即回复版本号，不要等用户问。

---
*Last updated: 2026-05-25 14:21*
