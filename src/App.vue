<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, WrenchIcon, PrinterIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, watch } from 'vue'
import {
  booths,
  boothTool,
  gamesByHallFiltered,
  halls,
  info,
  likes,
  loadGames,
  needs,
  resetGames,
  saveGames,
  userId,
  wants,
  editingEnabled,
  filteredGames
} from './state'
import { useRoute } from 'vue-router'
import router from './router'

const navigation = computed(() =>
  Object.values(halls)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((x) => ({
      name: 'Hall ' + x.id,
      id: x.id,
      count: gamesByHallFiltered.value[x.id]?.length
    }))
)

onMounted(() => {
  if (window.innerWidth > 1200 && !localStorage.getItem('info')) {
    info.value = true
  }
  const urlParams = new URLSearchParams(window.location.search)
  const u = urlParams.get('u')
  if (u) {
    userId.value = u
  }
  loadGames(true)
})

const route = useRoute()
const totalCount = computed(() => filteredGames.value.length)

watch(userId, (value) => {
  router.push({ ...route, query: { u: value } })
})

function print() {
  window.open(
    'https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en',
    '_blank'
  )
}

function toggleBoothTool() {
  boothTool.value = !boothTool.value
}

function getUnknownBooths() {
  const txt = Array.from(
    new Set(
      (gamesByHallFiltered.value[route.params.id as string] ?? [])
        .filter((x) => !booths[x.boothId])
        .map((x) => x.boothId)
        .sort((a, b) => a.localeCompare(b))
    )
  ).join('\n//')
  navigator.clipboard.writeText('//' + txt)
}

function nav(id: string) {
  router.push({ name: 'hall', params: { id: id ?? '3' }, query: { u: userId.value } })
}
</script>

<template>
  <Disclosure as="nav" class="print:hidden bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="https://www.spiel-essen.de/templates/yootheme/cache/b6/Logo_Spiel_Essen_hellesGrau-b6f0b14a.webp"
              alt="Your Company"
            />
            <span
              v-if="totalCount > 0"
              class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full"
            >
              {{ totalCount }}
            </span>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="{ name: 'hall', params: { id: item.id ?? '3' }, query: { u: userId } }"
                class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                activeClass="bg-gray-900 text-white"
              >
                {{ item.name }}
                <span
                  v-if="item.count > 0"
                  class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full"
                >
                  {{ item.count }}
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <button
            type="button"
            class="mr-1 relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            @click="print()"
          >
            <span class="absolute -inset-1.5" />
            <PrinterIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="mr-1 relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            @click="toggleBoothTool()"
          >
            <span class="absolute -inset-1.5" />
            <WrenchIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            v-if="boothTool"
            @click.prevent="getUnknownBooths()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Get Unknown Booths
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          @click="nav(item.id)"
          :class="`text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${
            route.params.id === item.id ? 'bg-gray-900 text-white' : ''
          }`"
        >
          {{ item.name }}
          <span
            v-if="item.count > 0"
            class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full"
          >
            {{ item.count }}
          </span>
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
  <main>
    <div class="flex flex-wrap justify-center align-center p-2 mb-2 gap-y-2">
      <label class="inline-flex items-center cursor-pointer mr-3">
        <input type="checkbox" v-model="info" class="sr-only peer" />
        <div
          class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>
        <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Game Info</span>
      </label>
      <label class="inline-flex items-center cursor-pointer mr-3">
        <input type="checkbox" v-model="editingEnabled" class="sr-only peer" />
        <div
          class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>
        <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">
          Enable Editing
        </span>
      </label>
      <input class="mr-2" type="text" v-model="userId" placeholder="Tabletop Together ID" />
      <button
        type="button"
        @click="loadGames(true)"
        class="mr-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Load
      </button>
      <button
        type="button"
        @click="saveGames()"
        class="mr-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Save
      </button>
      <button
        type="button"
        @click="resetGames()"
        class="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Reset
      </button>
      <label class="inline-flex items-center cursor-pointer mr-2">
        <input type="checkbox" v-model="needs" class="sr-only peer" />
        <div
          class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-200"
        ></div>
        <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Needs</span>
      </label>
      <label class="inline-flex items-center cursor-pointer mr-2">
        <input type="checkbox" v-model="wants" value="" class="sr-only peer" />
        <div
          class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"
        ></div>
        <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Wants</span>
      </label>
      <label class="inline-flex items-center cursor-pointer mr-2">
        <input type="checkbox" v-model="likes" value="" class="sr-only peer" />
        <div
          class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-300"
        ></div>
        <span class="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Likes</span>
      </label>
    </div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>
<style>
@import 'vue-draggable-resizable/style.css';
</style>
