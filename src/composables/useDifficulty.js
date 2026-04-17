import { ref } from 'vue'

export const DIFFICULTIES = {
  easy: { name: '简单', rounds: 3, drawTime: 90, icon: '😊' },
  normal: { name: '中等', rounds: 5, drawTime: 60, icon: '😐' },
  hard: { name: '困难', rounds: 8, drawTime: 30, icon: '😤' }
}

export function useDifficulty(setMaxRounds, setDrawTime, playClickSound) {
  const selectedDifficulty = ref('normal')

  const selectDifficulty = (diff) => {
    playClickSound?.()
    selectedDifficulty.value = diff
    const config = DIFFICULTIES[diff]
    console.log('Setting difficulty:', config)
    setMaxRounds?.(config.rounds)
    setDrawTime?.(config.drawTime)
  }

  return {
    selectedDifficulty,
    DIFFICULTIES,
    selectDifficulty
  }
}
