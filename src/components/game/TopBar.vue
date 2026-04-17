<template>
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
      @click="$emit('endGame')"
    >
      结束游戏
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentRound: Number,
  maxRounds: Number,
  score: Number,
  timeLeft: Number
})

defineEmits(['endGame'])
</script>

<style scoped lang="scss">
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
</style>
