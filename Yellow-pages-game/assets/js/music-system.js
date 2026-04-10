// ==================== 全局音乐控制系统 ====================
const bgMusic = document.getElementById('bgMusic');
const STORAGE_KEY = 'yellow_pages_music_state';
let isMusicPlaying = false;
let isMuted = true;

// 初始化音乐系统
function initMusicSystem() {
    if (!bgMusic) return;
    
    // 尝试自动播放（静音）
    bgMusic.muted = true;
    bgMusic.volume = 0.5;
    
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

// 取消静音
function unmuteMusic() {
    isMuted = false;
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
}

// 静音
function muteMusic() {
    isMuted = true;
    bgMusic.muted = true;
    updateMusicUI();
    saveMusicState('muted');
}

// 暂停音乐
function pauseMusic() {
    bgMusic.pause();
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

    if (!floatBtn || !floatIcon || !floatText) return;

    if (!isMusicPlaying) {
        floatIcon.textContent = '▶️';
        floatText.textContent = '播放音乐';
        floatBtn.classList.remove('playing');
    } else if (isMuted) {
        floatIcon.textContent = '🔇';
        floatText.textContent = '开启音乐';
        floatBtn.classList.remove('playing');
    } else {
        floatIcon.textContent = '🔊';
        floatText.textContent = '音乐播放中';
        floatBtn.classList.add('playing');
    }
}

// 保存状态到 localStorage
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
        bgMusic.muted = false;
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicUI();
            });
        } else {
            updateMusicUI();
        }
    } else if (savedState === 'paused' && isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicUI();
    } else if (savedState === 'muted' && !isMuted) {
        isMuted = true;
        bgMusic.muted = true;
        updateMusicUI();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initMusicSystem);
