import { createMemoryHistory, createRouter } from 'vue-router'

import Hall3View from './views/Hall3View.vue'

const routes = [{ path: '/', component: Hall3View }]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
