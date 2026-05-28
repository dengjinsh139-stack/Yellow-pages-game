# 响度标准化方案 — 乐器语言合成器

## 目标：所有乐器切换时感知响度一致（-18 LUFS 基准）

## 当前问题诊断

1. **采样增益差异大**：`sampleConfig.gain` 1.5~2.5，无统一标准
2. **MasterVolume 人为补偿**：88%~120%，用于掩盖响度差异
3. **合成器硬编码衰减**：`playSynthTone` 中 `velocity * 0.3`，导出路径没有
4. **波形响度不均**：sawtooth 比 triangle 响约 8dB
5. **noteVolumes 全 1.0**：形同虚设

## 增益架构重构

### 1. 统一分层增益链

| 层级 | 作用 | 控制方式 |
|------|------|----------|
| Source Gain | 采样文件本身（统一归一化） | `sampleConfig.gain` → 全部 1.0 |
| Note Velocity | 演奏力度（MIDI/文字映射） | 用户控制 |
| Master Volume | 全局音量（用户滑块） | `params.masterVolume` |
| **响度补偿** | **乐器间响度标准化** | **`instrumentLoudnessCompensation`** |
| **波形补偿** | **合成器波形均衡** | **`waveformLoudnessCompensation`** |
| Voice Shaping | 音色塑形 | EQ链（不影响整体响度） |

### 2. 响度补偿表（初始值基于经验）

```javascript
const instrumentLoudnessCompensation = {
    piano:        1.00,  // 基准
    xylophone:    0.75,  // 木琴采样很亮
    flute:        0.70,  // 长笛采样偏响
    saxophone:    0.85,
    synth:        0.95,
    train:        0.95,
    guitar:       1.00,  // 虚拟人声
    waterdrop:    0.85,
    mouthtrumpet: 0.85,
    kalimba:      0.85,
    smallrobot:   0.85,
    bigrobot:     0.85,
    cuckoo:       0.85,
    cowbell:      0.85,
    wahguitar:    0.85,
    nylon_guitar: 0.85,
    otamatone:    0.85,
};
```

### 3. 合成器波形补偿

```javascript
const waveformLoudnessCompensation = {
    sine:      1.00,  // 基准
    triangle:  0.63,  // -4.0dB
    square:    0.63,  // -4.0dB
    sawtooth:  0.40,  // -8.0dB
};
```

### 4. 修改点清单

| # | 位置 | 修改内容 |
|---|------|----------|
| 1 | `sampleConfig` 所有乐器 | `gain` 统一改为 1.0 |
| 2 | `instrumentDefaults` 所有乐器 | `masterVolume` 统一改为 100 |
| 3 | `playSampleToneInternal` | `baseGain` → 用 `loudnessCompensation[instrument]` |
| 4 | `playSynthTone` | 移除硬编码 0.3，加入乐器补偿 + 波形补偿 |
| 5 | `renderSampleToBuffer` | 同样加入响度补偿 |
| 6 | `renderSynthToBuffer` | 加入乐器补偿 + 波形补偿 |
| 7 | `playNoteKey` | 加入响度补偿到 `finalVelocity` |
| 8 | `characterVoice` 合成路径 | 加入响度补偿 |

## 实施计划

1. 批量替换所有 `sampleConfig.gain` 为 1.0
2. 批量替换所有 `instrumentDefaults.masterVolume` 为 100
3. 添加补偿表常量
4. 修改播放函数链
5. 推送 + 验证

## 验证方法

1. 逐个乐器点击键盘同一音符，主观听感响度是否一致
2. 导出 WAV 后，用外部工具（如 Audacity 的响度分析）测量
3. 如果某乐器过响/过轻，调整补偿表对应值
