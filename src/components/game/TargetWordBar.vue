<template>
  <div v-if="targetWord" class="target-word-bar card">
    <span class="target-label">本轮目标:</span>
    <span class="target-category">{{ targetWord.categoryIcon }} {{ targetWord.categoryName }}</span>
    <span class="target-word-text">{{ targetWord.word }}</span>
  </div>
</template>

<script setup>
defineProps({
  targetWord: Object
})
</script>

<style scoped lang="scss">
.target-word-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  flex-shrink: 0;

  .target-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .target-category {
    font-size: 14px;
    color: var(--color-text-muted);
    background: var(--color-bg-secondary);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
  }

  .target-word-text {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-brand-primary);
    animation: pulse 2s infinite;
  }
}
</style>
