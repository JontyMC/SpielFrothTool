<script setup lang="ts">
import { ref } from 'vue'
import GameView from './GameView.vue'
import { useResizeObserver } from '@vueuse/core'

const anchor = ref<HTMLDivElement>()
const anchorCentre = ref<{ x: number; y: number }>()

useResizeObserver(anchor, () => {
  const { x, y, width, height } = anchor.value!.getBoundingClientRect()
  anchorCentre.value = { x: x + width / 2, y: y + height / 2 }
})

const hall3: Hall = {
  width: 3509,
  height: 4963,
  booths: [
    { id: '3A112', name: '??', top: 3812, left: 1260, bottom: 4030, right: 1422 },
    { id: '3A113', name: '??', top: 3612, left: 1060, bottom: 3830, right: 1222 }
  ],
  games: [
    {
      id: '1',
      boothId: '3A112',
      src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg'
    },
    {
      id: '2',
      boothId: '3A113',
      src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg'
    }
  ]
}
</script>

<template>
  <h1 class="absolute" ref="anchor">About</h1>
  <GameView v-for="game of games" :game="game" :anchor="anchorCentre" />
</template>
