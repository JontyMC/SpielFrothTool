<script setup lang="ts">
import { computed, ref } from 'vue'
import { Booth, Game } from '../model'
import GameView from './GameView.vue'

const el = ref<HTMLDivElement[]>()

const props = defineProps<{
  booth: Booth
  games: Game[]
  hallFactor: number
}>()

const factoredBooth = computed(() => {
  let { top, left, bottom, right } = props.booth
  const width = (right - left) * props.hallFactor
  const height = (bottom - top) * props.hallFactor
  top = top * props.hallFactor
  left = left * props.hallFactor
  bottom = bottom * props.hallFactor
  right = right * props.hallFactor
  const centre = { x: left + width / 2, y: top + height / 2 }
  return { width, height, top, left, centre }
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
  <div ref="el" class="absolute border-2 border-red-600" :style="style"></div>
  <GameView v-for="game of games" :game="game" :anchor="factoredBooth.centre" />
</template>
