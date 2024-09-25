import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueDraggableResizable from 'vue-draggable-resizable'

const app = createApp(App)
app.component('vue-draggable-resizable', VueDraggableResizable)
app.use(router)
app.mount('#app')
