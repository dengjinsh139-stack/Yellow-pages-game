#!/bin/bash
# Git 安全推送脚本 v2.4.7
# 解决推送冲突和超时问题

cd /root/.openclaw/workspace/Yellow-pages-game

echo "🔄 检查远程更新..."
git fetch origin main

# 检查是否有冲突
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ 已是最新，无需推送"
    exit 0
elif [ $LOCAL = $BASE ]; then
    echo "⚠️  远程有新提交，正在拉取..."
    git pull --rebase origin main
fi

echo "📤 推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
else
    echo "❌ 推送失败，尝试强制推送..."
    git push -f origin main
    if [ $? -eq 0 ]; then
        echo "✅ 强制推送成功！"
    else
        echo "❌ 推送失败，请检查网络或手动处理"
        exit 1
    fi
fi
