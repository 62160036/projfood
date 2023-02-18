import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { defaultConfig, plugin } from '@formkit/vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '@formkit/themes/genesis'

// remember, each Vue plugin needs its own .use()
// .use(router).use(plugin2)

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCV0npRonknzET7r69-kMKU11xIBqhNHOY',
  authDomain: 'projfood-3956f.firebaseapp.com',
  databaseURL: 'https://projfood-3956f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'projfood-3956f',
  storageBucket: 'projfood-3956f.appspot.com',
  messagingSenderId: '1054434030382',
  appId: '1:1054434030382:web:e53cf2118eadeb4dc880bf',
  measurementId: 'G-FERMDRQPTJ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
getAnalytics(app)

export default db

createApp(App).use(router).use(ToastService).use(PrimeVue).use(plugin, defaultConfig).mount('#app')
