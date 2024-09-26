import { createWebHistory, createRouter } from 'vue-router'

import HallView from './views/HallView.vue'

const routes = [
  { path: '/', redirect: '/hall/3' },
  { path: '/hall/:id', component: HallView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
