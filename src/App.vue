<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import {
  Bars3Icon,
  WrenchIcon,
  PrinterIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import {
  boothTool,
  info,
  likes,
  loadGames,
  needs,
  resetGames,
  saveGames,
  userId,
  wants
} from './state'

const navigation = [
  { name: 'Hall 1', href: '#', current: true },
  { name: 'Hall 2', href: '#', current: false },
  { name: 'Hall 3', href: '#', current: false },
  { name: 'Hall 4', href: '#', current: false },
  { name: 'Hall 5', href: '#', current: false },
  { name: 'Hall 6', href: '#', current: false },
  { name: 'Hall 7', href: '#', current: false }
]

onMounted(() => {
  userId.value = '1990e9fa56c4e74f80b0e6819775d98f'
  loadGames(false)
})

function toggleInfo() {
  info.value = !info.value
}

function print() {
  window.open(
    'https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en',
    '_blank'
  )
}

function toggleBoothTool() {
  boothTool.value = !boothTool.value
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
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]"
                :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </a>
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
            @click="toggleInfo()"
          >
            <span class="absolute -inset-1.5" />
            <InformationCircleIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="mr-1 relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            @click="toggleBoothTool()"
          >
            <span class="absolute -inset-1.5" />
            <WrenchIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
  <main>
    <div class="flex flex-wrap justify-center align-center p-2 mb-2">
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
