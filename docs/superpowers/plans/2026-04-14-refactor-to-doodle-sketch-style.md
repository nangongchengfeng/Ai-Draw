# 重构为 Doodle Sketch 风格游戏实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有的"我画AI猜"游戏重构为 S12 Doodle Sketch 涂鸦手绘风格

**Architecture:** 使用 CSS 变量实现设计 tokens，重构全局样式和组件，应用不规则边框、手绘字体和俏皮动画

**Tech Stack:** Vue 3 + Vite + SCSS + CSS Variables

---

## 文件结构概览

**修改文件:**
- `src/assets/style/global.scss` - 全局样式，添加 CSS tokens 和 Doodle Sketch 风格
- `src/App.vue` - 主应用组件，应用新风格
- `src/components/Canvas/DrawingCanvas.vue` - 画布组件，应用新风格
- `src/composables/useGameFlow.js` - 游戏逻辑（保持不变，仅样式调整）
- `src/services/aiService.js` - AI 服务（保持不变）
- `vite.config.js` - 可能需要调整别名配置

---

### Task 1: 创建设计 tokens 和 CSS 变量

**Files:**
- Modify: `src/assets/style/global.scss`

- [ ] **Step 1: 读取现有 global.scss 文件**

- [ ] **Step 2: 添加 S12 Doodle Sketch 风格的 CSS 变量**

```scss
// 在文件顶部添加设计 tokens
:root {
  // Color palette
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #FFFBEB;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-muted: #9CA3AF;
  --color-brand-primary: #F59E0B;
  --color-brand-accent: #EC4899;
  --color-border-strong: #1A1A1A;
  --color-border-subtle: rgba(0, 0, 0, 0.1);
  --color-focus-ring: #F59E0B;
  
  // Gradient background
  --color-gradient-start: #F59E0B;
  --color-gradient-end: #EC4899;
  
  // Radius
  --radius-none: 0px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-irregular: 255px 15px 225px 15px / 15px 225px 15px 255px;
  
  // Border width
  --border-hairline: 1px;
  --border-medium: 2px;
  --border-strong: 3px;
  
  // Shadow
  --shadow-soft: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
  
  // Layout
  --container-content: 1100px;
  --container-wide: 1200px;
  
  // Motion
  --motion-duration-fast: 200ms;
  --motion-duration-normal: 400ms;
  --motion-easing: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  // Typography
  --font-sans-primary: 'Indie Flower', 'Quicksand', sans-serif;
  --font-size-h1: 56px;
  --font-line-h1: 64px;
  --font-weight-h1: 400;
  --font-tracking-h1: 0.02em;
  --font-size-h2: 40px;
  --font-line-h2: 48px;
  --font-weight-h2: 400;
  --font-tracking-h2: 0.01em;
  --font-size-body: 18px;
  --font-line-body: 28px;
  --font-weight-body: 400;
  --font-tracking-body: 0em;
  
  // Spacing
  --spacing-base: 10px;
  --spacing-section-py-mobile: 80px 100px;
  --spacing-section-py-desktop: 120px 160px;
}
```

- [ ] **Step 3: 更新 body 样式使用新的渐变和字体**

```scss
@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Quicksand:wght@400;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans-primary);
  background: linear-gradient(135deg, var(--color-gradient-start) 0%, var(--color-gradient-end) 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  padding: calc(var(--spacing-base) * 2);
}

.container {
  max-width: var(--container-content);
  margin: 0 auto;
}
```

- [ ] **Step 4: 更新 .card 样式使用不规则边框和手绘风格**

