<template>
  <div class="app" @click="onAppClick">
    <DoodleDecorations />

    <EndConfirmModal
      :show="showEndConfirm"
      :current-round="currentRound"
      :max-rounds="maxRounds"
      :score="score"
      @cancel="cancelEndGame"
      @confirm="confirmEndGame"
    />

    <HistoryModal
      :show="showHistory"
      :game-history="gameHistory"
      @close="closeHistory"
      @clear="clearHistory"
    />

    <div class="main-content">
      <StartScreen
        v-if="gameStatus === GAME_STATUS.IDLE"
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        @toggle-music="toggleMusic"
        @toggle-sound="toggleSound"
        @start-game="handleStartGame"
        @open-history="openHistory"
        @select-difficulty="selectDifficulty"
      />

      <GameOverScreen
        v-else-if="gameStatus === GAME_STATUS.GAME_OVER"
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        :score="score"
        :round-history="roundHistory"
        @toggle-music="toggleMusic"
        @toggle-sound="toggleSound"
        @start-game="handleStartGame"
        @return-to-start="returnToStart"
      />

      <GameScreen
        v-else
        ref="gameScreenRef"
        :game-status="gameStatus"
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        :current-round="currentRound"
        :max-rounds="maxRounds"
        :score="score"
        :time-left="timeLeft"
        :target-word="targetWord"
        :error="error"
        :ai-result="aiResult"
        :is-game-over="isGameOver"
        :is-last-round-matched="isLastRoundMatched"
        :last-round-score="lastRoundScore"
        :last-round-data="lastRoundData"
        :round-history="roundHistory"
        :has-drawing="hasDrawing"
        @toggle-music="toggleMusic"
        @toggle-sound="toggleSound"
        @end-game="handleEndGame"
        @clear-canvas="handleClearCanvas"
        @submit-drawing="submitDrawing"
        @drawing-change="onDrawingChange"
        @next-round="handleNextRound"
        @go-to-game-over="handleGoToGameOver"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import DrawingCanvas from './components/Canvas/DrawingCanvas.vue'
import DoodleDecorations from './components/DoodleDecorations.vue'
import { useGameFlow, GAME_STATUS } from './composables/useGameFlow'
import { useAudio } from './composables/useAudio'
import { useHistory } from './composables/useHistory'
import { useDifficulty, DIFFICULTIES } from './composables/useDifficulty'

import EndConfirmModal from './components/modals/EndConfirmModal.vue'
import HistoryModal from './components/modals/HistoryModal.vue'
import StartScreen from './components/screens/StartScreen.vue'
import GameOverScreen from './components/screens/GameOverScreen.vue'
import GameScreen from './components/screens/GameScreen.vue'

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
  returnToStart: _returnToStart,
  goToGameOver,
  cleanup,
  setMaxRounds,
  setDrawTime
} = useGameFlow()

const {
  soundEnabled,
  musicEnabled,
  initAudioContext,
  playSuccessSound,
  playErrorSound,
  playClickSound,
  startBGM,
  stopBGM,
  toggleSound,
  toggleMusic,
  requestAutoStart
} = useAudio()

const {
  gameHistory,
  showHistory,
  loadHistoryFromStorage,
  openHistory,
  closeHistory,
  clearHistory
} = useHistory()

const {
  selectedDifficulty,
  selectDifficulty
} = useDifficulty(setMaxRounds, setDrawTime, playClickSound)

const hasDrawing = ref(false)
const showEndConfirm = ref(false)
const gameScreenRef = ref(null)

const isLastRoundMatched = computed(() => {
  if (roundHistory.value.length === 0) return false
  return roundHistory.value[roundHistory.value.length - 1].matched
})

const lastRoundScore = computed(() => {
  if (roundHistory.value.length === 0) return 0
  return roundHistory.value[roundHistory.value.length - 1].score
})

const lastRoundData = computed(() => {
  if (roundHistory.value.length === 0) return null
  return roundHistory.value[roundHistory.value.length - 1]
})

const watchAiResult = () => {
  if (roundHistory.value.length > 0) {
    const lastRound = roundHistory.value[roundHistory.value.length - 1]
    if (lastRound.matched) {
      playSuccessSound()
    } else {
      playErrorSound()
    }
  }
}

const returnToStart = () => {
  playClickSound()
  stopBGM()
  _returnToStart()
}

const handleGoToGameOver = () => {
  console.log('handleGoToGameOver called, forwarding to useGameFlow')
  goToGameOver()
}

const onDrawingChange = (data) => {
  hasDrawing.value = !!data
}

const handleClearCanvas = () => {
  playClickSound()
}

const submitDrawing = async (canvasData) => {
  playClickSound()
  await submitToAI(canvasData)
  setTimeout(watchAiResult, 100)
}

const handleNextRound = () => {
  playClickSound()
  nextRound()
}

const handleStartGame = () => {
  playClickSound()
  requestAutoStart()
  console.log('=== handleStartGame called ===')
  const config = DIFFICULTIES[selectedDifficulty.value]
  console.log('Selected difficulty:', config)
  setMaxRounds(config.rounds)
  setDrawTime(config.drawTime)
  hasDrawing.value = false
  startGame()
  console.log('Game started!')
}

const handleEndGame = () => {
  playClickSound()
  showEndConfirm.value = true
}

const confirmEndGame = () => {
  playClickSound()
  stopBGM()
  showEndConfirm.value = false
  console.log('confirmEndGame called')
  handleGoToGameOver()
}

const cancelEndGame = () => {
  playClickSound()
  showEndConfirm.value = false
}

let audioContextActivated = false
const onAppClick = () => {
  if (!audioContextActivated) {
    audioContextActivated = true
    requestAutoStart()
  }
}

onMounted(() => {
  console.log('App mounted, loading history')
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

.card {
  position: relative;
  z-index: 25;
}
</style>
