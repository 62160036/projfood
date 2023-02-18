<template>
  <header class="p-3 text-bg-light">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      <HeaderLogo class="mx-4" />

      <form class="col col-lg col-md col-sm me-3 me-lg-3" role="search">
        <input type="search" class="form-control form-control-light text-bg-light" placeholder="ค้นหาสินค้า, หมวดหมู่" aria-label="Search">
      </form>

      <div v-if="!isLoggedin" class="text-end mt-lg-0 mt-md-0 mt-sm-0 mt-2">
        <Button label="Login" icon="pi pi-sign-in" class="me-3 p-button-secondary" @click="openModalSignIn" />
        <Button label="Register" icon="pi pi-plus-circle" class="p-button-info" @click="goToSignUp" />
      </div>
      <div v-else class="col-2">
        <div class="profile-title">
          <i class="pi pi-user me-2" />
          <SplitButton :label="`${user.firstname} ${user.lastname}`" :model="menu" class="p-button-text p-button-secondary mb-2" />
        </div>
        <div class="cart">
          <Button type="button" label="ตะกร้าสินค้า" icon="pi pi-shopping-cart" class="me-3 p-button-warning p-button-info mt-lg-0 mt-md-0 mt-sm-0 mt-2" badge="8" badgeClass="p-badge-danger" />
        </div>
      </div>
    </div>
  </header>
  <header class="p-1 text-bg-dark">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start ms-5">
      <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
        <li><a href="#" class="nav-link px-2 text-white">ผักผลไม้</a></li>
        <li><a href="#" class="nav-link px-2 text-white">เนื้อสัตว์แช่แข็ง</a></li>
        <li><a href="#" class="nav-link px-2 text-white">อาหารทะเลแช่แข็ง</a></li>
        <li><a href="#" class="nav-link px-2 text-white">อาหารสำเร็จรูป</a></li>
        <li><a href="#" class="nav-link px-2 text-white">สินค้าแนะนำ</a></li>
      </ul>
    </div>
  </header>

  <ModalSignIn ref="modalSignIn" />
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import SplitButton from 'primevue/splitbutton'
import ModalSignIn from '../../views/Auth/ModalSignIn.vue'
import db from '../../main'

import HeaderLogo from './HeaderLogo.vue'

const menu = [
  {
    label: 'ข้อมูลส่วนตัว',
    icon: 'pi pi-fw pi-user',
    // to: '/profile',
  },
  {
    label: 'ข้อมูลการจัดส่ง',
    icon: 'pi pi-fw pi-truck',
  },
  {
    label: 'ประวัติการสั่งซื้อ',
    icon: 'pi pi-fw pi-history',
  },
  {
    label: 'Logout',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      handleSignOut()
    },
  },
]

const router = useRouter()
const isLoggedin = ref(false)
const user = ref({
  email: '',
  firstname: '',
  lastname: '',
  userId: '',
})

async function readUserData(userId: string) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    user.value = {
      email: doc.data().email,
      firstname: doc.data().firstname,
      lastname: doc.data().lastname,
      userId: doc.data().userId,
    }
  })
}
const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'ออกจากระบบสำเร็จ', life: 3000 })
}
const showError = () => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: 'ออกจากระบบไม่สำเร็จ', life: 3000 })
}
const modalSignIn = ref<InstanceType<typeof ModalSignIn>>(null!)

function openModalSignIn() {
  modalSignIn.value.openModal()
}

function goToSignUp() {
  router.push('/sign-up')
}

function handleSignOut() {
  const auth = getAuth()
  signOut(auth).then(() => {
    isLoggedin.value = false
    router.push('/')
    showSuccess()
  }).catch((error) => {
    console.log(error)
    showError()
  })
}

(async () => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedin.value = true
      if (auth)
        readUserData(auth.currentUser!.uid)
    }

    else { isLoggedin.value = false }
  })
})()
</script>

<style lang="scss" scoped>
.profile-title {
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;

}
.cart {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