```scss
.card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: calc(var(--spacing-base) * 2.4);
  box-shadow: var(--shadow-soft);
  border: var(--border-medium) solid var(--color-border-strong);
  position: relative;
  
  // 手绘风格装饰效果
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: var(--border-hairline) dashed var(--color-brand-primary);
    border-radius: var(--radius-lg);
    pointer-events: none;
    opacity: 0.3;
  }
  
  // 不规则边框效果
  clip-path: polygon(
    0% 5%, 3% 0%, 10% 2%, 20% 0%, 30% 1%, 40% 0%, 50% 2%, 60% 0%, 70% 1%, 80% 0%, 90% 2%, 97% 0%, 100% 5%,
    100% 20%, 98% 30%, 100% 40%, 99% 50%, 100% 60%, 98% 70%, 100% 80%, 99% 90%, 100% 95%,
    97% 100%, 90% 98%, 80% 100%, 70% 99%, 60% 100%, 50% 98%, 40% 100%, 30% 99%, 20% 100%, 10% 98%, 3% 100%, 0% 95%,
    0% 80%, 2% 70%, 0% 60%, 1% 50%, 0% 40%, 2% 30%, 0% 20%, 1% 10%
  );
}
```

- [ ] **Step 5: 更新 .btn 样式使用手绘风格**

```scss
.btn {
  padding: calc(var(--spacing-base) * 1.2) calc(var(--spacing-base) * 2.4);
  border: var(--border-medium) solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--motion-duration-normal) var(--motion-easing);
  box-shadow: var(--shadow-soft);
  font-family: var(--font-sans-primary);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px) rotate(-1deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0) rotate(0deg);
  }
  
  &.primary {
    background: var(--color-brand-primary);
    color: var(--color-bg-primary);
  }
  
  &.success {
    background: #48bb78;
    color: var(--color-bg-primary);
  }
  
  &.warning {
    background: var(--color-brand-accent);
    color: var(--color-bg-primary);
  }
  
  &.danger {
    background: #f56565;
    color: var(--color-bg-primary);
  }
  
  &.secondary {
    background: var(--color-text-muted);
    color: var(--color-bg-primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}
```

- [ ] **Step 6: 添加手绘风格动画**

```scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(-2deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

.fade-in {
  animation: fadeIn var(--motion-duration-normal) var(--motion-easing) forwards;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.wiggle {
  animation: wiggle var(--motion-duration-normal) var(--motion-easing) infinite;
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.bounce-in {
  animation: bounce-in var(--motion-duration-normal) var(--motion-easing) forwards;
}
```

---

### Task 2: 重构 App.vue 应用新风格

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 读取现有 App.vue 文件**

- [ ] **Step 2: 更新 header 样式使用新 tokens**

```scss
.header {
  text-align: center;
  margin-bottom: calc(var(--spacing-base) * 3);
  color: var(--color-bg-primary);

  .title {
    font-size: var(--font-size-h1);
    line-height: var(--font-line-h1);
    font-weight: var(--font-weight-h1);
    letter-spacing: var(--font-tracking-h1);
    margin-bottom: var(--spacing-base);
    text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    animation: wiggle 3s ease-in-out infinite;
  }

  .subtitle {
    font-size: var(--font-size-body);
    line-height: var(--font-line-body);
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 36px;
      line-height: 44px;
    }
    .subtitle {
      font-size: 16px;
    }
  }
}
```

- [ ] **Step 3: 更新 start-screen 样式**

```scss
.start-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;

  .card {
    max-width: 600px;
    width: 100%;
    text-align: center;

    h2 {
      font-size: var(--font-size-h2);
      line-height: var(--font-line-h2);
      margin-bottom: calc(var(--spacing-base) * 2);
      color: var(--color-text-primary);
    }

    .rules {
      text-align: left;
      margin-bottom: calc(var(--spacing-base) * 3);
      padding-left: calc(var(--spacing-base) * 2);

      li {
        font-size: var(--font-size-body);
        line-height: 2;
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

    .start-btn {
      font-size: 20px;
      padding: 16px 48px;
      animation: bounce-in 0.5s ease-out 0.3s both;
    }
  }
}
```

- [ ] **Step 4: 更新 game-info 样式**

```scss
.game-info {
  .info-row {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: calc(var(--spacing-base) * 2);

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .label {
        font-size: 14px;
        color: var(--color-text-muted);
        font-weight: 600;
        margin-bottom: 4px;
      }

      .value {
        font-size: 28px;
        font-weight: 700;
        color: var(--color-text-primary);

        &.time-left.danger {
          color: #f56565;
          animation: pulse 1s infinite;
        }
      }
    }
  }
}
```

