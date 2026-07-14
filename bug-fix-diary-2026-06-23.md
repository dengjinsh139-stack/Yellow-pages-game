# 修复日记 - 2026-06-23

**版本号**: v3.49.4
**提交**: `083fecd`
**范围**: P1 + P2 级别 Bug 修复

---

## 修复清单

### ✅ P1-004: 清理 synth fallback 列表

**问题**: kalimba, smallrobot, bigrobot, cuckoo, cowbell, toy_piano 采样已到位，但仍走 synth fallback

**修改**: 删除 `playTone` 中 fallback 分支的 6 个乐器

```javascript
// 修改前:
if (['kalimba', 'smallrobot', 'bigrobot', 'cuckoo', 'cowbell', 'toy_piano'].includes(currentInstrument)) {
    return playSynthTone(frequency, duration / 1000, velocity, attackMsOverride);
}

// 修改后:
// 已移除：kalimba, smallrobot, bigrobot, cuckoo, cowbell, toy_piano 采样已到位，不再走 synth fallback
```

**QA 验证**: ✅ grep 确认 synth fallback 列表不再包含这 6 个乐器

---

### ✅ P1-006: 统一 instrumentNames 三处定义

**问题**: 第 4932 行、6364 行、8264 行各有一份 `instrumentNames`，内容不一致

**修改 1** (第 4932 行): 补齐缺失的 7 个乐器
- `kalimba`, `smallrobot`, `bigrobot`, `nylon_guitar`, `toy_reed`, `toy_piano`, `toy_keyboard`

**修改 2** (第 6364 行): 补齐缺失的 4 个乐器
- `nylon_guitar`, `otamatone`, `toy_reed`, `toy_piano`, `toy_keyboard`

**QA 验证**: ✅ 三处 instrumentNames 均已包含全部 24 个乐器

---

### ✅ P1-007: legacy-tone-region 双路径一致性

**问题**: 实时播放和导出的音符可能不同

**检查结果**: 实时播放和导出共用 `textToEvents` → `charToNote` → `createLegacyToneRegionNoteEvent`，均使用稳定 hash `(char.charCodeAt(0) + tone * 31) % availableNotes.length`

**结论**: ✅ 已一致，无需修改

---

### ✅ P2-008: 更新 cache-bust 时间戳

**问题**: HTML 底部注释时间戳为 5月27日 (1779892028)，已过时一个月

**修改**:
```html
<!-- 修改前: v3.39.11 cache-bust: 1779892028 -->
<!-- 修改后: v3.49.4 cache-bust: 1782145024 -->
```

**QA 验证**: ✅ grep 确认时间戳已更新为当前时间

---

### ℹ️ P1-005: instrumentDefaults 完整性

**问题**: 缺少 otamatone, toy_reed, toy_piano, toy_keyboard, glass_piano, violin2, cello2, hanpan 的默认参数

**检查结果**: 实际代码中 instrumentDefaults 已完整包含全部 24 个乐器

**结论**: ✅ 已完整，无需修改

---

### ℹ️ P2-009: cuckoo 采样格式 (.wav vs .mp3)

**问题**: cuckoo 使用 .wav，其他乐器用 .mp3

**结论**: ℹ️ 设计差异，cuckoo 鸟鸣采样用 wav 保证音质，不影响功能

---

### ℹ️ P2-010: cello2 残留

**问题**: v3.47.5 删除"大提琴"后，"大提琴2"仍存在

**结论**: ℹ️ 非残留，cello2 是 v3.47.1 新增的有效乐器，与已删除的 cello 是不同乐器

---

## 提交记录

```
commit 083fecd
Author: Kimi Claw Backup Bot <kimi-claw@auto.backup>
Date:   Tue Jun 23 00:22:00 2026 +0800

    fix(P1-P2): sync instrumentNames, remove synth fallback, update cache-bust v3.49.4

    sound-effects/instrument-language-synth.html | 22 ++++++++++++++--------
    1 file changed, 14 insertions(+), 8 deletions(-)
```

---

## 未修复 (P0 级别)

以下问题仍需后续处理：

1. **P0-001: 版本号三重不一致**
   - 根目录 `v3.49.4` vs 子仓库 `v3.47.7` vs 代码内联 `v3.39.11`
   - 建议: 删除代码内联 APP_VERSION，改为从 nav-config.js 动态读取

2. **P0-002: 双仓库不同步**
   - 根目录和 Yellow-pages-game/ 子仓库为独立 git 仓库
   - 建议: 统一为单仓库或建立同步机制

3. **P0-003: 手碟采样未同步到子仓库**
   - 子仓库 hanpan 采样仍为旧文件 (6月18日)
   - 建议: 将根目录新采样同步到子仓库

---

## 遗留检查项

- [ ] 线上版本号确认 (GitHub Pages 实际部署版本)
- [ ] nav-config.js 版本号与代码内联版本号统一
- [ ] 所有乐器切换后参数是否正确加载
- [ ] WAV 导出功能在各乐器上的稳定性
