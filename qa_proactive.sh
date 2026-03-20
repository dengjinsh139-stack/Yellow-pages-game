#!/bin/bash
# 主动QA检查脚本 - 检查所有页面导航一致性

echo "=========================================="
echo "  主动QA检查 - 全站导航一致性检查"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

ERRORS=0

# 定义标准页签列表
STANDARD_TABS=("首页" "游戏中心" "音效相关" "音乐百科" "项目" "Wwise" "任务管理器" "项目能力" "理财相关")

echo "【标准页签配置】(9个)"
echo "------------------------------------------"
for tab in "${STANDARD_TABS[@]}"; do
    echo "  - $tab"
done
echo ""

# 检查每个HTML文件的页签
check_page_tabs() {
    local file=$1
    local name=$2
    
    echo "检查: $name"
    echo "文件: $file"
    
    # 提取页签名称
    local tabs=$(grep -o 'nav-link[^>]*>[^<]*</a>' "$file" 2>/dev/null | grep -o '>[^<]*<' | tr -d '><' | grep -E '[🏠🎮🔊🎵📁📈📊💰⚡]' || echo "")
    
    if [ -z "$tabs" ]; then
        echo "  ⚠️  未找到导航栏或页面无导航"
        return 0
    fi
    
    local count=$(echo "$tabs" | wc -l)
    echo "  发现 $count 个页签:"
    
    local has_project=false
    while IFS= read -r tab; do
        echo "    - $tab"
        if [[ "$tab" == *"项目"* ]] && [[ "$tab" != *"项目能力"* ]]; then
            has_project=true
        fi
    done <<< "$tabs"
    
    if [ "$has_project" = false ] && [ "$count" -gt 0 ]; then
        echo "  ❌ 错误: 缺少'📁 项目'页签!"
        ((ERRORS++))
    fi
    
    if [ "$count" -ne 9 ] && [ "$count" -gt 0 ]; then
        echo "  ⚠️  警告: 页签数量不是9个(实际$count个)"
    fi
    
    echo ""
}

cd /root/.openclaw/workspace/Yellow-pages-game

echo "【全站页面导航检查】"
echo "=========================================="
echo ""

# 检查根目录HTML文件
for file in *.html; do
    if [ -f "$file" ]; then
        check_page_tabs "$file" "根目录/$file"
    fi
done

# 检查子目录HTML文件
for dir in music sound-effects wwise; do
    if [ -d "$dir" ]; then
        for file in "$dir"/*.html; do
            if [ -f "$file" ]; then
                check_page_tabs "$file" "$file"
            fi
        done
    fi
done

echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "  ✅ QA检查通过 - 所有页面导航正常"
else
    echo "  ❌ QA检查失败 - 发现 $ERRORS 个问题"
fi
echo "=========================================="

exit $ERRORS