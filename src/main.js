import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.js'
import { store } from './store/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).use(store).mount('#app')
import 'bootstrap/dist/js/bootstrap.js'
