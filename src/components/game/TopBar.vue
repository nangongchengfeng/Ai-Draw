<template>
  <div class="top-bar card">
    <div class="single-row">
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
      <div v-if="targetWord" class="target-word-bar">
        <span class="target-label">本轮目标:</span>
        <span class="target-category">{{ targetWord.categoryIcon }} {{ targetWord.categoryName }}</span>
        <span class="target-word-text">{{ targetWord.word }}</span>
      </div>
      <button
        class="btn secondary end-btn"
        @click="$emit('endGame')"
      >
        结束游戏
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentRound: Number,
  maxRounds: Number,
  score: Number,
  timeLeft: Number,
  targetWord: Object
})

defineEmits(['endGame'])
</script>

<style scoped lang="scss">
.top-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 16px;
  position: relative;
  z-index: 25;
  flex-shrink: 0;

  .single-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

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

  .target-word-bar {
    display: flex;
    align-items: center;
    gap: 8px;

    .target-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    .target-category {
      font-size: 13px;
      color: var(--color-text-muted);
      background: var(--color-bg-secondary);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .target-word-text {
      font-size: 22px;
      font-weight: 700;
      color: var(--color-brand-primary);
      animation: pulse 2s infinite;
    }
  }

  .end-btn {
    padding: 8px 20px;
    font-size: 14px;
    flex-shrink: 0;
  }
}
</style>
