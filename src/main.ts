import { createApp } from 'vue'
import './style.styl'
import App from './App.vue'
import { createPinia } from 'pinia'
import vueRouter from './router'

const app = createApp(App)

const pinia = createPinia()

app.use(vueRouter)
app.use(pinia)

app.mount('#app')
