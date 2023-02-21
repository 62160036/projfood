<template>
  <header class="p-3 text-bg-light">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      <HeaderLogo class="mx-4" />

      <form class="col col-lg col-md col-sm me-3 me-lg-3" role="search">
        <input type="search" class="form-control form-control-light text-bg-light" placeholder="ค้นหาสินค้า, หมวดหมู่" aria-label="Search">
      </form>

      <div v-if="!isLoggedin" class="text-end mt-lg-0 mt-md-0 mt-sm-0 mt-2">
        <Button label="เข้าสู่ระบบ" icon="pi pi-sign-in" class="me-3 p-button-raised p-button-secondary" @click="openModalSignIn" />
        <Button label="สมัครสมาชิก" icon="pi pi-plus-circle" class="p-button-raised p-button-info" @click="goToSignUp" />
      </div>
      <div v-else class="col-2">
        <div class="profile-title">
          <SplitButton :model="menu" class="p-button-raised p-button-text p-button-secondary mb-2">
            <Button>
              <i class="pi pi-user me-2" />
              <span class="ml-2 flex align-items-center font-bold">{{ user.firstname }} {{ user.lastname }}</span>
            </Button>
          </SplitButton>
        </div>
        <div class="cart">
          <Button type="button" label="ตะกร้าสินค้า" icon="pi pi-shopping-cart" class="me-3 p-button-raised p-button-warning p-button-info mt-lg-0 mt-md-0 mt-sm-0 mt-2" :badge="countCart" badgeClass="p-badge-danger" :disabled="isVerified" />
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import SplitButton from 'primevue/splitbutton'
import ModalSignIn from '../../views/Auth/ModalSignIn.vue'
import db from '../../main'

import UserData from '../../../projfoodApi/users'
import HeaderLogo from './HeaderLogo.vue'

const countCart = ref<string>('100')
const isVerified = ref(true)

const menu = computed(() => {
  return [
    {
      label: 'ข้อมูลส่วนตัว',
      icon: 'pi pi-fw pi-user',
      disabled: isVerified.value,
      to: '/settings/profile',
    },
    {
      label: 'ข้อมูลการจัดส่ง',
      icon: 'pi pi-fw pi-truck',
      disabled: isVerified.value,
      to: '/settings/shipping',
    },
    {
      label: 'ประวัติการสั่งซื้อ',
      icon: 'pi pi-fw pi-history',
      disabled: isVerified.value,
      to: '/settings/orderHistory',
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        handleSignOut()
      },
    },
  ]
})

const userData = UserData()
const router = useRouter()
const isLoggedin = ref(true)

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
const showError = (summary: string, detail: string, life: number) => {
  toast.add({ severity: 'error', summary, detail, life })
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
    showError('แจ้งเตือนการออกจากระบบไม่สำเร็จ', 'ออกจากระบบไม่สำเร็จ', 3000)
  })
}

// function updateUserData() {
//   const auth = getAuth()
//   userData.updateUser(auth.currentUser!.uid, 'testeeeee')
// }

(async () => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedin.value = true
      if (auth && auth.currentUser) {
        if (!auth.currentUser.emailVerified) {
          isVerified.value = true
          showError('แจ้งเตือนการยืนยันอีเมล', 'กรุณายืนยันอีเมลของคุณ', 600000)
        }
        else {
          isVerified.value = false
        }
        readUserData(auth.currentUser!.uid)
      }
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
