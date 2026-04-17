<template>
  <div class="start-screen fade-in">
    <div class="card">
      <AudioControls
        :music-enabled="musicEnabled"
        :sound-enabled="soundEnabled"
        @toggle-music="$emit('toggleMusic')"
        @toggle-sound="$emit('toggleSound')"
      />
      <h1 class="game-title">🎨 我画AI猜</h1>

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
        <button class="btn primary start-btn" @click="$emit('startGame')">
          开始游戏
        </button>
        <button class="btn secondary history-btn" @click="$emit('openHistory')">
          📋 历史记录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AudioControls from '../common/AudioControls.vue'

const DIFFICULTIES = {
  easy: { name: '简单', rounds: 3, drawTime: 90, icon: '😊' },
  normal: { name: '中等', rounds: 5, drawTime: 60, icon: '😐' },
  hard: { name: '困难', rounds: 8, drawTime: 30, icon: '😤' }
}

const selectedDifficulty = ref('normal')

defineProps({
  musicEnabled: Boolean,
  soundEnabled: Boolean
})

const emit = defineEmits(['toggleMusic', 'toggleSound', 'startGame', 'openHistory', 'selectDifficulty'])

const selectDifficulty = (diff) => {
  selectedDifficulty.value = diff
  emit('selectDifficulty', diff)
}
</script>

<style scoped lang="scss">
.start-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;

  .card {
    width: 550px;
    max-width: 90vw;
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
</style>
