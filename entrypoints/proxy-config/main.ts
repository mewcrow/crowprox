import { createApp } from 'vue'
import '@/assets/css/tailwind.css'
import App from './App.vue'

import { configStorage } from '@/core/ConfigStorage'

configStorage.init().then(() => {
  createApp(App).mount('#app')
})
