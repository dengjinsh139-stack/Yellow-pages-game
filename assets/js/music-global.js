/**
 * 全局音乐悬浮按钮组件 v2.9.6
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

    // 峰值保持数据
    let peakHoldLeft = 0;
    let peakHoldRight = 0;

    // 创建电平表（Wwise风格，高垂直电平表，与页面风格一致）
    function createLevelMeter() {
        if (document.getElementById('levelMeter')) return;

        const meter = document.createElement('div');
        meter.id = 'levelMeter';
        meter.className = 'level-meter';
        meter.innerHTML = `
            <div class="level-meter-title">MASTER</div>
            <div class="level-meter-scale">
                <span class="db-0">0</span>
                <span>-6</span>
                <span>-12</span>
                <span>-18</span>
                <span>-24</span>
                <span>-30</span>
                <span>-36</span>
                <span>-42</span>
                <span>-48</span>
                <span>-54</span>
                <span class="db-inf">-∞</span>
            </div>
            <div class="level-bars-container">
                <div class="level-bar-wrap">
                    <div class="level-bar-bg"></div>
                    <div class="level-grid"></div>
                    <div class="level-fill" id="levelLeft"></div>
                    <div class="level-peak" id="peakLeft"></div>
                </div>
                <div class="level-bar-wrap">
                    <div class="level-bar-bg"></div>
                    <div class="level-grid"></div>
                    <div class="level-fill" id="levelRight"></div>
                    <div class="level-peak" id="peakRight"></div>
                </div>
            </div>
            <div class="level-labels">
                <span class="channel-l">L</span>
                <span class="channel-r">R</span>
            </div>
        `;
        document.body.appendChild(meter);

        // 添加样式 - 与页面风格一致（Orbitron字体，青色主题）
        if (!document.getElementById('level-meter-styles')) {
            const style = document.createElement('style');
            style.id = 'level-meter-styles';
            style.textContent = `
                .level-meter {
                    position: fixed;
                    bottom: 85px;
                    right: 30px;
                    width: 100px;
                    height: calc(100vh - 120px);
                    max-height: 700px;
                    background: rgba(15, 15, 23, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 212, 170, 0.2);
                    border-radius: 12px;
                    padding: 16px 12px 12px 28px;
                    z-index: 9997;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    font-family: 'Orbitron', 'Noto Sans SC', sans-serif;
                    box-shadow: 0 0 40px rgba(0, 212, 170, 0.1);
                }
                .level-meter.active {
                    opacity: 1;
                }
                .level-meter-title {
                    font-size: 12px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 12px;
                    letter-spacing: 2px;
                    color: #00d4aa;
                    text-transform: uppercase;
                }
                .level-meter-scale {
                    position: absolute;
                    left: 8px;
                    top: 42px;
                    bottom: 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 9px;
                    color: rgba(255, 255, 255, 0.4);
                    text-align: right;
                    width: 18px;
                    line-height: 1;
                    font-family: 'Orbitron', monospace;
                }
                .level-meter-scale .db-0 {
                    color: #ef4444;
                    font-weight: 700;
                    font-size: 10px;
                }
                .level-meter-scale .db-inf {
                    color: rgba(255, 255, 255, 0.3);
                }
                .level-bars-container {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    height: calc(100% - 80px);
                    margin-left: 4px;
                }
                .level-bar-wrap {
                    width: 28px;
                    height: 100%;
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .level-bar-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 4px;
                }
                .level-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(
                        to top,
                        transparent,
                        transparent calc(10% - 1px),
                        rgba(255, 255, 255, 0.08) calc(10% - 1px),
                        rgba(255, 255, 255, 0.08) 10%
                    );
                    pointer-events: none;
                    border-radius: 4px;
                }
                .level-fill {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 0%;
                    background: linear-gradient(to top, 
                        #00d4aa 0%, 
                        #00d4aa 50%, 
                        #00a8e8 70%, 
                        #f59e0b 85%, 
                        #ef4444 95%, 
                        #ef4444 100%);
                    border-radius: 4px;
                    transition: height 0.04s ease-out;
                    box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
                }
                .level-fill.high {
                    box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
                }
                .level-peak {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #fff;
                    box-shadow: 0 0 10px #fff, 0 0 20px #fff;
                    opacity: 0;
                    transition: bottom 0.1s ease-out;
                    pointer-events: none;
                }
                .level-peak.active {
                    opacity: 1;
                }
                .level-labels {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-left: 4px;
                    margin-top: 12px;
                }
                .level-labels span {
                    width: 28px;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 700;
                    font-family: 'Orbitron', monospace;
                    color: rgba(255, 255, 255, 0.5);
                }
                .level-labels .channel-l {
                    color: #00d4aa;
                }
                .level-labels .channel-r {
                    color: #00a8e8;
                }
                @media (max-width: 768px) {
                    .level-meter {
                        bottom: 80px;
                        right: 15px;
                        transform: scale(0.75);
                        transform-origin: bottom right;
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

    // 更新电平表（Wwise风格）
    function updateLevelMeter() {
        if (!analyser || !dataArray) return;

        analyser.getByteFrequencyData(dataArray);

        // 分别计算左右声道
        const leftData = dataArray.slice(0, dataArray.length / 2);
        const rightData = dataArray.slice(dataArray.length / 2);
        
        const leftLevel = calculateLevel(leftData);
        const rightLevel = calculateLevel(rightData);
        
        // 更新显示
        updateBar('levelLeft', 'peakLeft', leftLevel, 'left');
        updateBar('levelRight', 'peakRight', rightLevel, 'right');
        
        // 显示/隐藏电平表
        const meter = document.getElementById('levelMeter');
        if (meter) {
            if (isMusicPlaying && !isMuted && (leftLevel > 1 || rightLevel > 1)) {
                meter.classList.add('active');
            } else if (!isMusicPlaying || isMuted) {
                meter.classList.remove('active');
            }
        }
        
        animationId = requestAnimationFrame(updateLevelMeter);
    }

    // 计算电平值（转换为0-100%）
    function calculateLevel(data) {
        const sum = data.reduce((acc, val) => acc + val, 0);
        const avg = sum / data.length;
        // 增强敏感度，让电平更明显
        return Math.min(100, (avg / 255) * 100 * 2.5);
    }

    // 更新单个电平条
    function updateBar(fillId, peakId, level, channel) {
        const fill = document.getElementById(fillId);
        const peak = document.getElementById(peakId);
        if (!fill) return;
        
        fill.style.height = level + '%';
        fill.classList.toggle('high', level > 85);
        
        // 峰值保持逻辑
        if (channel === 'left') {
            if (level > peakHoldLeft) {
                peakHoldLeft = level;
                if (peak) {
                    peak.style.bottom = peakHoldLeft + '%';
                    peak.classList.add('active');
                }
            } else {
                // 缓慢衰减
                peakHoldLeft = Math.max(0, peakHoldLeft - 0.5);
                if (peak) {
                    peak.style.bottom = peakHoldLeft + '%';
                    if (peakHoldLeft <= 0) peak.classList.remove('active');
                }
            }
        } else {
            if (level > peakHoldRight) {
                peakHoldRight = level;
                if (peak) {
                    peak.style.bottom = peakHoldRight + '%';
                    peak.classList.add('active');
                }
            } else {
                peakHoldRight = Math.max(0, peakHoldRight - 0.5);
                if (peak) {
                    peak.style.bottom = peakHoldRight + '%';
                    if (peakHoldRight <= 0) peak.classList.remove('active');
                }
            }
        }
    }

    // 停止电平表更新
    function stopLevelMeter() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        const meter = document.getElementById('levelMeter');
        if (meter) meter.classList.remove('active');
        peakHoldLeft = 0;
        peakHoldRight = 0;
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
