/**
 * 全局音乐悬浮按钮组件 v2.8.6
 * 使用方法：在任意页面引入 <script src="assets/js/music-global.js"></script>
 * 会自动创建音乐按钮和音频元素
 * 特性：跨页面持续播放、自动同步状态
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'yellow_pages_music_state';
    const MUSIC_URL = 'assets/audio/bg-music.mp3';
    
    let bgMusic = null;
    let isMusicPlaying = false;
    let isMuted = true;
    let syncInterval = null;

    // 检查是否已有其他页面在播放
    function isAnotherPagePlaying() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        const savedTime = parseInt(localStorage.getItem(STORAGE_KEY + '_time') || '0');
        // 如果3秒内有状态更新，说明其他页面在控制
        return (savedState === 'playing' && Date.now() - savedTime < 3000);
    }

    // 创建音乐悬浮按钮（统一样式：圆角长条形）
    function createMusicButton() {
        // 如果已存在则不创建
        if (document.getElementById('musicFloatBtn')) return;

        const btn = document.createElement('div');
        btn.id = 'musicFloatBtn';
        btn.className = 'music-float-btn';
        btn.innerHTML = `
            <span id="musicFloatIcon">🔇</span>
            <span id="musicFloatText">开启音乐</span>
        `;
        btn.onclick = toggleGlobalMusic;
        document.body.appendChild(btn);

        // 添加统一样式（如果不存在）
        if (!document.getElementById('music-global-styles')) {
            const style = document.createElement('style');
            style.id = 'music-global-styles';
            style.textContent = `
                .music-float-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
                    color: #fff;
                    padding: 12px 20px;
                    border-radius: 50px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
                    border: none;
                    z-index: 9999;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .music-float-btn:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 30px rgba(0, 212, 170, 0.4);
                }
                .music-float-btn.playing {
                    animation: floatPulse 2s infinite;
                }
                @keyframes floatPulse {
                    0%, 100% { 
                        box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 4px 30px rgba(0, 212, 170, 0.5);
                        transform: scale(1.02);
                    }
                }
                #musicFloatIcon {
                    font-size: 1rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 创建或获取音频元素
    function initAudioElement() {
        // 检查是否已有音频元素
        const existingAudio = document.getElementById('bgMusic');
        if (existingAudio) {
            bgMusic = existingAudio;
            return;
        }

        // 检查是否其他页面正在播放（通过检查localStorage时间戳）
        if (isAnotherPagePlaying()) {
            console.log('[MusicGlobal] 其他页面正在播放，不创建新音频实例');
            // 只创建按钮，不创建音频（跟随其他页面的状态）
            bgMusic = null;
            return;
        }

        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.src = MUSIC_URL;
        bgMusic.loop = true;
        bgMusic.preload = 'auto';
        bgMusic.volume = 0.5;
        bgMusic.muted = true;
        document.body.appendChild(bgMusic);
    }

    // 初始化音乐系统
    function initMusicSystem() {
        createMusicButton();
        initAudioElement();

        // 如果有音频元素，尝试自动播放
        if (bgMusic) {
            bgMusic.muted = true;
            
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    updateMusicUI();
                    
                    // 检查是否之前已开启声音
                    const savedState = localStorage.getItem(STORAGE_KEY);
                    if (savedState === 'playing') {
                        unmuteMusic();
                    }
                }).catch(err => {
                    console.log('[MusicGlobal] 自动播放被阻止:', err);
                    isMusicPlaying = false;
                    updateMusicUI();
                });
            }

            // 监听其他页面的音乐状态变化
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    syncMusicState();
                }
            });

            // 定期同步状态
            syncInterval = setInterval(syncMusicState, 1000);
        } else {
            // 其他页面在播放，当前页面只同步UI
            syncMusicState();
            // 仍然需要监听状态变化
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    syncMusicState();
                }
            });
            syncInterval = setInterval(syncMusicState, 1000);
        }
    }

    // 取消静音
    function unmuteMusic() {
        isMuted = false;
        if (bgMusic) {
            bgMusic.muted = false;
            
            if (!isMusicPlaying) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicUI();
                    saveMusicState('playing');
                });
            } else {
                updateMusicUI();
                saveMusicState('playing');
            }
        } else {
            // 如果当前页面没有音频，创建一个新的
            initAudioElement();
            if (bgMusic) {
                bgMusic.muted = false;
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicUI();
                    saveMusicState('playing');
                });
            }
        }
    }

    // 静音
    function muteMusic() {
        isMuted = true;
        if (bgMusic) bgMusic.muted = true;
        updateMusicUI();
        saveMusicState('muted');
    }

    // 暂停音乐
    function pauseMusic() {
        if (bgMusic) bgMusic.pause();
        isMusicPlaying = false;
        updateMusicUI();
        saveMusicState('paused');
    }

    // 恢复播放
    function resumeMusic() {
        if (!bgMusic) initAudioElement();
        if (bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicUI();
                saveMusicState(isMuted ? 'muted' : 'playing');
            });
        }
    }

    // 切换全局音乐
    function toggleGlobalMusic() {
        if (!isMusicPlaying) {
            unmuteMusic();
        } else if (isMuted) {
            unmuteMusic();
        } else {
            pauseMusic();
        }
    }

    // 更新UI
    function updateMusicUI() {
        const floatBtn = document.getElementById('musicFloatBtn');
        const floatIcon = document.getElementById('musicFloatIcon');
        const floatText = document.getElementById('musicFloatText');

        const savedState = localStorage.getItem(STORAGE_KEY);
        const isActuallyPlaying = savedState === 'playing' || (isMusicPlaying && !isMuted);

        if (!isMusicPlaying && savedState !== 'playing') {
            // 暂停状态
            if (floatIcon) floatIcon.textContent = '▶️';
            if (floatText) floatText.textContent = '播放音乐';
            if (floatBtn) floatBtn.classList.remove('playing');
        } else if ((isMuted && !isMusicPlaying) || savedState === 'muted') {
            // 静音状态
            if (floatIcon) floatIcon.textContent = '🔇';
            if (floatText) floatText.textContent = '开启音乐';
            if (floatBtn) floatBtn.classList.remove('playing');
        } else if (isActuallyPlaying) {
            // 正常播放
            if (floatIcon) floatIcon.textContent = '🔊';
            if (floatText) floatText.textContent = '音乐播放中';
            if (floatBtn) floatBtn.classList.add('playing');
        }
    }

    // 保存状态
    function saveMusicState(state) {
        localStorage.setItem(STORAGE_KEY, state);
        localStorage.setItem(STORAGE_KEY + '_time', Date.now());
    }

    // 同步音乐状态
    function syncMusicState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        const savedTime = parseInt(localStorage.getItem(STORAGE_KEY + '_time') || '0');
        
        // 只处理最近5秒内的状态变化
        if (Date.now() - savedTime > 5000) return;

        if (savedState === 'playing') {
            // 其他页面开始播放
            if (!isMusicPlaying) {
                isMusicPlaying = true;
                isMuted = false;
                // 如果当前页面有音频，跟随播放
                if (bgMusic) {
                    bgMusic.muted = false;
                    bgMusic.play().catch(() => {});
                }
            } else if (isMuted && bgMusic) {
                isMuted = false;
                bgMusic.muted = false;
            }
            updateMusicUI();
        } else if (savedState === 'paused') {
            if (bgMusic) bgMusic.pause();
            isMusicPlaying = false;
            updateMusicUI();
        } else if (savedState === 'muted') {
            isMuted = true;
            if (bgMusic) bgMusic.muted = true;
            updateMusicUI();
        }
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (syncInterval) {
            clearInterval(syncInterval);
        }
    });

    // 暴露全局函数供其他脚本调用
    window.toggleGlobalMusic = toggleGlobalMusic;

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicSystem);
    } else {
        initMusicSystem();
    }
})();
