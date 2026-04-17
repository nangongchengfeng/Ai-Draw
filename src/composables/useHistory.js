import { ref, onMounted } from 'vue'

export function useHistory() {
  const gameHistory = ref([])
  const showHistory = ref(false)

  const loadHistoryFromStorage = () => {
    try {
      const existing = localStorage.getItem('aiDrawGameHistory')
      if (existing) {
        gameHistory.value = JSON.parse(existing)
        console.log('Loaded history from storage:', gameHistory.value.length, 'records')
      }
    } catch (e) {
      console.error('Failed to load history:', e)
    }
  }

  const openHistory = () => {
    console.log('Opening history, reloading from storage')
    loadHistoryFromStorage()
    showHistory.value = true
  }

  const closeHistory = () => {
    showHistory.value = false
  }

  const clearHistory = () => {
    console.log('Clearing history')
    gameHistory.value = []
    try {
      localStorage.removeItem('aiDrawGameHistory')
    } catch (e) {
      console.error('Failed to clear history:', e)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  onMounted(() => {
    console.log('useHistory mounted, loading history')
    loadHistoryFromStorage()
  })

  return {
    gameHistory,
    showHistory,
    loadHistoryFromStorage,
    openHistory,
    closeHistory,
    clearHistory,
    formatDate
  }
}
