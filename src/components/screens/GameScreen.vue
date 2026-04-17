<template>
  <div class="game-screen">
    <TopBar
      :current-round="currentRound"
      :max-rounds="maxRounds"
      :score="score"
      :time-left="timeLeft"
      @end-game="$emit('endGame')"
    />

    <TargetWordBar :target-word="targetWord" />

    <div class="game-main">
      <CanvasSection
        ref="canvasSectionRef"
        :error="error"
        :is-recognizing="isRecognizing"
        :is-result="isResult"
        :has-drawing="hasDrawing"
        @clear-canvas="$emit('clearCanvas')"
        @submit-drawing="$emit('submitDrawing', $event)"
        @drawing-change="onDrawingChange"
      />

      <ResultSection
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        :is-recognizing="isRecognizing"
        :is-result="isResult"
        :is-last-round-matched="isLastRoundMatched"
        :last-round-score="lastRoundScore"
        :last-round-data="lastRoundData"
        :ai-result="aiResult"
        :target-word="targetWord"
        :is-game-over="isGameOver"
        :has-drawing="hasDrawing"
        @toggle-music="$emit('toggleMusic')"
        @toggle-sound="$emit('toggleSound')"
        @next-round="handleNextRound"
        @go-to-game-over="$emit('goToGameOver')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopBar from '../game/TopBar.vue'
import TargetWordBar from '../game/TargetWordBar.vue'
import CanvasSection from '../game/CanvasSection.vue'
import ResultSection from '../game/ResultSection.vue'
import { GAME_STATUS } from '../../composables/useGameFlow'

const props = defineProps({
  gameStatus: String,
  musicEnabled: Boolean,
  soundEnabled: Boolean,
  currentRound: Number,
  maxRounds: Number,
  score: Number,
  timeLeft: Number,
  targetWord: Object,
  error: String,
  aiResult: String,
  isGameOver: Boolean,
  isLastRoundMatched: Boolean,
  lastRoundScore: Number,
  lastRoundData: Object,
  roundHistory: Array,
  hasDrawing: Boolean
})

const emit = defineEmits([
  'toggleMusic', 'toggleSound', 'endGame', 'clearCanvas',
  'submitDrawing', 'drawingChange', 'nextRound', 'goToGameOver'
])

const canvasSectionRef = ref(null)

const isRecognizing = computed(() => props.gameStatus === GAME_STATUS.RECOGNIZING)
const isResult = computed(() => props.gameStatus === GAME_STATUS.RESULT)

const onDrawingChange = (data) => {
  emit('drawingChange', data)
}

const handleNextRound = () => {
  canvasSectionRef.value?.clearCanvas()
  emit('nextRound')
}
</script>

<style scoped lang="scss">
.game-screen {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
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
</style>
