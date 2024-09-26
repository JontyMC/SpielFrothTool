import { createWebHistory, createRouter } from 'vue-router'

import HallView from './views/HallView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: (x) => ({
        name: 'hall',
        params: { id: '3' },
        query: { u: x.params.u }
      })
    },
    { name: 'hall', path: '/hall/:id', component: HallView, props: true }
  ]
})

export default router
