<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDraggable, useResizeObserver } from '@vueuse/core'
import { Game } from '../model'

const el = ref<HTMLDivElement>()
const elInner = ref<HTMLDivElement>()

const props = defineProps<{
  game: Game
  anchor: { x: number; y: number } | undefined
}>()

const draggable = useDraggable(el, {
  initialValue: { x: 100, y: 100 },
  handle: elInner
})

const dimensions = ref({ width: 100, height: 100 })
const lineEnding = ref({ x: 100, y: 100 })

useResizeObserver(el, update)
watch(draggable.position, update)

const style = computed(() => {
  if (!el.value) {
    return
  }
  const parent = el.value.parentElement!.getBoundingClientRect()!
  const adjustedLeft = draggable.x.value - parent.left
  const adjustedTop = draggable.y.value - parent.top
  return {
    left: `${adjustedLeft}px`,
    top: `${adjustedTop}px`,
    width: `${dimensions.value.width}px`,
    height: `${dimensions.value.height}px`,
    backgroundImage: `url('${props.game.src}')`
  }
})

function update() {
  const { width, height, top, left, bottom, right } = el.value!.getBoundingClientRect()
  const parent = el.value!.parentElement!.getBoundingClientRect()!
  dimensions.value = { width, height }
  lineEnding.value = nearestPointOnRectangle(
    props.anchor!.x,
    props.anchor!.y,
    left + 2 - parent.left,
    top + 2 - parent.top,
    right - 2,
    bottom - 2 - parent.top
  )
}

function nearestPointOnRectangle(
  px: number,
  py: number,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number
): { x: number; y: number } {
  console.log('up', arguments)

  const nearestX = Math.max(xMin, Math.min(px, xMax))
  const nearestY = Math.max(yMin, Math.min(py, yMax))
  return { x: nearestX, y: nearestY }
}
</script>

<template>
  <svg height="100%" width="100%" class="absolute top-0 left-0 stroke-2 stroke-green-200">
    <line :x1="anchor?.x" :y1="anchor?.y" :x2="lineEnding.x" :y2="lineEnding.y" />
  </svg>
  <div
    ref="el"
    class="absolute resize overflow-auto top-0 left-0 border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat z-10 p-2"
    :style="style"
  >
    <div ref="elInner" class="h-full"></div>
  </div>
</template>
