<template>
  <div v-if="show" class="modal-overlay history-modal" @click.self="close">
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
        <button class="btn secondary" @click="close">
          关闭
        </button>
        <button v-if="gameHistory.length > 0" class="btn danger" @click="clear">
          清空记录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  gameHistory: Array
})

const emit = defineEmits(['close', 'clear'])

const close = () => emit('close')
const clear = () => emit('clear')

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
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

  &.history-modal {
    .history-card {
      width: 500px;
      max-width: 90vw;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
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
      flex: 1;
      min-height: 0;
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

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--color-text-primary);
}

.modal-buttons {
  display: flex;
  gap: 12px;

  .btn {
    flex: 1;
  }
}
</style>
