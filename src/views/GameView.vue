<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Game, Position } from '../model'
import { imagePrefix, getDefaultSize, editingEnabled } from '../state'

const props = defineProps<{
  game: Game
  anchor: { x: number; y: number }
  factor: number
}>()

const position = ref<Position>({ x: 100, y: 100, width: 100, height: 100 })
const factoredPosition = computed(() => ({
  x: position.value!.x * props.factor,
  y: position.value!.y * props.factor,
  width: position.value!.width * props.factor,
  height: position.value!.height * props.factor
}))

watch(
  props,
  (value) => {
    const game = value.game
    if (
      game.position &&
      (game.position.x !== position.value.x ||
        game.position.y !== position.value.y ||
        game.position.width !== position.value.width ||
        game.position.height !== position.value.height)
    ) {
      position.value = game.position
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (!props.game.srcInit) {
    props.game.srcInit = true
    const img = new Image()
    img.src = imagePrefix + props.game.src

    img.onload = () => {
      const defaultWidth = getDefaultSize(props.game) * props.factor
      const ratio = img.naturalWidth / img.naturalHeight
      const width = ratio <= 1 ? defaultWidth * ratio : defaultWidth
      const height = ratio >= 1 ? defaultWidth * ratio : defaultWidth
      const { x, y } = factoredPosition.value
      setPosition(x, y, width, height)
    }
  }
})

function setPosition(x: number, y: number, width: number, height: number) {
  x = x / props.factor
  y = y / props.factor
  width = width / props.factor
  height = height / props.factor
  const newPosition = { x, y, width, height }
  position.value = newPosition
  props.game.position = newPosition
}

function drag(x: number, y: number) {
  const { width, height } = factoredPosition.value
  setPosition(x, y, width, height)
}

function resize(handle: string, x: number, y: number, width: number, height: number) {
  setPosition(x, y, width, height)
}

const lineEnding = computed(() => {
  const { x, y, width, height } = factoredPosition.value
  const nearestX = Math.max(x + 2, Math.min(props.anchor.x, x + width) - 2)
  const nearestY = Math.max(y + 2, Math.min(props.anchor.y, y + height) - 2)
  return { x: nearestX, y: nearestY }
})

const style = computed(() => ({
  backgroundImage: `url('${imagePrefix}${props.game.src}')`,
  zIndex: 10
}))
</script>

<template>
  <svg height="100%" width="100%" :class="`absolute stroke-${game.color}`">
    <line :x1="anchor.x" :y1="anchor.y" :x2="lineEnding.x" :y2="lineEnding.y" stroke-width="4" />
  </svg>
  <vue-draggable-resizable
    :draggable="editingEnabled"
    :resizable="editingEnabled"
    @drag="drag"
    @resize="resize"
    :x="factoredPosition.x"
    :y="factoredPosition.y"
    :w="factoredPosition.width"
    :h="factoredPosition.height"
    :class-name="`absolute border-${factor < 0.5 ? 2 : 4} rounded bg-${game.color} border-${
      game.color
    } bg-cover bg-center bg-no-repeat p-2`"
    :style="style"
  ></vue-draggable-resizable>
</template>
