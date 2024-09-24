<script setup lang="ts">
import { ref } from 'vue'
import { Hall } from '../model'
import { useResizeObserver } from '@vueuse/core'

const hallImageEl = ref<HTMLImageElement>()
const boothEls = ref<HTMLDivElement[]>()

const props = defineProps<{
  hall: Hall
}>()

useResizeObserver(hallImageEl, () => {
  const parent = hallImageEl.value!.getBoundingClientRect()
  const factor = parent.width / props.hall.width
  console.log('useResizeObserver', factor, parent)
  if (!boothEls.value) {
    return
  }
  const factoredBooths = props.hall.booths.map(({ id, top, left, bottom, right }) => {
    const width = (right - left) * factor
    const height = (bottom - top) * factor
    top = top * factor
    left = left * factor
    bottom = bottom * factor
    right = right * factor
    return { id, width, height, top, left, bottom, right }
  })
  boothEls.value?.map((el, index) => {
    const { id, width, height, top, left, bottom, right } = factoredBooths[index]
    console.log('boothEls', id, width, height, top, left, bottom, right, parent.top)
    Object.assign(el.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    })
  })
})
</script>

<template>
  <div class="relative" ref="hallImageEl">
    <img src="../resources/hall3.jpg" />
    <div
      ref="boothEls"
      v-for="booth in hall.booths"
      :key="booth.id"
      class="absolute border-2 border-red-600"
    >
      <GameView v-for="game of booth.games" :game="game" :anchor="anchorCentre" />
    </div>
  </div>
</template>
