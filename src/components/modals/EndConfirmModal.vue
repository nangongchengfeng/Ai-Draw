<template>
  <div v-if="show" class="modal-overlay" @click.self="cancel">
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
        <button class="btn secondary" @click="cancel">
          继续游戏
        </button>
        <button class="btn danger" @click="confirm">
          确定结束
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  currentRound: Number,
  maxRounds: Number,
  score: Number
})

const emit = defineEmits(['cancel', 'confirm'])

const cancel = () => emit('cancel')
const confirm = () => emit('confirm')
</script>

<style scoped lang="scss">
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
  overflow: hidden;

  .modal-card {
    width: 400px;
    max-width: 90vw;
    flex-shrink: 0;
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
