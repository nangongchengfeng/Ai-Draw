<template>
  <div class="audio-controls-inline">
    <button
      class="audio-btn-inline"
      @click="toggleMusic"
      :title="musicEnabled ? '关闭音乐' : '开启音乐'"
    >
      {{ musicEnabled ? '🔊' : '🔇' }}
    </button>
    <button
      class="audio-btn-inline"
      @click="toggleSound"
      :title="soundEnabled ? '关闭音效' : '开启音效'"
    >
      {{ soundEnabled ? '🔔' : '🔕' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  musicEnabled: Boolean,
  soundEnabled: Boolean
})

const emit = defineEmits(['toggleMusic', 'toggleSound'])

const toggleMusic = () => emit('toggleMusic')
const toggleSound = () => emit('toggleSound')
</script>

<style scoped lang="scss">
.audio-controls-inline {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 8px;
  margin-bottom: 8px;
  border-bottom: var(--border-hairline) dashed var(--color-border-subtle);

  .audio-btn-inline {
    width: 40px;
    height: 40px;
    font-size: 20px;
    border: var(--border-medium) solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background: var(--color-bg-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--motion-duration-fast) var(--motion-easing);

    &:hover {
      transform: scale(1.1) rotate(5deg);
      background: var(--color-bg-secondary);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
