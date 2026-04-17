import { ref, onUnmounted } from 'vue'

/**
 * 音频管理 composable
 * 提供绘画沙沙声、成功欢呼声和背景音乐功能
 */
export function useAudio() {
  // 从 localStorage 加载状态
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  // 保存状态到 localStorage
  const saveState = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save state:', e)
    }
  }

  // 音效开关状态
  const soundEnabled = ref(loadState('aiDrawSoundEnabled', true))
  const musicEnabled = ref(loadState('aiDrawMusicEnabled', true))
  const musicVolume = ref(loadState('aiDrawMusicVolume', 0.3)) // 背景音乐音量 0-1
  const soundVolume = ref(loadState('aiDrawSoundVolume', 0.5)) // 音效音量 0-1

  // AudioContext 实例
  let audioContext = null
  let bgmOscillators = []
  let bgmGainNodes = []
  let isBgmPlaying = false
  let drawSoundInterval = null
  let autoStartRequested = false

  // 初始化 AudioContext
  const initAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
  }

  // 播放绘画沙沙声（使用噪音）
  const startDrawSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()

    // 停止之前的
    stopDrawSound()

    // 创建噪音源
    const bufferSize = audioContext.sampleRate * 0.1 // 0.1秒的缓冲
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.1 // 低音量白噪音
    }

    // 循环播放噪音
    const playNoise = () => {
      if (!soundEnabled.value || drawSoundInterval === null) return

      const noise = audioContext.createBufferSource()
      noise.buffer = noiseBuffer

      // 带通滤波器，模拟铅笔沙沙声（中频）
      const bandpass = audioContext.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 2000 + Math.random() * 1000 // 2000-3000Hz
      bandpass.Q.value = 0.5

      // 增益控制
      const gain = audioContext.createGain()
      gain.gain.value = soundVolume.value * 0.3

      noise.connect(bandpass)
      bandpass.connect(gain)
      gain.connect(audioContext.destination)

      noise.start()
      noise.stop(audioContext.currentTime + 0.05)
    }

    // 快速连续播放，模拟连续的沙沙声
    drawSoundInterval = setInterval(playNoise, 30)
  }

  // 停止绘画声
  const stopDrawSound = () => {
    if (drawSoundInterval) {
      clearInterval(drawSoundInterval)
      drawSoundInterval = null
    }
  }

  // 播放成功欢呼声（旋律）
  const playSuccessSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()

    // 胜利旋律音符（C大调：C E G C5）
    const notes = [523.25, 659.25, 783.99, 1046.50]
    const startTime = audioContext.currentTime

    notes.forEach((freq, index) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      // 音量包络
      gain.gain.setValueAtTime(0, startTime + index * 0.15)
      gain.gain.linearRampToValueAtTime(soundVolume.value * 0.5, startTime + index * 0.15 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.15 + 0.3)

      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.start(startTime + index * 0.15)
      osc.stop(startTime + index * 0.15 + 0.3)
    })
  }

  // 播放失败/错误提示音
  const playErrorSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()

    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'sawtooth'
    osc.frequency.value = 200

    gain.gain.setValueAtTime(soundVolume.value * 0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start()
    osc.stop(audioContext.currentTime + 0.3)
  }

  // 播放按钮点击声
  const playClickSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()

    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

    gain.gain.setValueAtTime(soundVolume.value * 0.2, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start()
    osc.stop(audioContext.currentTime + 0.1)
  }

  // 开始背景音乐（简单的循环琶音器）
  const startBGM = () => {
    console.log('startBGM called, musicEnabled:', musicEnabled.value, 'isBgmPlaying:', isBgmPlaying)
    if (!musicEnabled.value) {
      console.log('Music not enabled, not starting')
      return
    }
    if (isBgmPlaying) {
      console.log('BGM already playing')
      return
    }
    if (!audioContext) {
      console.log('No audioContext, initializing first')
      initAudioContext()
    }

    console.log('Starting BGM...')
    isBgmPlaying = true

    // C大调和弦进行：C F G C
    const chordProgression = [
      [261.63, 329.63, 392.00], // C 大三和弦
      [349.23, 440.00, 523.25], // F 大三和弦
      [392.00, 493.88, 587.33], // G 大三和弦
      [261.63, 329.63, 392.00]  // C 大三和弦
    ]

    let chordIndex = 0
    let noteIndex = 0

    // 琶音器循环
    const playArpeggio = () => {
      if (!musicEnabled.value || !isBgmPlaying || !audioContext) return

      const chord = chordProgression[chordIndex]
      const freq = chord[noteIndex % chord.length]

      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc.type = 'triangle' // 柔和的三角波
      osc.frequency.value = freq

      // 轻柔的音量
      const noteGain = musicVolume.value * 0.15
      gain.gain.setValueAtTime(0, audioContext.currentTime)
      gain.gain.linearRampToValueAtTime(noteGain, audioContext.currentTime + 0.05)
      gain.gain.linearRampToValueAtTime(noteGain * 0.5, audioContext.currentTime + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)

      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.start()
      osc.stop(audioContext.currentTime + 0.5)

      // 保存振荡器引用用于清理
      bgmOscillators.push(osc)
      bgmGainNodes.push(gain)

      noteIndex++
      if (noteIndex >= chord.length * 2) { // 每个和弦弹两次琶音
        noteIndex = 0
        chordIndex = (chordIndex + 1) % chordProgression.length
      }
    }

    // 每0.25秒一个音符
    const bgmInterval = setInterval(playArpeggio, 250)

    // 清理旧的定时器
    const oldBgmInterval = window._bgmInterval
    if (oldBgmInterval) clearInterval(oldBgmInterval)
    window._bgmInterval = bgmInterval

    // 立即开始第一个音符
    playArpeggio()
  }

  // 停止背景音乐
  const stopBGM = () => {
    console.log('stopBGM called')
    isBgmPlaying = false
    if (window._bgmInterval) {
      clearInterval(window._bgmInterval)
      window._bgmInterval = null
    }
    // 清理所有振荡器
    bgmOscillators.forEach(osc => {
      try { osc.stop() } catch (e) {}
    })
    bgmOscillators = []
    bgmGainNodes = []
  }

  // 切换音效开关
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
    saveState('aiDrawSoundEnabled', soundEnabled.value)
    if (!soundEnabled.value) {
      stopDrawSound()
    }
    playClickSound()
  }

  // 尝试自动播放背景音乐（在用户首次交互后）
  const tryAutoStartBGM = () => {
    if (musicEnabled.value && !isBgmPlaying && audioContext) {
      console.log('Auto-starting BGM...')
      startBGM()
    }
  }

  // 请求自动播放（在用户交互时调用）
  const requestAutoStart = () => {
    initAudioContext()
    autoStartRequested = true
    tryAutoStartBGM()
  }

  // 切换音乐开关
  const toggleMusic = () => {
    musicEnabled.value = !musicEnabled.value
    saveState('aiDrawMusicEnabled', musicEnabled.value)
    if (musicEnabled.value) {
      startBGM()
    } else {
      stopBGM()
    }
    playClickSound()
  }

  // 设置音效音量
  const setSoundVolume = (vol) => {
    soundVolume.value = Math.max(0, Math.min(1, vol))
    saveState('aiDrawSoundVolume', soundVolume.value)
  }

  // 设置音乐音量
  const setMusicVolume = (vol) => {
    musicVolume.value = Math.max(0, Math.min(1, vol))
    saveState('aiDrawMusicVolume', musicVolume.value)
  }

  // 清理资源
  const cleanup = () => {
    stopDrawSound()
    stopBGM()
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    initAudioContext,
    startDrawSound,
    stopDrawSound,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    startBGM,
    stopBGM,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setMusicVolume,
    requestAutoStart,
    tryAutoStartBGM,
    cleanup
  }
}
