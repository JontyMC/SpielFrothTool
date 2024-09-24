<script setup lang="ts">
import { ref, computed } from 'vue'
import GameView from './GameView.vue'
import { Game } from '../model'

const anchor = ref<HTMLDivElement>()

const games: Game[] = [
  {
    id: '1',
    boothId: '3A112',
    src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg'
  },
  { id: '2', boothId: '3A113', src: 'https://tabletoptogether.com/tool/game_images/29/17537_1.jpg' }
]
</script>

<template>
  <h1 ref="anchor">About</h1>
  <GameView v-for="game of games" :game="game" :anchor="anchor" />
</template>
