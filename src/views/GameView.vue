<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import { Game } from '../model'

const el = ref<HTMLDivElement>()

const props = defineProps<{
  game: Game
  anchor: HTMLDivElement | undefined
}>()

const {
  x,
  y,
  style: draggableStyle
} = useDraggable(el, {
  initialValue: { x: 40, y: 40 }
})

const style = computed(
  () =>
    `${draggableStyle.value}width: 100px; height: 101px; background-image: url('${props.game.src}')`
)
</script>

<template>
  <svg height="100%" width="100%" class="absolute top-0 left-0 stroke-2 stroke-green-200">
    <line :x1="x" :y1="y" x2="500" y2="350" />
  </svg>
  <div
    ref="el"
    class="absolute top-0 left-0 border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat z-10"
    :style="style"
  ></div>
</template>
