git add sound-effects/instrument-language-synth.html && git commit -m "feat: Expression Segment Auto Curve V1

- 新增 autoCurveExpressionSegments() 函数
  - 根据标点(疑问/惊叹/省略/逗号/分号/句号)自动分配基础参数
  - 关键词检测: 命令/危险/安慰/犹豫
  - 重复字检测(连续≥3字重复)
  - 段长度影响(长句减速/短句加速)
  - V1 保守边界: tempoScale 0.75~1.25, velocityScale 0.75~1.30, pauseAfterMs 0~800
- 手动覆盖机制: updateSegment() 标记 _manual=true, Auto Curve 下次调用会保留
- 段卡片 UI 增加 ⚡自动/✏️手动 标识
- 复用现有 applyExpressionSegments 链路(实时播放+WAV导出)
- 版本 v3.25.2 → v3.25.3

约束验证:
✅ 未修改 charToNote
✅ 未修改 mappingMode
✅ 未修改乐器选择逻辑
✅ 未修改语义 MIDI
✅ 未修改角色声纹
✅ 未修改三栏布局" && git push origin main