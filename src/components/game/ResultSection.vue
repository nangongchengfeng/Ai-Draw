<template>
  <div class="result-section card">
    <AudioControls
      :music-enabled="musicEnabled"
      :sound-enabled="soundEnabled"
      @toggle-music="$emit('toggleMusic')"
      @toggle-sound="$emit('toggleSound')"
    />
    <div class="result-content">
      <!-- 加载状态 -->
      <div v-if="isRecognizing" class="status-container loading-state">
        <div class="loading-spinner"></div>
        <h2 class="status-title">🤖 AI正在思考中...</h2>
        <p class="status-hint">请稍候，AI正在分析您的画作</p>
      </div>

      <!-- 结果状态 -->
      <div v-else-if="isResult" class="status-container result-state fade-in">
        <div class="match-result" :class="{ matched: isLastRoundMatched, missed: !isLastRoundMatched }">
          <span v-if="isLastRoundMatched" class="match-icon">🎉</span>
          <span v-else class="match-icon">😅</span>
          <span class="match-text">
            {{ isLastRoundMatched ? 'AI猜对啦！' : 'AI没猜对...' }}
          </span>
          <span class="score-gain">+{{ lastRoundScore }}分</span>
        </div>

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
          <button v-if="!isGameOver" class="btn primary" @click="$emit('nextRound')">
            下一轮 →
          </button>
          <button v-else class="btn success" @click="$emit('goToGameOver')">
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
</template>

<script setup>
import AudioControls from '../common/AudioControls.vue'

defineProps({
  musicEnabled: Boolean,
  soundEnabled: Boolean,
  isRecognizing: Boolean,
  isResult: Boolean,
  isLastRoundMatched: Boolean,
  lastRoundScore: Number,
  lastRoundData: Object,
  aiResult: String,
  targetWord: Object,
  isGameOver: Boolean,
  hasDrawing: Boolean
})

defineEmits(['toggleMusic', 'toggleSound', 'nextRound', 'goToGameOver'])
</script>

<style scoped lang="scss">
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
</style>
