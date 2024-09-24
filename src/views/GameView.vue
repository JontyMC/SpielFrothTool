<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDraggable, useElementSize } from '@vueuse/core'
import { Game } from '../model'

const el = ref<HTMLDivElement>()
const elInner = ref<HTMLDivElement>()

const props = defineProps<{
  game: Game
  anchor: HTMLDivElement | undefined
}>()

const {
  x,
  y,
  style: draggableStyle
} = useDraggable(el, {
  initialValue: { x: 100, y: 100 },
  handle: elInner
})
const { width: ew, height: eh } = useElementSize(el, { width: 100, height: 100 })

const width = ref(100)
const height = ref(100)

onMounted(() => {
  el.value.style.width = '100px'
  el.value.style.height = '100px'
})

const style = computed(() => {
  return `${draggableStyle.value}background-image: url('${props.game.src}')`
})
</script>

<template>
  <svg height="100%" width="100%" class="absolute top-0 left-0 stroke-2 stroke-green-200">
    <line :x1="x" :y1="y" x2="500" y2="350" />
  </svg>
  <div
    ref="el"
    class="absolute resize overflow-auto top-0 left-0 border-4 rounded bg-green-200 border-green-200 bg-contain bg-center bg-no-repeat z-10 p-2"
    :style="style"
  >
    <div ref="elInner" class="h-full"></div>
  </div>
</template>
