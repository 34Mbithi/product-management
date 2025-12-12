import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Restore theme before app loads
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
