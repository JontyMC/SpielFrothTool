<script setup lang="ts">
import { computed, ref } from 'vue'
import { Game, Hall } from '../model'
import { useResizeObserver } from '@vueuse/core'
import BoothView from './BoothView.vue'

const el = ref<HTMLImageElement>()

const props = defineProps<{
  hall: Hall
  games: Game[]
}>()

const factor = ref(1)
const gamesByBooth = computed(() =>
  props.games.reduce((acc, curr) => {
    const games = acc[curr.boothId] ?? []
    games.push(curr)
    acc[curr.boothId] = games
    return acc
  }, <{ [id: string]: Game[] }>{})
)

useResizeObserver(el, () => {
  const parent = el.value!.getBoundingClientRect()
  factor.value = parent.width / props.hall.width
})
</script>

<template>
  <div class="relative" ref="el">
    <img src="../resources/hall3.jpg" />
    <BoothView
      v-for="booth in hall.booths"
      :key="booth.id"
      :booth="booth"
      :games="gamesByBooth[booth.id]"
      :hall-factor="factor"
    />
  </div>
</template>
