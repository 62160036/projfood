import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { defaultConfig, plugin } from '@formkit/vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import App from './App.vue'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '@formkit/themes/genesis'
import '/node_modules/primeflex/primeflex.css'

// remember, each Vue plugin needs its own .use()
// .use(router).use(plugin2)

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC22_OTiG3QbF8Sf4VKLOhCMnwq8WLWGH4',
  authDomain: 'prjfood-dc319.firebaseapp.com',
  projectId: 'prjfood-dc319',
  storageBucket: 'prjfood-dc319.appspot.com',
  messagingSenderId: '457362363488',
  appId: '1:457362363488:web:547d9bf7d0f434330d5f05',
  measurementId: 'G-Y9NQNWKET2',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
getAnalytics(app)

export default db

createApp(App).use(router).use(ToastService).use(PrimeVue).use(plugin, defaultConfig).mount('#app')
