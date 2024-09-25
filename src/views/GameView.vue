<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Game, Position } from '../model'
import { saveGame } from '../state'

const props = defineProps<{
  game: Game
  anchor: { x: number; y: number }
  factor: number
}>()

const position = ref<Position>({ x: 100, y: 100, width: 100, height: 100 })
const factoredDimensions = computed(() => ({
  x: position.value.x * props.factor,
  y: position.value.y * props.factor,
  width: position.value.width * props.factor,
  height: position.value.height * props.factor
}))

onMounted(() => {
  const init = props.game.position
  const x = (init?.x ?? props.anchor.x + 80) / props.factor
  const y = (init?.y ?? props.anchor.y - 150) / props.factor
  const width = (init?.width ?? 150) / props.factor
  const height = (init?.height ?? 150) / props.factor
  position.value = { x, y, width, height }
})

watch(position, () => saveGame({ ...props.game, position: position.value }))

function drag(x: number, y: number) {
  const { width, height } = position.value
  position.value = { x: x / props.factor, y: y / props.factor, width, height }
}

function resize(handle: string, x: number, y: number, width: number, height: number) {
  position.value = {
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

const style = computed(() => ({
  backgroundImage: `url('https://tabletoptogether.com/tool/${props.game.src}')`,
  zIndex: 10
}))
</script>

<template>
  <svg height="100%" width="100%" :class="`absolute top-0 left-0 stroke-${game.color}`">
    <line :x1="anchor.x" :y1="anchor.y" :x2="lineEnding.x" :y2="lineEnding.y" stroke-width="4" />
  </svg>
  <vue-draggable-resizable
    @drag="drag"
    @resize="resize"
    :x="factoredDimensions.x"
    :y="factoredDimensions.y"
    :w="factoredDimensions.width"
    :h="factoredDimensions.height"
    :class-name="`absolute border-4 rounded bg-${game.color} border-${game.color} bg-cover bg-center bg-no-repeat p-2`"
    :style="style"
  ></vue-draggable-resizable>
</template>
