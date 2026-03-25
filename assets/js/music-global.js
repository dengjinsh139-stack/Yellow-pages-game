/**
 * 全局音乐悬浮按钮组件 v3.1.4
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
    let analyserLeft = null;
    let analyserRight = null;
    let dataArrayLeft = null;
    let dataArrayRight = null;
    let source = null;
    let animationId = null;
    let splitter = null;

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
                    top: 100px;
                    bottom: 85px;
                    right: 30px;
                    width: 140px;
                    background: linear-gradient(180deg, rgba(20, 20, 30, 0.98) 0%, rgba(15, 15, 23, 0.98) 100%);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 212, 170, 0.25);
                    border-radius: 16px;
                    padding: 20px 14px 14px 34px;
                    z-index: 9997;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    font-family: 'Orbitron', 'Noto Sans SC', sans-serif;
                    box-shadow: 
                        0 0 60px rgba(0, 212, 170, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                .level-meter.active {
                    opacity: 1;
                }
                .level-meter-title {
                    font-size: 13px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 16px;
                    letter-spacing: 3px;
                    color: #00d4aa;
                    text-transform: uppercase;
                    text-shadow: 0 0 20px rgba(0, 212, 170, 0.5);
                }
                .level-meter-scale {
                    position: absolute;
                    left: 10px;
                    top: 50px;
                    bottom: 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 9px;
                    color: rgba(255, 255, 255, 0.5);
                    text-align: right;
                    width: 20px;
                    line-height: 1;
                    font-family: 'Orbitron', monospace;
                    font-weight: 500;
                }
                .level-meter-scale .db-0 {
                    color: #ff6b6b;
                    font-weight: 700;
                    font-size: 10px;
                }
                .level-meter-scale .db-inf {
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 8px;
                }
                .level-bars-container {
                    display: flex;
                    justify-content: center;
                    gap: 14px;
                    height: calc(100% - 90px);
                    margin-left: 6px;
                }
                .level-bar-wrap {
                    width: 38px;
                    height: 100%;
                    position: relative;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
                }
                .level-bar-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 6px;
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
                        rgba(255, 255, 255, 0.06) calc(10% - 1px),
                        rgba(255, 255, 255, 0.06) 10%
                    );
                    pointer-events: none;
                    border-radius: 6px;
                }
                .level-fill {
                    position: absolute;
                    bottom: 0;
                    left: 2px;
                    right: 2px;
                    height: 0%;
                    background: linear-gradient(to top, 
                        #00d4aa 0%, 
                        #00d4aa 30%, 
                        #00e5c0 50%, 
                        #00a8e8 70%, 
                        #f59e0b 88%, 
                        #ff6b6b 95%, 
                        #ff4757 100%);
                    border-radius: 4px;
                    transition: height 0.04s ease-out;
                    box-shadow: 0 0 25px rgba(0, 212, 170, 0.4);
                }
                .level-fill.high {
                    box-shadow: 0 0 35px rgba(255, 107, 107, 0.6);
                }
                .level-peak {
                    position: absolute;
                    left: 2px;
                    right: 2px;
                    height: 3px;
                    background: linear-gradient(90deg, #fff 0%, #00d4aa 50%, #fff 100%);
                    box-shadow: 0 0 15px #fff, 0 0 30px rgba(0, 212, 170, 0.8);
                    opacity: 0;
                    transition: bottom 0.1s ease-out;
                    pointer-events: none;
                    border-radius: 2px;
                }
                .level-peak.active {
                    opacity: 1;
                }
                .level-labels {
                    display: flex;
                    justify-content: center;
                    gap: 14px;
                    margin-left: 6px;
                    margin-top: 14px;
                }
                .level-labels span {
                    width: 38px;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 700;
                    font-family: 'Orbitron', monospace;
                    color: rgba(255, 255, 255, 0.6);
                    letter-spacing: 1px;
                }
                .level-labels .channel-l {
                    color: #00d4aa;
                    text-shadow: 0 0 15px rgba(0, 212, 170, 0.5);
                }
                .level-labels .channel-r {
                    color: #00a8e8;
                    text-shadow: 0 0 15px rgba(0, 168, 232, 0.5);
                }
                @media (max-width: 768px) {
                    .level-meter {
                        top: 80px;
                        bottom: 80px;
                        right: 15px;
                        width: 120px;
                        padding: 12px 10px 10px 26px;
                    }
                    .level-bar-wrap {
                        width: 30px;
                    }
                    .level-bars-container {
                        gap: 8px;
                    }
                    .level-labels span {
                        width: 30px;
                        font-size: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 初始化音频分析
    function initAudioAnalyser() {
        if (!bgMusic) return;
        
        // 如果动画已经在运行，不需要重新初始化
        if (animationId) return;

        try {
            // 如果 audioContext 不存在，创建新的
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // 创建声道分离器
                splitter = audioContext.createChannelSplitter(2);
                
                // 为左右声道分别创建分析器
                analyserLeft = audioContext.createAnalyser();
                analyserRight = audioContext.createAnalyser();
                analyserLeft.fftSize = 256;
                analyserRight.fftSize = 256;
                
                // 连接音频源
                source = audioContext.createMediaElementSource(bgMusic);
                source.connect(splitter);
                
                // 左声道 -> 左分析器
                splitter.connect(analyserLeft, 0);
                // 右声道 -> 右分析器
                splitter.connect(analyserRight, 1);
                
                // 连接到输出
                source.connect(audioContext.destination);
                
                const bufferLengthLeft = analyserLeft.frequencyBinCount;
                const bufferLengthRight = analyserRight.frequencyBinCount;
                dataArrayLeft = new Uint8Array(bufferLengthLeft);
                dataArrayRight = new Uint8Array(bufferLengthRight);
                
                createLevelMeter();
            }
            
            // 启动动画循环
            updateLevelMeter();
        } catch (e) {
            console.log('[MusicGlobal] 音频分析初始化失败:', e);
        }
    }

    // 更新电平表（Wwise风格）
    function updateLevelMeter() {
        if (!analyserLeft || !analyserRight || !dataArrayLeft || !dataArrayRight) return;

        // 分别获取左右声道的频域数据
        analyserLeft.getByteFrequencyData(dataArrayLeft);
        analyserRight.getByteFrequencyData(dataArrayRight);

        // 计算左右声道电平
        const leftLevel = calculateLevel(dataArrayLeft);
        const rightLevel = calculateLevel(dataArrayRight);

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

    // 计算电平值（转换为0-100%），带压缩和限制，避免顶满
    function calculateLevel(data) {
        const sum = data.reduce((acc, val) => acc + val * val, 0);
        const rms = Math.sqrt(sum / data.length);
        
        // 使用对数压缩，让高音量区域有更多动态
        // 255 是最大值，但我们希望 200 左右就达到 100%
        const normalized = rms / 200;
        
        // 对数压缩：高音量时增长变慢，避免顶满
        const compressed = Math.log10(1 + normalized * 9) / Math.log10(10);
        
        // 限制最大 90%，永远留一点空间，保持律动感
        return Math.min(90, compressed * 100);
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
                    // 确保电平表动画重新启动
                    if (!animationId) {
                        updateLevelMeter();
                    }
                });
            } else {
                isMusicPlaying = true;
                isActiveController = true;
                updateMusicUI();
                broadcastState('playing');
                initAudioAnalyser();
                // 确保电平表动画重新启动
                if (!animationId) {
                    updateLevelMeter();
                }
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
