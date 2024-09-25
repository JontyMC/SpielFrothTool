<script setup lang="ts">
import { computed, ref } from 'vue'
import GameView from './GameView.vue'
import { Booth, Game } from '../model'
import { boothTool } from '../state'

const el = ref<HTMLDivElement[]>()

const props = defineProps<{
  booth: Booth
  games: Game[]
  factor: number
}>()

const factoredBooth = computed(() => {
  const factor = props.factor
  let { x, y, width, height } = props.booth
  width = width * factor
  height = height * factor
  x = x * factor
  y = y * factor
  return {
    width,
    height,
    x,
    y,
    center: {
      x: x + width / 2,
      y: y + height / 2
    }
  }
})

const style = computed(() => {
  const { width, height, x, y } = factoredBooth.value
  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`
  }
})
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full">
    <div v-if="boothTool" ref="el" class="absolute border-2 border-red-600" :style="style"></div>
    <GameView v-for="game of games" :game="game" :anchor="factoredBooth.center" :factor="factor" />
  </div>
</template>
