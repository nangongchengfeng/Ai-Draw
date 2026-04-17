<template>
  <div class="canvas-section">
    <DrawingCanvas
      ref="canvasRef"
      @drawingChange="onDrawingChange"
    />

    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>

    <div class="action-buttons">
      <button
        class="btn danger"
        @click="handleClearCanvas"
      >
        清空画布
      </button>
      <button
        class="btn primary submit-btn"
        @click="submitDrawing"
        :disabled="isRecognizing || !hasDrawing || isResult"
      >
        {{ isRecognizing ? 'AI正在思考中...' : '提交作品' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DrawingCanvas from '../Canvas/DrawingCanvas.vue'

const props = defineProps({
  error: String,
  isRecognizing: Boolean,
  isResult: Boolean,
  hasDrawing: Boolean
})

const emit = defineEmits(['clearCanvas', 'submitDrawing', 'drawingChange'])

const canvasRef = ref(null)

const handleClearCanvas = () => {
  canvasRef.value?.clearCanvas()
}

const submitDrawing = () => {
  const canvasData = canvasRef.value?.getCanvasData()
  emit('submitDrawing', canvasData)
}

const onDrawingChange = (data) => {
  emit('drawingChange', data)
}

defineExpose({
  clearCanvas: () => canvasRef.value?.clearCanvas()
})
</script>

<style scoped lang="scss">
.canvas-section {
  position: relative;
  z-index: 20;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: var(--border-medium) solid var(--color-border-strong);
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    position: relative;
    z-index: 30;
    flex-shrink: 0;

    .btn {
      flex: 1;
    }

    .submit-btn {
      flex: 2;
    }
  }

  .error-message {
    margin-top: 12px;
    padding: 10px;
    background: #fed7d7;
    color: #c53030;
    border-radius: var(--radius-md);
    font-size: 13px;
    border: var(--border-medium) dashed #c53030;
    flex-shrink: 0;
  }
}
</style>
