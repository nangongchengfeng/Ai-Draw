<template>
  <div class="app">
    <DoodleDecorations />

    <!-- 结束游戏确认弹窗 -->
    <div v-if="showEndConfirm" class="modal-overlay" @click.self="cancelEndGame">
      <div class="modal-card card fade-in">
        <h2 class="modal-title">⚠️ 确认结束游戏？</h2>
        <div class="modal-info">
          <div class="info-row">
            <span class="info-label">当前轮次:</span>
            <span class="info-value">{{ currentRound }}/{{ maxRounds }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前得分:</span>
            <span class="info-value highlight">{{ score }}</span>
          </div>
        </div>
        <p class="modal-hint">结束后可查看本次成绩</p>
        <div class="modal-buttons">
          <button class="btn secondary" @click="cancelEndGame">
            继续游戏
          </button>
          <button class="btn danger" @click="confirmEndGame">
            确定结束
          </button>
        </div>
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <div v-if="showHistory" class="modal-overlay history-modal" @click.self="closeHistory">
      <div class="history-card card fade-in">
        <h2 class="modal-title">📋 游戏历史</h2>
        <div v-if="gameHistory.length === 0" class="empty-history">
          <p>还没有游戏记录</p>
          <p>开始游戏后，记录会保存在这里！</p>
        </div>
        <div v-else class="history-list">
          <div v-for="(record, index) in gameHistory" :key="index" class="history-item">
            <div class="history-header">
              <span class="history-date">{{ formatDate(record.date) }}</span>
              <span class="history-score">🏆 {{ record.score }}分</span>
            </div>
            <div class="history-detail">
              <span>完成 {{ record.completedRounds }}/{{ record.totalRounds }} 轮</span>
            </div>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn secondary" @click="closeHistory">
            关闭
          </button>
          <button v-if="gameHistory.length > 0" class="btn danger" @click="clearHistory">
            清空记录
          </button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 游戏开始界面 -->
      <div v-if="gameStatus === GAME_STATUS.IDLE" class="start-screen fade-in">
        <div class="card">
          <h1 class="game-title">🎨 我画AI猜</h1>

          <!-- 难度选择 -->
          <div class="difficulty-selector">
            <h3>选择难度</h3>
            <div class="difficulty-buttons">
              <button
                v-for="(config, key) in DIFFICULTIES"
                :key="key"
                class="btn difficulty-btn"
                :class="{ selected: selectedDifficulty === key, primary: selectedDifficulty === key, secondary: selectedDifficulty !== key }"
                @click="selectDifficulty(key)"
              >
                <span class="diff-icon">{{ config.icon }}</span>
                <span class="diff-name">{{ config.name }}</span>
                <span class="diff-info">{{ config.rounds }}轮 / {{ config.drawTime }}秒</span>
              </button>
            </div>
          </div>

          <h2>游戏规则</h2>
          <ul class="rules">
            <li>每轮系统会给出一个词语</li>
            <li>你有{{ DIFFICULTIES[selectedDifficulty].drawTime }}秒时间画出这个词语</li>
            <li>AI会根据你的画作猜测内容</li>
            <li>AI猜得越快越准确，得分越高</li>
            <li>总共{{ DIFFICULTIES[selectedDifficulty].rounds }}轮，看看你能得多少分！</li>
          </ul>
          <div class="start-buttons">
            <button class="btn primary start-btn" @click="handleStartGame">
              开始游戏
            </button>
            <button class="btn secondary history-btn" @click="showHistory = true">
              📋 历史记录
            </button>
          </div>
        </div>
      </div>

      <!-- 游戏结束结算页面 -->
      <div v-else-if="gameStatus === GAME_STATUS.GAME_OVER" class="game-over-screen fade-in">
        <div class="card game-over-card">
          <h1 class="game-over-title">🎉 游戏结束！</h1>

          <div class="final-score-section">
            <div class="score-badge">
              <span class="score-label">最终得分</span>
              <span class="score-value">{{ score }}</span>
            </div>
            <div class="player-title">{{ getPlayerTitle(score) }}</div>
          </div>

          <!-- 每轮回顾 -->
          <div class="rounds-review">
            <h3>📝 每轮回顾</h3>
            <div class="rounds-list">
              <div v-for="(round, index) in roundHistory" :key="index" class="round-item">
                <div class="round-info">
                  <span class="round-number">第{{ round.round }}轮</span>
                  <span class="round-target">{{ round.targetWord.categoryIcon }} {{ round.targetWord.word }}</span>
                </div>
                <div class="round-result" :class="{ matched: round.matched, missed: !round.matched }">
                  <span v-if="round.matched" class="matched-text">✓ AI猜对了！+{{ round.score }}分</span>
                  <span v-else class="missed-text">✗ AI猜: {{ round.aiGuess }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="game-over-buttons">
            <button class="btn primary" @click="handleStartGame">
              🔄 再来一局
            </button>
            <button class="btn secondary" @click="returnToStart">
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>

      <!-- 游戏进行中界面 -->
      <div v-else class="game-screen">
        <!-- 顶部游戏信息栏 -->
        <div class="top-bar">
          <div class="game-info">
            <div class="info-item">
              <span class="label">轮次:</span>
              <span class="value">{{ currentRound }}/{{ maxRounds }}</span>
            </div>
            <div class="info-item">
              <span class="label">得分:</span>
              <span class="value">{{ score }}</span>
            </div>
            <div class="info-item">
              <span class="label">剩余时间:</span>
              <span class="value time-left" :class="{ danger: timeLeft <= 10 }">
                {{ timeLeft }}s
              </span>
            </div>
          </div>
          <button
            class="btn secondary end-btn"
            @click="handleEndGame"
          >
            结束游戏
          </button>
        </div>

        <!-- 目标词显示 -->
        <div v-if="targetWord" class="target-word-bar card">
          <span class="target-label">本轮目标:</span>
          <span class="target-category">{{ targetWord.categoryIcon }} {{ targetWord.categoryName }}</span>
          <span class="target-word-text">{{ targetWord.word }}</span>
        </div>

        <div class="game-main">
          <!-- 绘图板 -->
          <div class="canvas-section">
            <DrawingCanvas
              ref="canvasRef"
              @drawingChange="onDrawingChange"
            />

            <div v-if="error" class="error-message">
              ⚠️ {{ error }}
            </div>

            <div class="action-buttons">
              <button
                class="btn danger"
                @click="handleClearCanvas"
              >
                清空画布
              </button>
              <button
                class="btn primary submit-btn"
                @click="submitDrawing"
                :disabled="gameStatus === GAME_STATUS.RECOGNIZING || !hasDrawing || gameStatus === GAME_STATUS.RESULT"
              >
                {{ gameStatus === GAME_STATUS.RECOGNIZING ? 'AI正在思考中...' : '提交作品' }}
              </button>
            </div>
          </div>

          <!-- AI猜测区域 -->
          <div class="result-section card">
            <div class="result-content">
              <!-- 加载状态 -->
              <div v-if="gameStatus === GAME_STATUS.RECOGNIZING" class="status-container loading-state">
                <div class="loading-spinner"></div>
                <h2 class="status-title">🤖 AI正在思考中...</h2>
                <p class="status-hint">请稍候，AI正在分析您的画作</p>
              </div>

              <!-- 结果状态 -->
              <div v-else-if="gameStatus === GAME_STATUS.RESULT" class="status-container result-state fade-in">
                <div class="match-result" :class="{ matched: isLastRoundMatched, missed: !isLastRoundMatched }">
                  <span v-if="isLastRoundMatched" class="match-icon">🎉</span>
                  <span v-else class="match-icon">😅</span>
                  <span class="match-text">
                    {{ isLastRoundMatched ? 'AI猜对啦！' : 'AI没猜对...' }}
                  </span>
                  <span class="score-gain">+{{ lastRoundScore }}分</span>
                </div>

                <!-- AI评分详情 -->
                <div v-if="lastRoundData" class="score-detail">
                  <div class="score-row">
                    <span class="score-label">相似度:</span>
                    <div class="score-bar">
                      <div class="score-fill" :style="{ width: lastRoundData.similarityScore + '%' }"></div>
                      <span class="score-text">{{ lastRoundData.similarityScore }}%</span>
                    </div>
                  </div>
                  <div class="score-row">
                    <span class="score-label">时间加成:</span>
                    <span class="time-bonus">×{{ lastRoundData.timeBonus }}</span>
                  </div>
                  <div v-if="lastRoundData.aiExplanation" class="explanation">
                    <span class="explanation-label">AI评语:</span>
                    <span class="explanation-text">{{ lastRoundData.aiExplanation }}</span>
                  </div>
                </div>

                <h2>🤖 AI的猜测是:</h2>
                <p class="ai-result">{{ aiResult }}</p>

                <div v-if="targetWord" class="target-reminder">
                  正确答案: <strong>{{ targetWord.word }}</strong>
                </div>

                <div class="result-actions">
                  <button v-if="!isGameOver" class="btn primary" @click="handleNextRound">
                    下一轮 →
                  </button>
                  <button v-else class="btn success" @click="handleGoToGameOver">
                    查看成绩 📊
                  </button>
                </div>
              </div>

              <!-- 空闲/绘画状态 -->
              <div v-else class="status-container idle-state">
                <div class="idle-icon">🎨</div>
                <h2 class="status-title">开始绘画吧！</h2>
                <p class="status-hint">画出 <strong>{{ targetWord?.word }}</strong>，让AI猜猜看！</p>

                <div v-if="hasDrawing" class="drawing-hint">
                  <span class="hint-icon">✓</span>
                  检测到您的画作，随时可以提交！
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import DrawingCanvas from './components/Canvas/DrawingCanvas.vue'
import DoodleDecorations from './components/DoodleDecorations.vue'
import { useGameFlow, GAME_STATUS } from './composables/useGameFlow'

// 难度配置
const DIFFICULTIES = {
  easy: { name: '简单', rounds: 3, drawTime: 90, icon: '😊' },
  normal: { name: '中等', rounds: 5, drawTime: 60, icon: '😐' },
  hard: { name: '困难', rounds: 8, drawTime: 30, icon: '😤' }
}

const selectedDifficulty = ref('normal')

const {
  status: gameStatus,
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
  submitDrawing: submitToAI,
  nextRound,
  endGame,
  returnToStart,
  goToGameOver,
  cleanup,
  setMaxRounds,
  setDrawTime
} = useGameFlow()

const canvasRef = ref(null)
const hasDrawing = ref(false)
const drawTime = ref(import.meta.env.VITE_GAME_DRAW_TIME || 60)
const showEndConfirm = ref(false)
const showHistory = ref(false)
const gameHistory = ref([])

// 计算属性：最后一轮是否匹配
const isLastRoundMatched = computed(() => {
  if (roundHistory.value.length === 0) return false
  return roundHistory.value[roundHistory.value.length - 1].matched
})

// 计算属性：最后一轮得分
const lastRoundScore = computed(() => {
  if (roundHistory.value.length === 0) return 0
  return roundHistory.value[roundHistory.value.length - 1].score
})

// 计算属性：最后一轮完整数据
const lastRoundData = computed(() => {
  if (roundHistory.value.length === 0) return null
  return roundHistory.value[roundHistory.value.length - 1]
})

// 获取玩家称号
const getPlayerTitle = (finalScore) => {
  if (finalScore >= 400) return '🏆 绘画大师'
  if (finalScore >= 250) return '🎨 灵魂画手'
  if (finalScore >= 100) return '✏️ 创意画家'
  return '🌟 初出茅庐'
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载历史记录
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('aiDrawGameHistory')
    if (saved) {
      gameHistory.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

// 保存历史记录
const saveHistory = () => {
  if (roundHistory.value.length === 0) return

  const record = {
    date: new Date().toISOString(),
    score: score.value,
    completedRounds: roundHistory.value.length,
    totalRounds: maxRounds.value,
    rounds: roundHistory.value
  }

  gameHistory.value.unshift(record)
  // 只保留最近20条记录
  if (gameHistory.value.length > 20) {
    gameHistory.value = gameHistory.value.slice(0, 20)
  }

  try {
    localStorage.setItem('aiDrawGameHistory', JSON.stringify(gameHistory.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

// 清空历史记录
const clearHistory = () => {
  gameHistory.value = []
  try {
    localStorage.removeItem('aiDrawGameHistory')
  } catch (e) {
    console.error('Failed to clear history:', e)
  }
}

const closeHistory = () => {
  showHistory.value = false
}

// 选择难度
const selectDifficulty = (diff) => {
  selectedDifficulty.value = diff
  const config = DIFFICULTIES[diff]
  setMaxRounds(config.rounds)
  setDrawTime(config.drawTime)
}

// 确保保存历史记录
const handleGoToGameOver = () => {
  saveHistory()
  goToGameOver()
}

const onDrawingChange = (data) => {
  hasDrawing.value = !!data
}

const handleClearCanvas = () => {
  canvasRef.value?.clearCanvas()
}

const submitDrawing = async () => {
  const canvasData = canvasRef.value?.getCanvasData()
  await submitToAI(canvasData)
}

const handleNextRound = () => {
  handleClearCanvas()
  nextRound()
}

const handleStartGame = () => {
  // 确保难度设置在开始游戏前生效
  const config = DIFFICULTIES[selectedDifficulty.value]
  setMaxRounds(config.rounds)
  setDrawTime(config.drawTime)
  handleClearCanvas()
  startGame()
}

const handleEndGame = () => {
  showEndConfirm.value = true
}

const confirmEndGame = () => {
  showEndConfirm.value = false
  // 保存历史记录再结束
  saveHistory()
  endGame()
}

const cancelEndGame = () => {
  showEndConfirm.value = false
}

onMounted(() => {
  loadHistory()
  // 初始化默认难度
  selectDifficulty(selectedDifficulty.value)
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.app {
  width: 100%;
  min-height: 100vh;
  padding: 8px;
  position: relative;
  z-index: 1;
}

.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
}

.start-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;

  .card {
    max-width: 550px;
    width: 100%;
    text-align: center;

    .game-title {
      font-size: 42px;
      margin-bottom: 20px;
      color: var(--color-text-primary);
      animation: wiggle 3s ease-in-out infinite;
      display: inline-block;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 16px;
      color: var(--color-text-primary);
    }

    /* 难度选择器 */
    .difficulty-selector {
      margin-bottom: 20px;
      text-align: left;

      h3 {
        font-size: 18px;
        margin-bottom: 12px;
        color: var(--color-text-primary);
        text-align: center;
      }

      .difficulty-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .difficulty-btn {
        flex: 1;
        min-width: 120px;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;

        .diff-icon {
          font-size: 24px;
        }

        .diff-name {
          font-size: 15px;
          font-weight: 600;
        }

        .diff-info {
          font-size: 11px;
          opacity: 0.8;
        }
      }
    }

    .rules {
      text-align: left;
      margin-bottom: 24px;
      padding-left: 32px;

      li {
        font-size: 16px;
        line-height: 1.8;
        color: var(--color-text-secondary);
        position: relative;
        list-style: none;

        &::before {
          content: '✏️';
          position: absolute;
          left: -28px;
        }
      }
    }

    .start-buttons {
      display: flex;
      gap: 12px;

      .btn {
        flex: 1;
      }

      .start-btn {
        font-size: 20px;
        padding: 16px;
        animation: bounce-in 0.5s ease-out 0.3s both;
      }

      .history-btn {
        font-size: 16px;
        padding: 16px;
      }
    }
  }
}

.game-over-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;

  .game-over-card {
    max-width: 600px;
    width: 100%;
    text-align: center;
    max-height: none;
    flex-shrink: 0;
  }

  .game-over-title {
    font-size: 36px;
    margin-bottom: 24px;
    color: var(--color-text-primary);
  }

  .final-score-section {
    margin-bottom: 24px;
    padding: 24px;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    border: var(--border-medium) dashed var(--color-brand-primary);

    .score-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 12px;

      .score-label {
        font-size: 16px;
        color: var(--color-text-secondary);
        margin-bottom: 4px;
      }

      .score-value {
        font-size: 56px;
        font-weight: 700;
        color: var(--color-brand-primary);
        line-height: 1;
      }
    }

    .player-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  .rounds-review {
    text-align: left;
    margin-bottom: 24px;

    h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--color-text-primary);
    }

    .rounds-list {
      max-height: 250px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .round-item {
      padding: 12px;
      background: var(--color-bg-primary);
      border-radius: var(--radius-md);
      border: var(--border-hairline) solid var(--color-border-subtle);

      .round-info {
        display: flex;
        gap: 12px;
        margin-bottom: 6px;
        align-items: center;

        .round-number {
          font-weight: 600;
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .round-target {
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 16px;
        }
      }

      .round-result {
        font-size: 14px;

        &.matched {
          color: #38a169;
        }

        &.missed {
          color: #e53e3e;
        }
      }
    }
  }

  .game-over-buttons {
    display: flex;
    gap: 12px;

    .btn {
      flex: 1;
    }
  }
}

.game-screen {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 16px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: var(--border-medium) solid var(--color-border-strong);
  position: relative;
  z-index: 25;
  flex-shrink: 0;

  .game-info {
    display: flex;
    align-items: center;
    gap: 24px;

    .info-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;

      .label {
        font-size: 13px;
        color: var(--color-text-muted);
        font-weight: 600;
      }

      .value {
        font-size: 20px;
        font-weight: 700;
        color: var(--color-text-primary);

        &.time-left.danger {
          color: #f56565;
          animation: pulse 1s infinite;
        }
      }
    }
  }

  .end-btn {
    padding: 8px 20px;
    font-size: 14px;
    flex-shrink: 0;
  }
}

.target-word-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  flex-shrink: 0;

  .target-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .target-category {
    font-size: 14px;
    color: var(--color-text-muted);
    background: var(--color-bg-secondary);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
  }

  .target-word-text {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-brand-primary);
    animation: pulse 2s infinite;
  }
}

.game-main {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 8px;
  flex: 1;
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: auto;
  }
}

.canvas-section {
  position: relative;
  z-index: 20;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: var(--border-medium) solid var(--color-border-strong);
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    position: relative;
    z-index: 30;
    flex-shrink: 0;

    .btn {
      flex: 1;
    }

    .submit-btn {
      flex: 2;
    }
  }

  .error-message {
    margin-top: 12px;
    padding: 10px;
    background: #fed7d7;
    color: #c53030;
    border-radius: var(--radius-md);
    font-size: 13px;
    border: var(--border-medium) dashed #c53030;
    flex-shrink: 0;
  }
}

.result-section {
  position: sticky;
  top: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    position: static;
    height: auto;
  }

  .result-content {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
  }

  .status-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 8px;
    flex: 1;
    min-height: 0;
  }

  /* 匹配结果提示 */
  .match-result {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    font-weight: 600;

    &.matched {
      background: #c6f6d5;
      color: #22543d;
    }

    &.missed {
      background: #fed7d7;
      color: #742a2a;
    }

    .match-icon {
      font-size: 20px;
    }

    .score-gain {
      margin-left: auto;
      font-weight: 700;
    }
  }

  .target-reminder {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 16px;
  }

  /* 评分详情 */
  .score-detail {
    width: 100%;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    border: var(--border-hairline) dashed var(--color-border-subtle);

    .score-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .score-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .score-bar {
        flex: 1;
        margin-left: 12px;
        height: 20px;
        background: var(--color-border-subtle);
        border-radius: 10px;
        position: relative;
        overflow: hidden;

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-accent));
          border-radius: 10px;
          transition: width 0.5s ease-out;
        }

        .score-text {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-primary);
        }
      }

      .time-bonus {
        font-size: 16px;
        font-weight: 700;
        color: var(--color-brand-primary);
      }
    }

    .explanation {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--color-border-subtle);
      display: flex;
      flex-direction: column;
      gap: 4px;

      .explanation-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-muted);
      }

      .explanation-text {
        font-size: 13px;
        color: var(--color-text-secondary);
        line-height: 1.5;
        font-style: italic;
      }
    }
  }

  /* 加载状态 */
  .loading-state {
    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-border-subtle);
      border-top-color: var(--color-brand-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
  }

  /* 结果状态 */
  .result-state {
    h2 {
      font-size: 16px;
      margin-bottom: 10px;
      color: var(--color-text-primary);
    }

    .ai-result {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-brand-primary);
      margin-bottom: 12px;
      padding: 14px;
      background: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      border: var(--border-medium) dashed var(--color-brand-primary);
      position: relative;
      word-break: break-word;
      width: 100%;

      &::before, &::after {
        content: '✨';
        position: absolute;
        top: 6px;
        font-size: 14px;
      }

      &::before { left: 8px; }
      &::after { right: 8px; }
    }

    .result-actions {
      .btn {
        width: 100%;
      }
    }
  }

  /* 空闲状态 */
  .idle-state {
    .idle-icon {
      font-size: 56px;
      margin-bottom: 16px;
      animation: float 3s ease-in-out infinite;
    }

    .drawing-hint {
      margin-top: 16px;
      padding: 10px 14px;
      background: #c6f6d5;
      color: #22543d;
      border-radius: var(--radius-md);
      border: var(--border-medium) dashed #38a169;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: pulse 2s infinite;

      .hint-icon {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .status-title {
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--color-text-primary);
    font-weight: 600;
  }

  .status-hint {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}

.card {
  position: relative;
  z-index: 25;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;

  .modal-card {
    max-width: 400px;
    width: 100%;
    flex-shrink: 0;
  }

  &.history-modal {
    .history-card {
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .empty-history {
      padding: 40px 20px;
      text-align: center;
      color: var(--color-text-muted);

      p {
        margin-bottom: 8px;
      }
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      max-height: 400px;
      overflow-y: auto;
    }

    .history-item {
      padding: 12px 16px;
      background: var(--color-bg-secondary);
      border-radius: var(--radius-md);
      border: var(--border-hairline) solid var(--color-border-subtle);

      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .history-date {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .history-score {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-brand-primary);
        }
      }

      .history-detail {
        font-size: 13px;
        color: var(--color-text-muted);
      }
    }
  }
}

.modal-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: bounce-in 0.3s var(--motion-easing) forwards;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--color-text-primary);
}

.modal-info {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  border: var(--border-medium) dashed var(--color-brand-primary);

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    &:not(:last-child) {
      border-bottom: 1px dashed var(--color-border-subtle);
    }

    .info-label {
      font-size: 16px;
      color: var(--color-text-secondary);
      font-weight: 600;
    }

    .info-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-text-primary);

      &.highlight {
        color: var(--color-brand-primary);
      }
    }
  }
}

.modal-hint {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 12px;

  .btn {
    flex: 1;
  }
}
</style>
