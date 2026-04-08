import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import FourForcesPage from './pages/FourForcesPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/four-forces' },
    { path: '/four-forces', component: FourForcesPage },
  ],
})

createApp(App).use(router).mount('#app')
