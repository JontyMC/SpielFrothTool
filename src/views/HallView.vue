<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Game, priorityOrder } from '../model'
import BoothView from './BoothView.vue'
import BoothToolView from './BoothToolView.vue'
import { useResizeObserver } from '@vueuse/core'
import { booths, boothsByHall, boothTool, halls, info, gamesByHallFiltered } from '../state'

const el = ref<HTMLImageElement>()

const props = defineProps<{
  id: string
}>()

const imageUrl = computed(() => new URL(`../resources/hall${props.id}.jpg`, import.meta.url).href)

const gamesForHall = computed(() => gamesByHallFiltered.value[props.id] ?? [])

const gamesByBooth = computed(() =>
  gamesForHall.value.reduce((acc, curr) => {
    const games = acc[curr.boothId] ?? []
    games.push(curr)
    acc[curr.boothId] = games
    return acc
  }, <{ [id: string]: Game[] }>{})
)
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
        <li v-for="game in gameList" :key="game.id" :class="`mb-2 p-1 rounded bg-${game.color}`">
          <strong>
            {{ game.name }}
          </strong>
          <br />
          <span>
            {{ game.publisher }} ({{ game.boothId }})
            <span v-html="game.price" class="mr-2"></span>
            <span v-if="!game.booth" class="text-red-500">BOOTH NOT FOUND</span>
          </span>
        </li>
      </ul>
    </div>
    <BoothToolView v-if="boothTool" :hall-id="id" :factor="factor" />
    <BoothView
      v-for="booth in boothsByHall[id]"
      :key="booth.id"
      :booth="booth"
      :games="gamesByBooth[booth.id] ?? []"
      :factor="factor"
    />
  </div>
</template>
