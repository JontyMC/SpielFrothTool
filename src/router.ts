import { createMemoryHistory, createRouter } from 'vue-router'

import HallView from './views/HallView.vue'

const routes = [
  { path: '/', redirect: '/3' },
  { path: '/:id', component: HallView, props: true }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
