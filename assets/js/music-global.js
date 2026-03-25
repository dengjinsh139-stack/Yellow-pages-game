/**
 * 全局音乐悬浮按钮组件 v2.9.0
 * 使用方法：在任意页面引入 <script src="assets/js/music-global.js"></script>
 * 会自动创建音乐按钮、音频元素和电平表
 * 特性：跨页面持续播放、自动同步状态、保持播放进度、音频可视化
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'yellow_pages_music_state';
    const PROGRESS_KEY = 'yellow_pages_music_progress';
    const MUSIC_URL = 'assets/audio/bg-music.mp3';
    const CHANNEL_NAME = 'yellow_pages_music_channel';
    
    let bgMusic = null;
    let isMusicPlaying = false;
    let isMuted = true;
    let syncInterval = null;
    let broadcastChannel = null;
    let isActiveController = false;
    
    // 音频分析相关
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let animationId = null;

    // 创建电平表
    function createLevelMeter() {
        if (document.getElementById('levelMeter')) return;

        const meter = document.createElement('div');
        meter.id = 'levelMeter';
        meter.className = 'level-meter';
        meter.innerHTML = `
            <div class="level-meter-title">🎵 音频电平</div>
            <div class="level-meter-channels">
                <div class="level-channel">
                    <span class="channel-label">L</span>
                    <div class="level-bar">
                        <div class="level-fill" id="levelLeft"></div>
                    </div>
                </div>
                <div class="level-channel">
                    <span class="channel-label">R</span>
                    <div class="level-bar">
                        <div class="level-fill" id="levelRight"></div>
                    </div>
                </div>
            </div>
            <div class="level-peaks">
                <div class="peak-indicator" id="peakLeft">-∞ dB</div>
                <div class="peak-indicator" id="peakRight">-∞ dB</div>
            </div>
        `;
        document.body.appendChild(meter);

        // 添加样式
        if (!document.getElementById('level-meter-styles')) {
            const style = document.createElement('style');
            style.id = 'level-meter-styles';
            style.textContent = `
                .level-meter {
                    position: fixed;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                    background: rgba(15, 15, 23, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 212, 170, 0.3);
                    border-radius: 12px;
                    padding: 15px;
                    width: 60px;
                    z-index: 9998;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }
                .level-meter.active {
                    opacity: 1;
                }
                .level-meter-title {
                    font-size: 10px;
                    color: #00d4aa;
                    text-align: center;
                    margin-bottom: 10px;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .level-meter-channels {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .level-channel {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .channel-label {
                    font-size: 9px;
                    color: #a1a1aa;
                    width: 12px;
                    text-align: center;
                }
                .level-bar {
                    flex: 1;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }
                .level-fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #00d4aa 0%, #00d4aa 60%, #f59e0b 80%, #ef4444 100%);
                    border-radius: 4px;
                    transition: width 0.05s ease-out;
                }
                .level-peaks {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    font-size: 8px;
                    color: #71717a;
                }
                @media (max-width: 1200px) {
                    .level-meter {
                        right: 10px;
                        padding: 10px;
                        width: 50px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 初始化音频分析
    function initAudioAnalyser() {
        if (!bgMusic || audioContext) return;

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            source = audioContext.createMediaElementSource(bgMusic);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            createLevelMeter();
            updateLevelMeter();
        } catch (e) {
            console.log('[MusicGlobal] 音频分析初始化失败:', e);
        }
    }

    // 更新电平表
    function updateLevelMeter() {
        if (!analyser || !dataArray) return;

        analyser.getByteFrequencyData(dataArray);

        // 计算左右声道平均值
        const leftSum = dataArray.slice(0, dataArray.length / 2).reduce((a, b) => a + b, 0);
        const rightSum = dataArray.slice(dataArray.length / 2).reduce((a, b) => a + b, 0);
        
        const leftAvg = leftSum / (dataArray.length / 2);
        const rightAvg = rightSum / (dataArray.length / 2);
        
        // 转换为百分比
        const leftLevel = Math.min((leftAvg / 255) * 100 * 1.5, 100);
        const rightLevel = Math.min((rightAvg / 255) * 100 * 1.5, 100);
        
        // 更新显示
        const leftFill = document.getElementById('levelLeft');
        const rightFill = document.getElementById('levelRight');
        const peakLeft = document.getElementById('peakLeft');
        const peakRight = document.getElementById('peakRight');
        const meter = document.getElementById('levelMeter');
        
        if (leftFill) leftFill.style.width = leftLevel + '%';
        if (rightFill) rightFill.style.width = rightLevel + '%';
        
        // 计算 dB 值
        const leftDb = leftAvg > 0 ? Math.round(20 * Math.log10(leftAvg / 255)) : -Infinity;
        const rightDb = rightAvg > 0 ? Math.round(20 * Math.log10(rightAvg / 255)) : -Infinity;
        
        if (peakLeft) peakLeft.textContent = leftDb > -60 ? leftDb + ' dB' : '-∞ dB';
        if (peakRight) peakRight.textContent = rightDb > -60 ? rightDb + ' dB' : '-∞ dB';
        
        // 显示/隐藏电平表
        if (meter) {
            if (isMusicPlaying && !isMuted && (leftLevel > 1 || rightLevel > 1)) {
                meter.classList.add('active');
            } else if (!isMusicPlaying || isMuted) {
                meter.classList.remove('active');
            }
        }
        
        animationId = requestAnimationFrame(updateLevelMeter);
    }

    // 停止电平表更新
    function stopLevelMeter() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        const meter = document.getElementById('levelMeter');
        if (meter) meter.classList.remove('active');
    }

    // 初始化广播通道
    function initBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
            broadcastChannel.onmessage = (event) => {
                const data = event.data;
                if (data.type === 'ping') {
                    if (isActiveController && isMusicPlaying) {
                        broadcastChannel.postMessage({
                            type: 'pong',
                            currentTime: bgMusic ? bgMusic.currentTime : 0,
                            timestamp: Date.now()
                        });
                    }
                } else if (data.type === 'pong') {
                    if (!isActiveController && data.currentTime > 0) {
                        const savedProgress = parseFloat(localStorage.getItem(PROGRESS_KEY) || '0');
                        if (bgMusic && Math.abs(bgMusic.currentTime - savedProgress) > 1) {
                            bgMusic.currentTime = savedProgress;
                        }
                    }
                } else if (data.type === 'state_change') {
                    handleStateChange(data.state, data.currentTime);
                } else if (data.type === 'progress_update') {
                    localStorage.setItem(PROGRESS_KEY, data.currentTime);
                }
            };
        }
    }

    // 处理状态变化
    function handleStateChange(state, currentTime) {
        if (state === 'playing') {
            if (!isMusicPlaying) {
                isMusicPlaying = true;
                isMuted = false;
                if (bgMusic) {
                    bgMusic.muted = false;
                    if (currentTime > 0) {
                        bgMusic.currentTime = currentTime;
                    }
                    bgMusic.play().catch(() => {});
                }
            }
            updateMusicUI();
        } else if (state === 'paused') {
            if (bgMusic) bgMusic.pause();
            isMusicPlaying = false;
            updateMusicUI();
        } else if (state === 'muted') {
            isMuted = true;
            if (bgMusic) bgMusic.muted = true;
            updateMusicUI();
        }
    }

    // 广播状态变化
    function broadcastState(state) {
        if (broadcastChannel) {
            broadcastChannel.postMessage({
                type: 'state_change',
                state: state,
                currentTime: bgMusic ? bgMusic.currentTime : 0,
                timestamp: Date.now()
            });
        }
        localStorage.setItem(STORAGE_KEY, state);
        localStorage.setItem(STORAGE_KEY + '_time', Date.now());
        if (bgMusic) {
            localStorage.setItem(PROGRESS_KEY, bgMusic.currentTime);
        }
    }

    // 创建音乐悬浮按钮
    function createMusicButton() {
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
                    0%, 100% { box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3); transform: scale(1); }
                    50% { box-shadow: 0 4px 30px rgba(0, 212, 170, 0.5); transform: scale(1.02); }
                }
                #musicFloatIcon { font-size: 1rem; }
            `;
            document.head.appendChild(style);
        }
    }

    // 创建音频元素
    function initAudioElement() {
        const existingAudio = document.getElementById('bgMusic');
        if (existingAudio) {
            bgMusic = existingAudio;
            return;
        }

        bgMusic = document.createElement('audio');
        bgMusic.id = 'bgMusic';
        bgMusic.src = MUSIC_URL;
        bgMusic.loop = true;
        bgMusic.preload = 'auto';
        bgMusic.volume = 0.5;
        bgMusic.muted = true;
        
        const savedProgress = parseFloat(localStorage.getItem(PROGRESS_KEY) || '0');
        if (savedProgress > 0) {
            bgMusic.currentTime = savedProgress;
        }
        
        document.body.appendChild(bgMusic);

        setInterval(() => {
            if (bgMusic && isMusicPlaying && !bgMusic.paused) {
                localStorage.setItem(PROGRESS_KEY, bgMusic.currentTime);
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'progress_update',
                        currentTime: bgMusic.currentTime
                    });
                }
            }
        }, 1000);
    }

    // 询问其他页面
    function queryOtherPages() {
        return new Promise((resolve) => {
            if (!broadcastChannel) {
                resolve(false);
                return;
            }
            let responded = false;
            const timeout = setTimeout(() => {
                if (!responded) resolve(false);
            }, 500);

            const handler = (event) => {
                if (event.data.type === 'pong') {
                    responded = true;
                    clearTimeout(timeout);
                    broadcastChannel.removeEventListener('message', handler);
                    resolve(true);
                }
            };
            broadcastChannel.addEventListener('message', handler);
            broadcastChannel.postMessage({ type: 'ping', timestamp: Date.now() });
        });
    }

    // 初始化音乐系统
    async function initMusicSystem() {
        initBroadcastChannel();
        createMusicButton();
        
        const hasOtherPage = await queryOtherPages();
        
        if (hasOtherPage) {
            initAudioElement();
            syncMusicState();
        } else {
            isActiveController = true;
            initAudioElement();
            
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState === 'playing') {
                bgMusic.muted = false;
                isMuted = false;
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isMusicPlaying = true;
                        updateMusicUI();
                        // 初始化音频分析器
                        initAudioAnalyser();
                    }).catch(err => {
                        console.log('[MusicGlobal] 自动播放被阻止:', err);
                        isMusicPlaying = false;
                        updateMusicUI();
                    });
                }
            }
        }

        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                syncMusicState();
            }
        });

        syncInterval = setInterval(syncMusicState, 1000);

        window.addEventListener('beforeunload', () => {
            if (bgMusic) {
                localStorage.setItem(PROGRESS_KEY, bgMusic.currentTime);
            }
            if (isActiveController && broadcastChannel) {
                broadcastChannel.postMessage({
                    type: 'controller_leaving',
                    currentTime: bgMusic ? bgMusic.currentTime : 0
                });
            }
        });
    }

    // 取消静音
    function unmuteMusic() {
        isMuted = false;
        if (bgMusic) {
            bgMusic.muted = false;
            
            if (!isMusicPlaying || bgMusic.paused) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    isActiveController = true;
                    updateMusicUI();
                    broadcastState('playing');
                    // 初始化音频分析
                    initAudioAnalyser();
                });
            } else {
                isMusicPlaying = true;
                isActiveController = true;
                updateMusicUI();
                broadcastState('playing');
                initAudioAnalyser();
            }
        }
    }

    // 静音
    function muteMusic() {
        isMuted = true;
        if (bgMusic) bgMusic.muted = true;
        updateMusicUI();
        broadcastState('muted');
        stopLevelMeter();
    }

    // 暂停音乐
    function pauseMusic() {
        if (bgMusic) bgMusic.pause();
        isMusicPlaying = false;
        updateMusicUI();
        broadcastState('paused');
        stopLevelMeter();
    }

    // 切换全局音乐
    function toggleGlobalMusic() {
        if (!isMusicPlaying || bgMusic.paused) {
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

        if (!isMusicPlaying || bgMusic.paused) {
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

    // 同步音乐状态
    function syncMusicState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        const savedTime = parseInt(localStorage.getItem(STORAGE_KEY + '_time') || '0');
        const savedProgress = parseFloat(localStorage.getItem(PROGRESS_KEY) || '0');
        
        if (Date.now() - savedTime > 5000) return;

        if (savedState === 'playing') {
            if (!isMusicPlaying || bgMusic.paused) {
                isMusicPlaying = true;
                isMuted = false;
                if (bgMusic) {
                    bgMusic.muted = false;
                    if (savedProgress > 0 && Math.abs(bgMusic.currentTime - savedProgress) > 2) {
                        bgMusic.currentTime = savedProgress;
                    }
                    bgMusic.play().catch(() => {});
                }
            }
            updateMusicUI();
        } else if (savedState === 'paused') {
            if (bgMusic && !bgMusic.paused) {
                bgMusic.pause();
            }
            isMusicPlaying = false;
            updateMusicUI();
        } else if (savedState === 'muted') {
            isMuted = true;
            if (bgMusic) bgMusic.muted = true;
            updateMusicUI();
        }
    }

    // 暴露全局函数
    window.toggleGlobalMusic = toggleGlobalMusic;

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicSystem);
    } else {
        initMusicSystem();
    }
})();
