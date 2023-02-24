<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="topbar">
    <div class="text-bg-light">
      <div class="grid align-items-center justify-content-center justify-content-start mr-2 ml-2 mb-2">
        <HeaderLogo class="m-4" />

        <form class="col-6 mr-3 mt-2" role="search">
          <input type="search" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" placeholder="ค้นหาสินค้า, หมวดหมู่" aria-label="Search">
        </form>

        <div v-if="!isLoggedin" class="text-right col-md-12 mt-2" :class="{ 'col-sm': 'col-sm' }">
          <Button label="เข้าสู่ระบบ" icon="pi pi-sign-in" class="mr-3 p-button-raised p-button-secondary" @click="openModalSignIn" />
          <Button label="สมัครสมาชิก" icon="pi pi-plus-circle" class="p-button-raised p-button-info" @click="goToSignUp" />
        </div>
        <div v-else class="flex flex-wrap">
          <div class="col mt-3">
            <SplitButton :model="menu" class="p-button-raised p-button-text p-button-secondary mb-2">
              <Button>
                <i class="pi pi-user me-2" />
                <span class="ml-2 flex align-items-center font-bold">{{ user.firstname }} {{ user.lastname }}</span>
              </Button>
            </SplitButton>
          </div>
          <div class="flex align-items-center justify-content-center">
            <Button type="button" label="ตะกร้าสินค้า" icon="pi pi-shopping-cart" class="me-3 p-button-raised p-button-warning p-button-info mt-lg-0 mt-md-0 mt-sm-0 mt-2" :badge="countCart" badgeClass="p-badge-danger" :disabled="isVerified" @click="toggleDataTable" />
            <OverlayPanel id="overlay_panel" ref="op2" appendTo="body" :showCloseIcon="true" style="width: 600px">
              <DataTable v-model:selection="selectedProduct" :value="products" selectionMode="single" :paginator="true" :rows="5" responsiveLayout="scroll" @row-select="onProductSelect">
                <Column field="name" header="Name" :sortable="true" headerStyle="min-width:12rem;" />
                <Column header="Image" headerStyle="min-width:5rem;">
                  <template v-slot:body="slotProps">
                    <img :src="`${contextPath}demo/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" width="50" class="shadow-2">
                  </template>
                </Column>
                <Column field="price" header="Price" :sortable="true" headerStyle="min-width:8rem;">
                  <template v-slot:body="slotProps">
                    {{ formatCurrency(slotProps.data.price) }}
                  </template>
                </Column>
                <Column field="price" header="Action" :sortable="true" headerStyle="min-width:8rem;">
                  <template v-slot:body>
                    <Button label="ลบสินค้า" icon="pi pi-trash" class="p-button-raised p-button-danger" />
                  </template>
                </Column>
              </DataTable>
              <div class="grid m-4">
                <Button label="เพิ่มสินค้า" icon="pi pi-plus" class="col p-button-raised p-button-info w-auto mr-2" />
                <Button label="ชำระเงิน" icon="pi pi-money-bill" class="col p-button-raised p-button-success w-auto" />
              </div>
            </OverlayPanel>
          </div>
        </div>
      </div>
    </div>
    <Menubar :model="items" />
  </div>

  <ModalSignIn ref="modalSignIn" />
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import { useToast } from 'primevue/usetoast'

import HeaderLogo from './HeaderLogo.vue'
import UserData from '@/composables/users'
import db from '@/main'
import ModalSignIn from '@/views/Auth/ModalSignIn.vue'

import ProductService from '@/service/ProductService'
import { useLayout } from '@/layout/composables/layout'

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: '/',
  },
  {
    label: 'ผักผลไม้',
    // icon: 'pi pi-fw pi-home',
    to: '/calendar',
  },
  {
    label: 'เนื้อสัตว์แช่แข็ง',
    // icon: 'pi pi-fw pi-pencil',
    to: '/edit',
  },
  {
    label: 'อาหารทะเลแช่แข็ง',
    // icon: 'pi pi-fw pi-file',
    to: '/documentation',
  },
  {
    label: 'อาหารสำเร็จรูป',
    // icon: 'pi pi-fw pi-cog',
    // to: '/settings',
  },
])

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
      label: 'Dashboard',
      icon: 'pi pi-fw pi-chart-bar',
      disabled: isVerified.value,
      to: '/dashboard',
    },
    {
      separator: true,
    },
    {
      label: 'ออกจากระบบ',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        handleSignOut()
      },
    },
  ]
})

const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'ออกจากระบบสำเร็จ', life: 3000 })
}
const showError = (summary: string, detail: string, life: number) => {
  toast.add({ severity: 'error', summary, detail, life })
}

const { contextPath } = useLayout()
const selectedProduct = ref()
const products = ref()
const productService = new ProductService()
const op2 = ref()

onMounted(() => {
  productService.getProductsSmall().then(data => (products.value = data))
})

const countCart = computed(() => {
  return products.value?.length
})

const toggleDataTable = (event: any) => {
  op2.value.toggle(event)
}

const formatCurrency = (value: { toLocaleString: (arg0: string, arg1: { style: string; currency: string }) => any }) => {
  return value.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })
}

const onProductSelect = (event: { data: { name: string } }) => {
  toast.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 })
}

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

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      user.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        userId: doc.data().userId,
      }
    })
  })
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
    showError('แจ้งเตือนการออกจากระบบไม่สำเร็จ', error, 3000)
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
.topbar {
    position: fixed;
    height: 200px;
    z-index: 997;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 2rem;
    background-color: var(--surface-card);
    transition: left 0.2s;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
