<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import data from './data.json'
import { onMounted } from 'vue'
import { gameId } from './model'
import { loadGames } from './state'

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
  loadGames('1990e9fa56c4e74f80b0e6819775d98f')
})

async function loadData() {
  //const url = 'https://tabletoptogether.com/tool/share.php?key=3ec71aebba638f3296802760cf3c6ff7&c=29'
  // const id = '3ec71aebba638f3296802760cf3c6ff7'
  // const url = 'http://localhost:7124/api/data/' + id
  // const { status, data } = await axios.request<string>({
  //   method: 'get',
  //   url,
  //   validateStatus: () => true
  // })
  loadGames('1990e9fa56c4e74f80b0e6819775d98f', data)
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
            class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <div class="d-flex p-2">
            <input class="mr-2" type="text" placeholder="Tabletop ID" />
            <button
              type="button"
              @click="loadData()"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Load
            </button>
          </div>
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
