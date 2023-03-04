<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <!-- <img :src="logoUrl" alt="logo"> -->
      <span>แผงควบคุม</span>
    </router-link>

    <div class="layout-topbar-menu">
      <div class="py-3">
        {{ userList.firstname }} {{ userList.lastname }} ({{ userList.role ? 'Admin' : 'User' }}) <br>
        {{ userList.email }}
      </div>
      <div class="py-3">
        <SplitButton :model="menu" class="p-button-text p-button-secondary mb-2" />
      </div>
    </div>
  </div>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import { computed, ref } from 'vue'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import db from '@/main'

const menu = computed(() => {
  return [
    {
      label: 'ออกจากระบบ',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        handleSignOut()
      },
    },
  ]
})

const auth = getAuth()
const isLoggedin = ref(true)
const userList = ref<any>([])
const router = useRouter()

const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'ออกจากระบบสำเร็จ', life: 3000 })
}
const showError = (summary: string, detail: string, life: number) => {
  toast.add({ severity: 'error', summary, detail, life })
}

async function getUserById() {
  const userId = auth.currentUser?.uid
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      userList.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        userId: doc.data().userId,
        role: {
          admin: doc.data().role.admin,
        },
      }
    })
  })
}

function handleSignOut() {
  const auth = getAuth()
  signOut(auth).then(() => {
    isLoggedin.value = false
    router.push('/')
    showSuccess()
  }).catch((error) => {
    showError('แจ้งเตือนการออกจากระบบไม่สำเร็จ', error, 3000)
  })
}

(() => {
  getUserById()
})()
</script>

<style lang="scss" scoped>
</style>
