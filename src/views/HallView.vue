<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { priorityOrder } from '../model'
import BoothView from './BoothView.vue'
import BoothToolView from './BoothToolView.vue'
import { useResizeObserver } from '@vueuse/core'
import {
  booths,
  boothsByHall,
  boothTool,
  halls,
  info,
  gamesByHallFiltered,
  toggleFroth
} from '../state'

const el = ref<HTMLImageElement>()

const props = defineProps<{
  id: string
}>()

const imageUrl = computed(() => new URL(`../resources/hall${props.id}.jpg`, import.meta.url).href)

const gamesForHall = computed(() => gamesByHallFiltered.value[props.id] ?? [])

const gameList = computed(() =>
  gamesForHall.value
    .sort((a, b) => {
      if (a.priority === b.priority) {
        return a.name.localeCompare(b.name)
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .map((x) => ({ ...x, booth: booths[x.boothId] }))
)
const factor = ref<number>(1)

useResizeObserver(el, getFactor)

onMounted(() => {
  getFactor()
})

function getFactor() {
  const parent = el.value!.getBoundingClientRect()
  factor.value = parent.width / halls[props.id].width
}
</script>

<template>
  <div class="relative flex justify-center" ref="el">
    <img :src="imageUrl" />
    <div v-if="info" class="absolute top-0 left-0 p-2 z-40">
      <ul class="bg-white rounded">
        <li
          v-for="game in gameList"
          :key="game.id"
          :class="`flex mb-2 p-1 rounded bg-${game.color} opacity-${game.frothed ? '25' : '100'}`"
        >
          <div class="grow">
            <strong>
              {{ game.name }}
            </strong>
            <br />
            <span>
              {{ game.publisher }} ({{ game.boothId }})
              <span v-html="game.price" class="mr-2"></span>
              <span v-if="!game.booth" class="text-red-500">BOOTH NOT FOUND</span>
            </span>
          </div>
          <div class="flex flex-col content-center flex-wrap">
            <div class="inline-flex items-center">Frothed?</div>
            <div class="flex justify-center">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :checked="game.frothed"
                  @change="toggleFroth(game)"
                />
                <div
                  class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <BoothToolView v-if="boothTool" :hall-id="id" :factor="factor" />
    <BoothView v-for="booth in boothsByHall[id]" :key="booth.id" :booth="booth" :factor="factor" />
  </div>
</template>
