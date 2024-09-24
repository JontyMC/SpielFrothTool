<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useFloating, flip, shift, arrow, autoPlacement } from '@floating-ui/vue'
import { useResizeObserver } from '@vueuse/core'

export type Dimensions = {
  top: number
  left: number
  bottom: number
  right: number
}

export type Booth = {
  id: string
  name: string
  dimensions: Dimensions
}

export type HallData = {
  width: number
  height: number
  booths: Booth[]
}

const hallImage = ref<HTMLImageElement>()
const hallImageDimensions = ref<Dimensions>()

const props = defineProps<{
  data: HallData
}>()

useResizeObserver(hallImage, (entries) => {
  const entry = entries[0]
  const { top, left, bottom, right } = entry.contentRect
  hallImageDimensions.value = { top, left, bottom, right }
})

const virtualEl = {
  getBoundingClientRect() {
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
const reference = ref(virtualEl)
const floating = ref(null)
const { floatingStyles } = useFloating(reference, floating, {
  middleware: [autoPlacement(), shift(), flip()]
})
const tooltipStyles = computed(() => ({ ...floatingStyles.value, width: '100px', height: '100px' }))
</script>

<template>
  <div ref="hallImage">
    <img src="../resources/hall3.jpg" />
  </div>
  <div
    ref="floating"
    class="border-4 rounded bg-green-200 border-green-200 bg-cover bg-center bg-no-repeat"
    :style="tooltipStyles"
  >
    <img src="https://tabletoptogether.com/tool/game_images/29/17537_1.jpg" />
  </div>
</template>

<style>
#container {
  width: 100px; /*or 70%, or what you want*/
  height: 200px; /*or 70%, or what you want*/
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
