<script setup lang="ts">
import { computed, ref } from 'vue'
import GameView from './GameView.vue'
import { BoothData } from './HallView.vue'

const el = ref<HTMLDivElement[]>()

const props = defineProps<{
  data: BoothData
  factor: number
}>()

const factoredBooth = computed(() => {
  const factor = props.factor
  let { top, left, bottom, right } = props.data.booth
  const width = (right - left) * factor
  const height = (bottom - top) * factor
  top = top * factor
  left = left * factor
  bottom = bottom * factor
  right = right * factor
  console.log('factoredBooth', factor)
  return {
    width,
    height,
    top,
    left,
    x: left + width / 2,
    y: top + height / 2
  }
})

const style = computed(() => {
  const { width, height, top, left } = factoredBooth.value
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  }
})
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full">
    <div ref="el" class="absolute border-2 border-red-600" :style="style"></div>
    <GameView v-for="game of data.games" :game="game" :anchor="factoredBooth" :factor="factor" />
  </div>
</template>
