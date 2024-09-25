<script setup lang="ts">
import HallView from './HallView.vue'
import { halls, gamesByHall } from '../state'
import { computed, watch } from 'vue'

const hallId = '3'
const games = computed(() => gamesByHall.value[hallId] ?? [])
</script>

<template>
  <hall-view :hall="halls[hallId]" :games="games" />
</template>
