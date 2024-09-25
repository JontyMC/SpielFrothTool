<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Game } from '../model'

const props = defineProps<{
  game: Game
  anchor: { x: number; y: number }
  factor: number
}>()

const dimensions = ref({ x: 100, y: 100, width: 100, height: 100 })
const factoredDimensions = computed(() => ({
  x: dimensions.value.x * props.factor,
  y: dimensions.value.y * props.factor,
  width: dimensions.value.width * props.factor,
  height: dimensions.value.height * props.factor
}))

onMounted(() => {
  const x = props.anchor.x / props.factor + 80
  const y = props.anchor.y / props.factor - 150
  dimensions.value = { x, y, width: 120, height: 120 }
})

function drag(x: number, y: number) {
  const { width, height } = dimensions.value
  dimensions.value = { x: x / props.factor, y: y / props.factor, width, height }
}

function resize(handle: string, x: number, y: number, width: number, height: number) {
  dimensions.value = {
    x: x / props.factor,
    y: y / props.factor,
    width: width / props.factor,
    height: height / props.factor
  }
}
const lineEnding = computed(() => {
  const { x, y, width, height } = factoredDimensions.value
  const nearestX = Math.max(x + 2, Math.min(props.anchor.x, x + width) - 2)
  const nearestY = Math.max(y + 2, Math.min(props.anchor.y, y + height) - 2)
  return { x: nearestX, y: nearestY }
})
const style = computed(() => ({ backgroundImage: `url('${props.game.src}')`, zIndex: 10 }))
</script>

<template>
  <svg height="100%" width="100%" class="absolute top-0 left-0 stroke-green-200">
    <line :x1="anchor.x" :y1="anchor.y" :x2="lineEnding.x" :y2="lineEnding.y" stroke-width="4" />
  </svg>
  <vue-draggable-resizable
    @drag="drag"
    @resize="resize"
    :x="factoredDimensions.x"
    :y="factoredDimensions.y"
    :w="factoredDimensions.width"
    :h="factoredDimensions.height"
    class-name="absolute border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat p-2"
    :style="style"
  ></vue-draggable-resizable>
</template>
