#!/bin/bash
# Git pre-commit hook - 自动递增版本号
# 将此文件复制到 .git/hooks/pre-commit 并赋予执行权限

VERSION_FILE="nav-config.js"

# 获取当前版本号
CURRENT_VERSION=$(grep "const APP_VERSION" "$VERSION_FILE" | grep -o "'v[0-9]\+\.[0-9]\+\.[0-9]\+'" | tr -d "'")

if [ -z "$CURRENT_VERSION" ]; then
    echo "❌ 无法找到版本号"
    exit 1
fi

# 解析版本号各部分
MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1 | tr -d 'v')
MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
PATCH=$(echo "$CURRENT_VERSION" | cut -d. -f3)

# 递增补丁版本号
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="v${MAJOR}.${MINOR}.${NEW_PATCH}"

# 更新版本号
sed -i "s/const APP_VERSION = '${CURRENT_VERSION}'/const APP_VERSION = '${NEW_VERSION}'/g" "$VERSION_FILE"

# 添加修改到暂存区
git add "$VERSION_FILE"

echo "✅ 版本号已自动更新: ${CURRENT_VERSION} → ${NEW_VERSION}"
exit 0