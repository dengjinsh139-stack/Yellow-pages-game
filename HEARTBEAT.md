# HEARTBEAT.md - 系统心跳检查

## 状态自动更新通知处理

当收到 cron 状态更新通知时：
1. 确认 /root/.openclaw/workspace/status.json 存在且已更新
2. 提取关键指标（负载、提交数、文件数）
3. 简短确认更新成功

## 检查清单

- [ ] 状态文件可读
- [ ] 时间戳已更新
- [ ] 负载数据正常 (<80%)

## 异常情况处理

- 状态文件不存在 → 手动运行 update_status.py
- 负载过高 (>80%) → 提醒用户检查系统
- 备份失败 → 记录到 memory/YYYY-MM-DD.md
