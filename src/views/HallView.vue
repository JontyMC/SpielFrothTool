<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { Booth, Game, Hall } from '../model'
import BoothView from './BoothView.vue'
import { useResizeObserver } from '@vueuse/core'

export type BoothData = {
  booth: Booth
  games: Game[]
  factor: Ref<number>
}

const el = ref<HTMLImageElement>()

const props = defineProps<{
  hall: Hall
  games: Game[]
}>()

const booths = ref<BoothData[]>()
const factor = ref<number>(1)

useResizeObserver(el, getFactor)

onMounted(() => {
  getFactor()
  const gamesByBooth = props.games.reduce((acc, curr) => {
    const games = acc[curr.boothId] ?? []
    games.push(curr)
    acc[curr.boothId] = games
    return acc
  }, <{ [id: string]: Game[] }>{})
  booths.value = props.hall.booths.map((booth) => ({
    booth,
    games: gamesByBooth[booth.id],
    factor
  }))
})

function getFactor() {
  const parent = el.value!.getBoundingClientRect()
  factor.value = parent.width / props.hall.width
  console.log('getFactor', factor.value)
}
</script>

<template>
  <div class="relative flex justify-center" ref="el">
    <img src="../resources/hall3.jpg" />
    <BoothView v-for="data in booths" :key="data.booth.id" :data="data" :factor="factor" />
  </div>
</template>