- [ ] **Step 5: 更新 canvas-section 样式**

```scss
.canvas-section {
  .action-buttons {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: calc(var(--spacing-base) * 2);
  }

  .error-message {
    margin-top: 12px;
    padding: 12px;
    background: #fed7d7;
    color: #c53030;
    border-radius: var(--radius-md);
    font-size: 14px;
    border: var(--border-medium) dashed #c53030;
  }
}
```

- [ ] **Step 6: 更新 result-section 样式**

```scss
.result-section {
  .result-content {
    text-align: center;

    h2 {
      font-size: var(--font-size-h2);
      line-height: var(--font-line-h2);
      margin-bottom: calc(var(--spacing-base) * 2);
      color: var(--color-text-primary);
    }

    .ai-result {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-brand-primary);
      margin-bottom: calc(var(--spacing-base) * 3);
      padding: calc(var(--spacing-base) * 2);
      background: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      border: var(--border-medium) dashed var(--color-brand-primary);
      position: relative;
      
      &::before, &::after {
        content: '✨';
        position: absolute;
        top: 10px;
        font-size: 24px;
      }
      
      &::before { left: 20px; }
      &::after { right: 20px; }
    }
  }
}
```

---

### Task 3: 重构 DrawingCanvas.vue 应用新风格

**Files:**
- Modify: `src/components/Canvas/DrawingCanvas.vue`

- [ ] **Step 1: 读取现有 DrawingCanvas.vue 文件**

- [ ] **Step 2: 更新 .drawing-canvas 和 .canvas 样式**

```scss
.drawing-canvas {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-base) * 1.6);
}

.canvas {
  border: var(--border-strong) solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  cursor: crosshair;
  box-shadow: var(--shadow-soft);
  touch-action: none;
  position: relative;
  
  // 素描纸效果
  background-image: 
    linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
    linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
}
```

- [ ] **Step 3: 更新 .toolbar 样式**

```scss
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing-base) * 2);
  padding: calc(var(--spacing-base) * 1.6);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  align-items: center;
  border: var(--border-medium) dashed var(--color-brand-primary);

  .tool-group {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .color-picker {
      width: 44px;
      height: 44px;
      border: var(--border-medium) solid var(--color-border-strong);
      border-radius: var(--radius-sm);
      cursor: pointer;
      background: none;
      transition: transform var(--motion-duration-fast) var(--motion-easing);
      
      &:hover {
        transform: scale(1.1) rotate(5deg);
      }
    }

    .range-slider {
      width: 120px;
      cursor: pointer;
    }

    .line-width-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-secondary);
      min-width: 40px;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
}
```

---

### Task 4: 添加装饰性涂鸦元素组件

**Files:**
- Create: `src/components/DoodleDecorations.vue`

- [ ] **Step 1: 创建装饰性涂鸦组件**

```vue
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
  pointer-events: none;
  z-index: 0;
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
```

- [ ] **Step 2: 在 App.vue 中引入并使用装饰组件**

```vue
<!-- 在 template 顶部添加 -->
<DoodleDecorations />

<!-- 在 script setup 中添加导入 -->
import DoodleDecorations from './components/DoodleDecorations.vue'
```

---

### Task 5: 测试和验证

**Files:**
- Test: 运行开发服务器验证

- [ ] **Step 1: 安装依赖（如果需要）**

```bash
npm install
```

- [ ] **Step 2: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 3: 在浏览器中验证**
  - 打开 http://localhost:3000
  - 检查整体风格是否一致
  - 测试游戏流程：开始游戏 → 绘图 → 提交 → 查看结果
  - 验证响应式布局在不同屏幕尺寸下的表现
  - 确认动画效果流畅自然

- [ ] **Step 4: 构建生产版本验证**

```bash
npm run build
```
