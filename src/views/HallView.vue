<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Game, Hall, priorityOrder } from '../model'
import BoothView from './BoothView.vue'
import BoothToolView from './BoothToolView.vue'
import { useResizeObserver } from '@vueuse/core'
import { booths, boothsByHall, boothTool, likes, needs, wants } from '../state'

const el = ref<HTMLImageElement>()

const props = defineProps<{
  hall: Hall
  games: Game[]
}>()

const filteredGames = computed(() =>
  props.games.filter(
    (x) =>
      (needs.value || x.priority !== 'need') &&
      (wants.value || x.priority !== 'want') &&
      (likes.value || x.priority !== 'like')
  )
)

const gamesByBooth = computed(() =>
  filteredGames.value.reduce((acc, curr) => {
    const games = acc[curr.boothId] ?? []
    games.push(curr)
    acc[curr.boothId] = games
    return acc
  }, <{ [id: string]: Game[] }>{})
)
const gameList = computed(() =>
  filteredGames.value
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
  factor.value = parent.width / props.hall.width
}
</script>

<template>
  <div class="relative flex justify-center" ref="el">
    <img src="../resources/hall3.jpg" />
    <div class="absolute top-0 left-0 p-2">
      <ul>
        <li v-for="game in gameList" :class="`mb-2 p-1 bg-${game.color}`">
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
    <BoothToolView v-if="boothTool" :hall-id="hall.id" :factor="factor" />
    <BoothView
      v-for="booth in boothsByHall[hall.id]"
      :key="booth.id"
      :booth="booth"
      :games="gamesByBooth[booth.id] ?? []"
      :factor="factor"
    />
  </div>
</template>
