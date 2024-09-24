<script setup lang="ts">
import HallView, { HallData } from './HallView.vue'

const hall3: HallData = {
  width: 3509,
  height: 4963,
  booths: [{ id: '3A112', name: '??', top: 3812, left: 1260, bottom: 4030, right: 1422 }]
}
</script>

<template>
  <hall-view :data="hall3" />
</template>
