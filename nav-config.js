/**
 * 统一导航栏组件 v2.4.9
 * 使用方式：在需要导航栏的页面引入此文件
 * <script src="nav-config.js"></script>
 */

// 全局版本号 - 修改这里即可同步全站
const APP_VERSION = 'v2.5.6';

// 导航配置 - 修改这里即可同步全站
const NAV_CONFIG = {
    version: APP_VERSION,
    items: [
        { id: 'home', label: '🏠 首页', href: 'index.html', active: false },
        { id: 'games', label: '🎮 游戏中心', href: 'index.html#games', active: false },
        { id: 'sound', label: '🔊 音效相关', href: 'sound-effects-login.html', active: false },
        { id: 'music', label: '🎵 音乐百科', href: 'music/music-genres.html', active: false },
        { id: 'projects', label: '📁 项目', href: 'projects.html', active: false },
        { id: 'wwise', label: '🔊 Wwise', href: 'wwise/wwise.html', active: false },
        { id: 'task', label: '📈 任务管理器', href: 'task-manager.html', active: false },
        { id: 'caps', label: '📊 项目能力', href: 'capabilities.html', active: false },
        { id: 'finance', label: '💰 理财相关', href: 'finance-login.html', active: false }
    ]
};

// 初始化版本号显示
function initVersion() {
    // 处理纯版本号元素
    const versionElements = document.querySelectorAll('.nav-version, [data-version]');
    versionElements.forEach(el => {
        const text = el.textContent;
        // 如果文本只包含版本号，直接替换
        if (text.match(/^v?\d+\.\d+\.\d+$/)) {
            el.textContent = APP_VERSION;
        } else {
            // 否则只替换版本号部分（如 "v2.4.9 | 2026-03-19" 或 "⚡ 我的工作站 v2.4.9 | ..."）
            el.textContent = text.replace(/v?\d+\.\d+\.\d+/g, APP_VERSION);
        }
    });
}

// 根据当前页面自动设置 active 状态
function initNav() {
    const currentPath = window.location.pathname;
    const navContainer = document.getElementById('nav-links');
    
    if (!navContainer) return;
    
    let html = '';
    NAV_CONFIG.items.forEach(item => {
        // 判断是否为当前页面
        const isActive = currentPath.includes(item.href.replace('.html', '')) || 
                        (item.id === 'home' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')));
        
        const activeClass = isActive ? 'active' : '';
        
        // 处理相对路径
        let href = item.href;
        if (currentPath.includes('/music/') || currentPath.includes('/wwise/') || currentPath.includes('/sound-effects/')) {
            href = '..' + item.href;
        }
        
        html += `<a href="${href}" class="nav-link ${activeClass}">${item.label}</a>`;
    });
    
    navContainer.innerHTML = html;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initVersion();
    initNav();
});
