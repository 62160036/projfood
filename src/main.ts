import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css  '

createApp(App).use(router).use(ToastService).use(PrimeVue).mount('#app')
