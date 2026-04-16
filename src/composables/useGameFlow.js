import { ref, computed } from 'vue'
import { recognizeDrawing } from '../services/aiService'
import { getRandomWord } from '../data/wordLibrary'

export const GAME_STATUS = {
  IDLE: 'idle',        // 等待开始
  DRAWING: 'drawing',  // 绘图中
  RECOGNIZING: 'recognizing', // AI识别中
  RESULT: 'result',     // 结果展示
  GAME_OVER: 'game_over' // 游戏结束结算
}

export function useGameFlow() {
  const status = ref(GAME_STATUS.IDLE)
  const currentRound = ref(1)
  const score = ref(0)
  const timeLeft = ref(import.meta.env.VITE_GAME_DRAW_TIME || 60)
  const maxRounds = ref(import.meta.env.VITE_GAME_MAX_ROUNDS || 10)
  const gameDrawTime = ref(import.meta.env.VITE_GAME_DRAW_TIME || 60)
  const aiResult = ref('')
  const error = ref('')
  const targetWord = ref(null) // 当前目标词
  const roundHistory = ref([]) // 每轮历史记录
  let timer = null

  // 设置最大轮数
  const setMaxRounds = (count) => {
    maxRounds.value = count
  }

  // 设置每轮时间
  const setDrawTime = (seconds) => {
    gameDrawTime.value = seconds
  }

  const isGameOver = computed(() => currentRound.value > maxRounds.value)

  // 开始新游戏
  const startGame = () => {
    status.value = GAME_STATUS.DRAWING
    currentRound.value = 1
    score.value = 0
    aiResult.value = ''
    error.value = ''
    roundHistory.value = []
    targetWord.value = getRandomWord()
    startTimer()
  }

  // 开始倒计时
  const startTimer = () => {
    timeLeft.value = gameDrawTime.value
    clearInterval(timer)
    timer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        clearInterval(timer)
        // 时间到自动提交
        if (status.value === GAME_STATUS.DRAWING) {
          submitDrawing()
        }
      }
    }, 1000)
  }

  // 开始新一轮
  const startNewRound = () => {
    aiResult.value = ''
    error.value = ''
    targetWord.value = getRandomWord()
    status.value = GAME_STATUS.DRAWING
    startTimer()
  }

  // 提交画作
  const submitDrawing = async (canvasData) => {
    if (status.value !== GAME_STATUS.DRAWING) return

    try {
      status.value = GAME_STATUS.RECOGNIZING
      error.value = ''
      clearInterval(timer)

      const timeUsed = (import.meta.env.VITE_GAME_DRAW_TIME || 60) - timeLeft.value
      let roundScore = 0
      let matched = false
      let aiExplanation = ''
      let similarityScore = 0
      let timeBonus = '1.0'

      if (canvasData && targetWord.value) {
        // 调用AI智能评分
        const aiAnalysis = await recognizeDrawing(
          canvasData,
          targetWord.value.word,
          timeLeft.value
        )

        aiResult.value = aiAnalysis.guess
        aiExplanation = aiAnalysis.explanation
        similarityScore = aiAnalysis.similarityScore
        timeBonus = aiAnalysis.timeBonus
        matched = aiAnalysis.matched
        roundScore = aiAnalysis.score

        if (matched) {
          score.value += roundScore
        }
      } else {
        aiResult.value = '你没有画任何东西哦'
      }

      // 记录本轮历史
      roundHistory.value.push({
        round: currentRound.value,
        targetWord: targetWord.value,
        aiGuess: aiResult.value,
        aiExplanation,
        similarityScore,
        timeBonus,
        matched,
        score: roundScore,
        timeUsed,
        canvasData: canvasData || null
      })

      status.value = GAME_STATUS.RESULT
    } catch (err) {
      error.value = err.message
      status.value = GAME_STATUS.DRAWING
      startTimer() // 回到绘图状态继续
    }
  }

  // 下一轮
  const nextRound = () => {
    currentRound.value++
    if (isGameOver.value) {
      goToGameOver()
    } else {
      startNewRound()
    }
  }

  // 进入游戏结束结算状态
  const goToGameOver = () => {
    console.log('=== goToGameOver called in useGameFlow!')
    console.log('roundHistory:', roundHistory.value)
    console.log('score:', score.value)

    // 保存历史记录到localStorage
    if (roundHistory.value.length > 0) {
      try {
        const record = {
          date: new Date().toISOString(),
          score: score.value,
          completedRounds: roundHistory.value.length,
          totalRounds: maxRounds.value,
          rounds: roundHistory.value
        }

        console.log('Saving record:', record)

        // 读取现有历史
        let history = []
        const existing = localStorage.getItem('aiDrawGameHistory')
        if (existing) {
          history = JSON.parse(existing)
        }

        history.unshift(record)

        // 只保留最近20条
        if (history.length > 20) {
          history = history.slice(0, 20)
        }

        localStorage.setItem('aiDrawGameHistory', JSON.stringify(history))
        console.log('History saved successfully!')
      } catch (e) {
        console.error('Failed to save history in useGameFlow:', e)
      }
    } else {
      console.log('No rounds to save')
    }

    clearInterval(timer)
    status.value = GAME_STATUS.GAME_OVER
  }

  // 重新开始当前轮
  const restartRound = () => {
    aiResult.value = ''
    error.value = ''
    status.value = GAME_STATUS.DRAWING
    startTimer()
  }

  // 结束游戏
  const endGame = () => {
    clearInterval(timer)
    if (status.value === GAME_STATUS.DRAWING || status.value === GAME_STATUS.RESULT) {
      goToGameOver()
    } else {
      status.value = GAME_STATUS.IDLE
      currentRound.value = 1
      score.value = 0
      aiResult.value = ''
      error.value = ''
      roundHistory.value = []
      targetWord.value = null
    }
  }

  // 从游戏结束回到开始
  const returnToStart = () => {
    status.value = GAME_STATUS.IDLE
    currentRound.value = 1
    score.value = 0
    aiResult.value = ''
    error.value = ''
    roundHistory.value = []
    targetWord.value = null
  }

  // 清理定时器
  const cleanup = () => {
    clearInterval(timer)
  }

  return {
    status,
    currentRound,
    maxRounds,
    score,
    timeLeft,
    aiResult,
    error,
    targetWord,
    roundHistory,
    isGameOver,
    startGame,
    submitDrawing,
    nextRound,
    restartRound,
    endGame,
    returnToStart,
    goToGameOver,
    setMaxRounds,
    setDrawTime,
    cleanup
  }
}
