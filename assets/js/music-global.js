/**
 * 全局音乐悬浮按钮组件 v2.9.4
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
    let peakLeft = 0;
    let peakRight = 0;
    let peakDecayLeft = 0;
    let peakDecayRight = 0;

    // 创建电平表（夸张霓虹风格，频谱可视化）
    function createLevelMeter() {
        if (document.getElementById('levelMeter')) return;

        const meter = document.createElement('div');
        meter.id = 'levelMeter';
        meter.className = 'level-meter';
        meter.innerHTML = `
            <div class="level-meter-glow"></div>
            <div class="level-meter-header">⚡ AUDIO ⚡</div>
            <div class="spectrum-container" id="spectrumLeft"></div>
            <div class="spectrum-container" id="spectrumRight"></div>
            <div class="peak-bars">
                <div class="peak-bar-wrap">
                    <div class="peak-bar" id="peakBarLeft"></div>
                    <div class="peak-hold" id="peakHoldLeft"></div>
                </div>
                <div class="peak-bar-wrap">
                    <div class="peak-bar" id="peakBarRight"></div>
                    <div class="peak-hold" id="peakHoldRight"></div>
                </div>
            </div>
            <div class="level-meter-labels">
                <span class="channel-label neon-green">L</span>
                <span class="channel-label neon-pink">R</span>
            </div>
        `;
        document.body.appendChild(meter);

        // 创建频谱条
        createSpectrumBars('spectrumLeft', 24);
        createSpectrumBars('spectrumRight', 24);

        // 添加样式
        if (!document.getElementById('level-meter-styles')) {
            const style = document.createElement('style');
            style.id = 'level-meter-styles';
            style.textContent = `
                @keyframes neonPulse {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: 0.8; filter: brightness(1.3); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1); }
                    50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.5), inset 0 0 30px rgba(0, 255, 136, 0.2); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200px); }
                }
                .level-meter {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    background: linear-gradient(180deg, #0a0a0f 0%, #151520 50%, #0a0a0f 100%);
                    border: 3px solid #00ff88;
                    border-radius: 16px;
                    padding: 20px 16px 16px;
                    width: 140px;
                    z-index: 9997;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    font-family: 'Courier New', monospace;
                    animation: glowPulse 2s ease-in-out infinite;
                }
                .level-meter.active {
                    opacity: 1;
                }
                .level-meter-glow {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, #00ff88, #00d4ff, #ff00ff, #00ff88);
                    border-radius: 14px;
                    z-index: -1;
                    opacity: 0.3;
                    filter: blur(10px);
                    animation: neonPulse 1.5s ease-in-out infinite;
                }
                .level-meter-header {
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 16px;
                    letter-spacing: 3px;
                    color: #00ff88;
                    text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88;
                    animation: neonPulse 1s ease-in-out infinite;
                }
                .spectrum-container {
                    display: flex;
                    justify-content: space-between;
                    gap: 3px;
                    height: 120px;
                    margin-bottom: 12px;
                    align-items: flex-end;
                }
                .spectrum-bar {
                    flex: 1;
                    background: linear-gradient(to top, #00ff88, #ffff00, #ff0088);
                    border-radius: 2px;
                    min-height: 4px;
                    transition: height 0.08s ease-out;
                    box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
                }
                .spectrum-bar.high {
                    background: linear-gradient(to top, #ffff00, #ff0000, #ff00ff);
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                }
                .peak-bars {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    margin: 16px 0;
                }
                .peak-bar-wrap {
                    flex: 1;
                    height: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    border: 2px solid rgba(0, 255, 136, 0.3);
                }
                .peak-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #00ff88 0%, #00ff88 60%, #ffff00 80%, #ff0000 100%);
                    border-radius: 10px;
                    transition: width 0.05s ease-out;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                }
                }
                .peak-bar.high {
                    background: linear-gradient(90deg, #ffff00, #ff0000);
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
                    animation: neonPulse 0.1s ease-in-out infinite;
                }
                .peak-hold {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 4px;
                    height: 100%;
                    background: #fff;
                    opacity: 0;
                    box-shadow: 0 0 15px #fff, 0 0 30px #fff;
                    transition: right 0.1s ease-out, opacity 0.2s;
                }
                .peak-hold.active {
                    opacity: 1;
                }
                .level-meter-labels {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 8px;
                    margin-top: 12px;
                }
                .channel-label {
                    font-size: 20px;
                    font-weight: bold;
                    width: 48px;
                    text-align: center;
                    border-radius: 8px;
                    padding: 4px 0;
                }
                .neon-green {
                    color: #00ff88;
                    background: rgba(0, 255, 136, 0.15);
                    border: 1px solid #00ff88;
                    text-shadow: 0 0 10px #00ff88;
                    animation: neonPulse 2s ease-in-out infinite;
                }
                .neon-pink {
                    color: #ff00ff;
                    background: rgba(255, 0, 255, 0.15);
                    border: 1px solid #ff00ff;
                    text-shadow: 0 0 10px #ff00ff;
                    animation: neonPulse 2s ease-in-out infinite 0.5s;
                }
                .db-value {
                    position: absolute;
                    top: 38px;
                    right: 12px;
                    font-size: 9px;
                    color: #00ff88;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 5px #00ff88;
                }
                @media (max-width: 768px) {
                    .level-meter {
                        bottom: 90px;
                        right: 10px;
                        transform: scale(0.7);
                        transform-origin: bottom right;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 创建频谱条
    function createSpectrumBars(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const bar = document.createElement('div');
            bar.className = 'spectrum-bar';
            bar.style.height = '2px';
            container.appendChild(bar);
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

    // 更新电平表（夸张霓虹风格）
    function updateLevelMeter() {
        if (!analyser || !dataArray) return;

        analyser.getByteFrequencyData(dataArray);

        // 获取左右声道数据
        const leftData = dataArray.slice(0, dataArray.length / 2);
        const rightData = dataArray.slice(dataArray.length / 2);
        
        // 更新左声道频谱
        updateSpectrum('spectrumLeft', leftData);
        // 更新右声道频谱
        updateSpectrum('spectrumRight', rightData);
        
        // 计算RMS电平
        const leftRms = calculateRMS(leftData);
        const rightRms = calculateRMS(rightData);
        
        // 更新峰值条
        updatePeakBar('peakBarLeft', 'peakHoldLeft', leftRms);
        updatePeakBar('peakBarRight', 'peakHoldRight', rightRms);
        
        // 显示/隐藏电平表
        const meter = document.getElementById('levelMeter');
        if (meter) {
            const avgLevel = (leftRms + rightRms) / 2;
            if (isMusicPlaying && !isMuted && avgLevel > 1) {
                meter.classList.add('active');
            } else if (!isMusicPlaying || isMuted) {
                meter.classList.remove('active');
            }
        }
        
        animationId = requestAnimationFrame(updateLevelMeter);
    }

    // 计算RMS值
    function calculateRMS(data) {
        const sum = data.reduce((acc, val) => acc + val * val, 0);
        return Math.sqrt(sum / data.length);
    }

    // 更新频谱显示
    function updateSpectrum(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const bars = container.querySelectorAll('.spectrum-bar');
        const step = Math.floor(data.length / bars.length);
        
        bars.forEach((bar, i) => {
            const value = data[i * step] || 0;
            const height = Math.max(2, (value / 255) * 100);
            bar.style.height = height + '%';
            bar.classList.toggle('high', value > 200);
        });
    }

    // 更新峰值条
    function updatePeakBar(barId, holdId, rmsValue) {
        const bar = document.getElementById(barId);
        const hold = document.getElementById(holdId);
        if (!bar) return;
        
        // 转换为百分比
        const level = Math.min(100, (rmsValue / 128) * 100 * 1.5);
        bar.style.width = level + '%';
        bar.classList.toggle('high', level > 80);
        
        // 峰值保持
        if (hold) {
            const currentPeak = parseFloat(hold.style.right) || 0;
            const holdPos = 100 - level;
            
            if (level > (100 - currentPeak)) {
                hold.style.right = holdPos + '%';
                hold.classList.add('active');
                // 2秒后淡出峰值保持
                setTimeout(() => {
                    hold.classList.remove('active');
                }, 2000);
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
