# 游戏世界链接验证报告

## 链接统计
- **游戏总数**: 51款
- **链接总数**: 153个 (每款游戏3个链接)
- **链接类型**: 实况、首曝CG、OST

## 验证状态
⚠️ **Bilibili反爬虫限制**: 由于Bilibili的安全风控策略，无法自动批量验证链接有效性。

## 链接格式检查
✅ 所有链接使用标准Bilibili BV号格式：`https://www.bilibili.com/video/BV{10位字符}`

## 手动验证方法
1. 访问游戏世界页面: https://dengjinsh139-stack.github.io/Yellow-pages-game/game-world.html
2. 点击任意游戏的实况/CG/OST链接
3. 检查是否能正常跳转到Bilibili视频页面

## 常见失效原因
- BV号错误或不完整
- 视频已被删除或下架
- 版权原因导致地区限制

## 更新链接方法
如发现有失效链接，请提供以下信息：
1. 游戏名称
2. 链接类型（实况/CG/OST）
3. 正确的Bilibili BV号

## 示例链接结构
```javascript
{
    name: '游戏名称',
    gameplayUrl: 'https://www.bilibili.com/video/BVxxxx',  // 实况
    cgUrl: 'https://www.bilibili.com/video/BVxxxx',        // 首曝CG
    ostUrl: 'https://www.bilibili.com/video/BVxxxx'        // OST
}
```

---
*报告生成时间: 2026-03-25*
*版本: v2.6.5*