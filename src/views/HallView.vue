<script setup lang="ts">
import { ref, computed, Ref, watch } from 'vue'
import {
  useFloating,
  flip,
  shift,
  arrow,
  autoPlacement,
  VirtualElement,
  ClientRectObject,
  MaybeElement,
  computePosition
} from '@floating-ui/vue'
import { useResizeObserver } from '@vueuse/core'

export type Dimensions = {
  top: number
  left: number
  bottom: number
  right: number
}

export type Booth = Dimensions & {
  id: string
  name: string
}

export type Hall = {
  width: number
  height: number
  booths: Booth[]
}

export type Game = {
  id: string
  boothId: string
  src: string
}

const hallImageEl = ref<HTMLImageElement>()
const hallImageDimensions = ref<Dimensions>()
const tooltipEls = ref<HTMLDivElement[]>()

const props = defineProps<{
  hall: Hall
  games: Game[]
}>()

useResizeObserver(hallImageEl, (entries) => {
  const entry = entries[0]
  const { top, left, bottom, right } = entry.contentRect
  hallImageDimensions.value = { top, left, bottom, right }
})

const virtualBooths = computed(() =>
  props.hall.booths.reduce((acc, curr) => {
    const booth = {
      getBoundingClientRect(): ClientRectObject {
        return {
          x: 200,
          y: 200,
          top: 200,
          left: 500,
          bottom: 20,
          right: 20,
          width: 20,
          height: 20
        }
      }
    }
    acc[curr.id] = booth
    return acc
  }, <{ [id: string]: VirtualElement }>{})
)

watch(tooltipEls, (els) => {
  if (!els) {
    return
  }
  els.forEach(async (el, index) => {
    const tooltipEl = els[index]
    const { id, src, boothId } = props.games[index]
    const booth = virtualBooths.value[boothId]

    const { x, y } = await computePosition(booth, tooltipEl, {
      middleware: [autoPlacement()]
    })
    Object.assign(tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`
    })
  })
})

// const tooltips = computed(() => {
//   if (!tooltipEls.value) {
//     return []
//   }
//   props.games.map(({ id, src, boothId }) => {
//     const booth = virtualBooths.value[id]
//     const { floatingStyles } = useFloating(booth, floating, {
//       middleware: [autoPlacement(), shift(), flip()]
//     })
//     const tooltipStyles = computed(() => ({
//       ...floatingStyles.value,
//       width: '100px',
//       height: '100px'
//     }))
//     return { key: id, src }
//   })
// })
// const tooltips = computed(() => {
//   if (!tooltipEls.value) {
//     return []
//   }
//   props.games.map(({ id, src, boothId }) => {
//     const booth = virtualBooths.value[id]
//     const { floatingStyles } = useFloating(booth, floating, {
//       middleware: [autoPlacement(), shift(), flip()]
//     })
//     const tooltipStyles = computed(() => ({
//       ...floatingStyles.value,
//       width: '100px',
//       height: '100px'
//     }))
//     return { key: id, src }
//   })
// })

//  tooltips.value.forEach((tooltip, index) => {
//     const tooltipEl = tooltipRefs.value[index];

//     // Create a virtual element based on the coordinates from the tooltip object
//     const virtualElement = createVirtualElement(tooltip);

//     // Use Floating UI to position the tooltip
//     computePosition(virtualElement, tooltipEl, {
//       middleware: [flip(), shift()],
//     }).then(({ x, y }) => {
//       Object.assign(tooltipEl.style, {
//         position: 'absolute',
//         left: `${x}px`,
//         top: `${y}px`,
//       });
//     });
//   });
</script>

<template>
  <div ref="hallImageEl">
    <img src="../resources/hall3.jpg" />
  </div>
  <div
    ref="tooltipEls"
    v-for="game in props.games"
    :key="game.id"
    class="absolute top-0 left-0 border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat"
    style="width: 100px; height: 100px"
  >
    <img :src="game.src" />
  </div>
</template>
