<template>
  <div class="game-over-screen fade-in">
    <div class="card game-over-card">
      <AudioControls
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        @toggle-music="$emit('toggleMusic')"
        @toggle-sound="$emit('toggleSound')"
      />
      <h1 class="game-over-title">🎉 游戏结束！</h1>

      <div class="final-score-section">
        <div class="score-badge">
          <span class="score-label">最终得分</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="player-title">{{ getPlayerTitle(score) }}</div>
      </div>

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
        <button class="btn primary" @click="$emit('startGame')">
          🔄 再来一局
        </button>
        <button class="btn secondary" @click="$emit('returnToStart')">
          🏠 返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AudioControls from '../common/AudioControls.vue'

defineProps({
  musicEnabled: Boolean,
  soundEnabled: Boolean,
  score: Number,
  roundHistory: Array
})

const emit = defineEmits(['toggleMusic', 'toggleSound', 'startGame', 'returnToStart'])

const getPlayerTitle = (finalScore) => {
  if (finalScore >= 400) return '🏆 绘画大师'
  if (finalScore >= 250) return '🎨 灵魂画手'
  if (finalScore >= 100) return '✏️ 创意画家'
  return '🌟 初出茅庐'
}
</script>

<style scoped lang="scss">
.game-over-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;

  .game-over-card {
    width: 600px;
    max-width: 90vw;
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
</style>
