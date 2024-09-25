<script setup lang="ts">
import { Game, Hall } from '../model'
import HallView from './HallView.vue'

const hall3: Hall = {
  width: 3509,
  height: 4023,
  booths: [{ id: '3Z411', name: '??', top: 287, left: 1875, bottom: 596, right: 2134 }]
}

const games: Game[] = [
  {
    id: '1',
    boothId: '3Z411',
    src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg'
  },
  {
    id: '2',
    boothId: '3Z411',
    src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg'
  }
]
</script>

<template>
  <hall-view :hall="hall3" :games="games" />
</template>
