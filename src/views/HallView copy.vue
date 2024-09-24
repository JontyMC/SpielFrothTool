<script setup lang="ts">
import { ref, computed, Ref, watch, onMounted } from 'vue'
import {
  useFloating,
  flip,
  shift,
  arrow,
  autoPlacement,
  VirtualElement,
  ClientRectObject,
  MaybeElement,
  computePosition,
  detectOverflow
} from '@floating-ui/vue'
import { useResizeObserver } from '@vueuse/core'
import { useDraggable } from '@vueuse/core'

const hallImageEl = ref<HTMLImageElement>()
const tooltipEls = ref<HTMLDivElement[]>()
const boothEls = ref<HTMLDivElement[]>()

const props = defineProps<{
  hall: Hall
  games: Game[]
}>()

useResizeObserver(hallImageEl, () => {
  const parent = hallImageEl.value!.getBoundingClientRect()
  const factor = parent.width / props.hall.width
  console.log('useResizeObserver', factor, parent)
  if (!boothEls.value || !tooltipEls.value) {
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
  const virtualBooths = factoredBooths.reduce(
    (acc, { id, width, height, top, left, bottom, right }) => {
      const booth = {
        getBoundingClientRect(): ClientRectObject {
          return {
            x: left,
            y: top,
            top,
            left,
            bottom,
            right,
            width,
            height
          }
        }
      }
      acc[id] = booth
      return acc
    },
    <{ [id: string]: VirtualElement }>{}
  )

  tooltipEls.value.forEach(async (tooltipEl, index) => {
    const { id, src, boothId } = props.games[index]
    const booth = virtualBooths[boothId]
    const { x, y } = await computePosition(booth, tooltipEl, {
      middleware: [autoPlacement(), middleware]
    })
    const { style } = useDraggable(tooltipEl)

    Object.assign(tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`
    })
  })

  boothEls.value?.map((el, index) => {
    const { id, width, height, top, left, bottom, right } = factoredBooths[index]
    Object.assign(el.style, {
      left: `${left}px`,
      top: `${top + parent.top}px`,
      width: `${width}px`,
      height: `${height}px`
    })
  })
})

const middleware = {
  name: 'middleware',
  async fn(state) {
    const overflow = await detectOverflow(state, { boundary: tooltipEls.value })
    console.log(overflow)
    return {}
  }
}

const test = ref<HTMLDivElement>()

const { x, y, style } = useDraggable(test, {
  initialValue: { x: 40, y: 40 }
})
</script>

<template>
  <div ref="hallImageEl">
    <img src="../resources/hall3.jpg" />
  </div>
  <div
    ref="test"
    :style="style"
    class="bg-red-400"
    style="width: 100px; height: 100px; position: fixed"
  ></div>
  <div
    ref="tooltipEls"
    v-for="game in props.games"
    :key="game.id"
    class="absolute top-0 left-0 border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat"
    style="width: 100px; height: 100px"
  >
    <img :src="game.src" />
  </div>
  <div
    ref="boothEls"
    v-for="booth in props.hall.booths"
    :key="booth.id"
    class="absolute border-2 border-red-600"
  ></div>
</template>
