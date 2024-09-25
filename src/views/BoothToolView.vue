<script setup lang="ts">
import { Position, useMouse, useMousePressed } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

const el = ref<HTMLCanvasElement>()

const props = defineProps<{
  hallId: string
  factor: number
}>()

const { pressed } = useMousePressed({ target: el })
const { x, y } = useMouse({ target: el })
const currentPosition = computed(() => ({ x: x.value, y: y.value }))
const startPosition = ref<Position>()
const offset = computed(() => el.value?.getBoundingClientRect().top)

watch(pressed, (value) => {
  if (value) {
    startPosition.value = currentPosition.value
  } else {
    const factor = props.factor
    let { x, y, width, height } = getBounds()
    x = Math.round(x / factor)
    y = Math.round(y / factor)
    width = Math.round(width / factor)
    height = Math.round(height / factor)
    console.log(
      'pressed',
      `{ id: '${props.hallId}-', hallId: '${props.hallId}', x: ${x}, y: ${y}, height: ${height}, width: ${width} }`
    )
  }
})

watch(currentPosition, (position) => {
  if (pressed.value) {
    const canvas = el.value!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const { x, y, width, height } = getBounds()
    ctx.strokeRect(x, y, width, height)
  }
})

function getBounds() {
  const { x, y } = startPosition.value!
  const width = currentPosition.value.x - x
  const height = currentPosition.value.y - y
  return { x, y: y - offset.value!, width, height }
}

onMounted(() => {
  const canvas = el.value!
  const ctx = canvas.getContext('2d')!
  const canvasWidth = canvas.clientWidth
  const canvasHeight = canvas.clientHeight
  console.log('canvas', canvasWidth, canvasHeight)
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.strokeStyle = 'blue'
})
</script>

<template>
  <canvas
    ref="el"
    class="absolute top-0 left-0 w-full h-full z-50 border-4 border-fuchsia-500"
  ></canvas>
</template>
