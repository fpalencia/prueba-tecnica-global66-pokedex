import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import App from './App.vue'
import router from './router'


const pinia = createPinia()

createApp(App).use(pinia).use(VueQueryPlugin).use(router).mount('#app')
