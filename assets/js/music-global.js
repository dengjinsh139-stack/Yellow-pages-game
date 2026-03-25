/**
 * 全局音乐悬浮按钮组件
 * 使用方法：在任意页面引入 <script src="assets/js/music-global.js"></script>
 * 会自动创建音乐按钮和音频元素
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'yellow_pages_music_state';
    const MUSIC_URL = 'assets/audio/bg-music.mp3';
    
    let bgMusic = null;
    let isMusicPlaying = false;
    let isMuted = true;

    // 创建音乐悬浮按钮
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

        // 添加样式（如果不存在）
        if (!document.getElementById('music-global-styles')) {
            const style = document.createElement('style');
            style.id = 'music-global-styles';
            style.textContent = `
                .music-float-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0, 212, 170, 0.4);
                    transition: all 0.3s ease;
                    z-index: 9999;
                    font-size: 11px;
                    color: white;
                    font-weight: 600;
                }
                .music-float-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0, 212, 170, 0.5);
                }
                .music-float-btn.playing {
                    animation: musicPulse 2s ease-in-out infinite;
                }
                @keyframes musicPulse {
                    0%, 100% { box-shadow: 0 4px 15px rgba(0, 212, 170, 0.4); }
                    50% { box-shadow: 0 4px 25px rgba(0, 212, 170, 0.7); }
                }
                .music-float-btn span {
                    display: block;
                    text-align: center;
                }
                #musicFloatIcon {
                    font-size: 18px;
                    margin-bottom: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 创建音频元素
    function createAudioElement() {
        if (document.getElementById('bgMusic')) {
            bgMusic = document.getElementById('bgMusic');
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
        createAudioElement();
        createMusicButton();

        // 尝试自动播放（静音）
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
                    console.log('自动播放被阻止:', err);
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

            // 定期同步
            setInterval(syncMusicState, 1000);
        }
    }

    // 取消静音
    function unmuteMusic() {
        isMuted = false;
        if (bgMusic) bgMusic.muted = false;
        
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
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicUI();
            saveMusicState(isMuted ? 'muted' : 'playing');
        });
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

        if (!isMusicPlaying) {
            if (floatIcon) floatIcon.textContent = '▶️';
            if (floatText) floatText.textContent = '播放音乐';
            if (floatBtn) floatBtn.classList.remove('playing');
        } else if (isMuted) {
            if (floatIcon) floatIcon.textContent = '🔇';
            if (floatText) floatText.textContent = '开启音乐';
            if (floatBtn) floatBtn.classList.remove('playing');
        } else {
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
        
        if (Date.now() - savedTime > 3000) return;

        if (savedState === 'playing' && (!isMusicPlaying || isMuted)) {
            isMuted = false;
            if (bgMusic) bgMusic.muted = false;
            if (!isMusicPlaying) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicUI();
                });
            } else {
                updateMusicUI();
            }
        } else if (savedState === 'paused' && isMusicPlaying) {
            if (bgMusic) bgMusic.pause();
            isMusicPlaying = false;
            updateMusicUI();
        } else if (savedState === 'muted' && !isMuted) {
            isMuted = true;
            if (bgMusic) bgMusic.muted = true;
            updateMusicUI();
        }
    }

    // 暴露全局函数供其他脚本调用
    window.toggleGlobalMusic = toggleGlobalMusic;

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicSystem);
    } else {
        initMusicSystem();
    }
})();
