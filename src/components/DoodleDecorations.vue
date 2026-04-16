<template>
  <div class="doodle-decorations">
    <div v-for="(deco, index) in decorations"
         :key="index"
         class="deco"
         :style="getDecoStyle(deco)"
         v-html="deco.icon">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const decorations = ref([])

const getDecoStyle = (deco) => {
  return {
    left: deco.x + 'px',
    top: deco.y + 'px',
    fontSize: deco.size + 'px',
    transform: `rotate(${deco.rotation}deg)`,
    opacity: deco.opacity,
    animation: `float ${deco.animationDuration}s ease-in-out infinite`,
    animationDelay: deco.animationDelay + 's'
  }
}

onMounted(() => {
  const icons = ['⭐', '✏️', '🎨', '✨', '💫', '🌟', '🖍️', '🎯', '🌈']
  const count = window.innerWidth < 768 ? 8 : 15

  for (let i = 0; i < count; i++) {
    decorations.value.push({
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 60 - 30,
      opacity: 0.3 + Math.random() * 0.4,
      animationDuration: 3 + Math.random() * 4,
      animationDelay: Math.random() * 2
    })
  }
})
</script>

<style scoped lang="scss">
.doodle-decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
  z-index: -1;
  overflow: hidden;
}

.deco {
  position: absolute;
  user-select: none;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg));
  }
}
</style>
