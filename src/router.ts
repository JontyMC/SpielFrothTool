import { createWebHistory, createRouter } from 'vue-router'

import HallView from './views/HallView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: (x) => ({ name: 'hall', params: { id: x.params.id }, query: { u: x.params.u } })
    },
    { name: 'hall', path: '/hall/:id', component: HallView, props: true }
  ]
})

export default router
//http://localhost:5173/hall/2?u=3ec71aebba638f3296802760cf3c6ff7
