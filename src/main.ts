import { createApp } from 'vue'
import router from './router'
import AppView from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(AppView)

app.use(createPinia())

app.use(router).mount('#app')
