<template>
  <div class="drawing-canvas">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouch(startDrawing)"
      @touchmove="handleTouch(draw)"
      @touchend="handleTouch(stopDrawing)"
      class="canvas"
    ></canvas>

    <div class="toolbar">
      <div class="tool-group">
        <label>颜色:</label>
        <input
          type="color"
          v-model="currentColor"
          class="color-picker"
        />
      </div>

      <div class="tool-group">
        <label>粗细:</label>
        <input
          type="range"
          v-model="lineWidth"
          min="1"
          max="50"
          class="range-slider"
        />
        <span class="line-width-value">{{ lineWidth }}px</span>
      </div>

      <div class="tool-group">
        <button
          class="btn secondary mini"
          @click="undo"
          :disabled="historyStack.length <= 1"
        >
          撤销
        </button>
        <button
          class="btn danger mini"
          @click="clearCanvas"
        >
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAudio } from '../../composables/useAudio'

const props = defineProps({
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['drawingChange'])

// 音频功能
const { startDrawSound, stopDrawSound } = useAudio()

const canvasRef = ref(null)
const canvasWidth = ref(props.width)
const canvasHeight = ref(props.height)
const ctx = ref(null)
const isDrawing = ref(false)
const currentColor = ref('#000000')
const lineWidth = ref(5)
const historyStack = ref([])

// 响应式调整大小
const handleResize = () => {
  if (!canvasRef.value || !canvasRef.value.parentElement) return

  const container = canvasRef.value.parentElement
  const containerWidth = container.clientWidth - 24
  let newWidth = Math.min(containerWidth, 1000)
  let newHeight = newWidth * 0.625

  // 保存当前内容
  const oldContent = historyStack.value.length > 0 ? historyStack.value[historyStack.value.length - 1] : null

  canvasWidth.value = Math.max(newWidth, 300)
  canvasHeight.value = Math.max(newHeight, 200)

  // 重新初始化
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    ctx.value.lineCap = 'round'
    ctx.value.lineJoin = 'round'

    // 重绘
    if (oldContent) {
      const img = new Image()
      img.onload = () => {
        if (ctx.value) {
          ctx.value.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value)
        }
      }
      img.src = oldContent
    } else {
      clearCanvas()
    }
  }
}

// 初始化Canvas
onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d')
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
  clearCanvas()

  window.addEventListener('resize', handleResize)
  setTimeout(handleResize, 100)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 保存当前画布状态到历史记录
const saveState = () => {
  historyStack.value.push(canvasRef.value.toDataURL())
  if (historyStack.value.length > 20) {
    historyStack.value.shift()
  }
}

// 从历史记录重绘
const redrawFromHistory = () => {
  if (historyStack.value.length === 0) return
  const img = new Image()
  img.src = historyStack.value[historyStack.value.length - 1]
  img.onload = () => {
    ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
    ctx.value.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value)
  }
}

// 撤销操作
const undo = () => {
  if (historyStack.value.length <= 1) return
  historyStack.value.pop()
  redrawFromHistory()
  emit('drawingChange', canvasRef.value.toDataURL())
}

// 清空画布
const clearCanvas = () => {
  if (!ctx.value) return
  ctx.value.fillStyle = '#ffffff'
  ctx.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value)
  historyStack.value = []
  saveState()
  emit('drawingChange', null)
}

// 获取鼠标/触摸位置 - 直接使用像素坐标
const getPointerPos = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()

  const clientX = e.clientX || (e.touches && e.touches[0].clientX)
  const clientY = e.clientY || (e.touches && e.touches[0].clientY)

  // 直接计算相对于canvas的坐标，不做缩放
  const x = clientX - rect.left
  const y = clientY - rect.top

  // 计算缩放比例
  const scaleX = canvasWidth.value / rect.width
  const scaleY = canvasHeight.value / rect.height

  return {
    x: x * scaleX,
    y: y * scaleY
  }
}

// 开始绘图
const startDrawing = (e) => {
  isDrawing.value = true
  ctx.value.strokeStyle = currentColor.value
  ctx.value.lineWidth = lineWidth.value
  const { x, y } = getPointerPos(e)
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
  startDrawSound() // 开始绘画音效
}

// 绘图中
const draw = (e) => {
  if (!isDrawing.value) return
  e.preventDefault()
  const { x, y } = getPointerPos(e)
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
  emit('drawingChange', canvasRef.value.toDataURL())
}

// 停止绘图
const stopDrawing = () => {
  if (!isDrawing.value) return
  isDrawing.value = false
  saveState()
  stopDrawSound() // 停止绘画音效
}

// 处理触摸事件
const handleTouch = (fn) => {
  return (e) => {
    e.preventDefault()
    fn(e)
  }
}

// 暴露给父组件的方法
defineExpose({
  getCanvasData: () => canvasRef.value?.toDataURL('image/png'),
  clearCanvas
})
</script>

<style scoped lang="scss">
.drawing-canvas {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.canvas {
  border: var(--border-strong) solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  cursor: crosshair;
  box-shadow: var(--shadow-soft);
  touch-action: none;
  display: block;
  width: 100% !important;
  height: auto !important;

  // 素描纸效果
  background-image:
    linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
    linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  align-items: center;
  border: var(--border-medium) dashed var(--color-brand-primary);
  flex-shrink: 0;

  .tool-group {
    display: flex;
    align-items: center;
    gap: 6px;

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .color-picker {
      width: 36px;
      height: 36px;
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
      width: 100px;
      cursor: pointer;
    }

    .line-width-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-secondary);
      min-width: 36px;
    }

    .btn.mini {
      padding: 6px 14px;
      font-size: 13px;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
}
</style>
