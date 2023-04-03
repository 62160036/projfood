<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="topbar">
    <div class="text-bg-light">
      <div class="grid align-items-center justify-content-center justify-content-start mr-2 ml-2 mb-2">
        <HeaderLogo class="m-4" />

        <div class="col-6 mr-3 mt-2">
          <InputText v-model="search" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" placeholder="ค้นหาสินค้า, หมวดหมู่" />
          <div v-if="search.length > 0" class="searchbar" style="margin: 10px">
            <div
              v-for="product in searchedProducts"
              :key="product.id"
              class="card ui fluid"
              style="margin: 0"
            >
              <div class="searchbar-content">
                <div class="header" @click="searchProduct(product.category, product.id)">
                  {{ product.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isLoggedin" class="text-right col-md-12 mt-2" :class="{ 'col-sm': 'col-sm' }">
          <Button label="เข้าสู่ระบบ" icon="pi pi-sign-in" class="mr-3 p-button-raised p-button-secondary" @click="openModalSignIn" />
          <Button label="สมัครสมาชิก" icon="pi pi-plus-circle" class="p-button-raised p-button-info" @click="goToSignUp" />
        </div>

        <div v-else class="flex flex-wrap">
          <div class="col mt-3">
            <SplitButton :model="menu" class="p-button-raised p-button-text p-button-secondary mb-2">
              <Button>
                <i class="pi pi-user me-2" />
                <span class="ml-2 flex align-items-center font-bold">{{ userList.firstname }} {{ userList.lastname }}</span>
              </Button>
            </SplitButton>
          </div>

          <div class="flex align-items-center justify-content-center">
            <Button type="button" label="ตะกร้าสินค้า" icon="pi pi-shopping-cart" class="me-3 p-button-raised p-button-warning p-button-info mt-lg-0 mt-md-0 mt-sm-0 mt-2" :badge="countCart" badgeClass="p-badge-danger" :disabled="isVerified" @click="toggleDataTable" />
            <OverlayPanel id="overlay_panel" ref="op2" appendTo="body" :showCloseIcon="true" style="width: 900px">
              <DataTable v-model:selection="selectedProduct" :value="orderList" selectionMode="single" :paginator="true" :rows="5" responsiveLayout="scroll">
                <Column field="order_id" header="รหัสคำสั่งซื้อ" :sortable="true" headerStyle="min-width:12rem;" />
                <Column field="product" header="รูป" headerStyle="min-width:5rem;">
                  <template v-slot:body="slotProps">
                    <img :src="`${slotProps.data.product.image === 'product-placeholder.svg' ? noImage : slotProps.data.product.image}`" :alt="slotProps.data.product.image" width="50" class="shadow-2">
                  </template>
                </Column>
                <Column field="product" header="ชื่อสินค้า" headerStyle="min-width:8rem;">
                  <template v-slot:body="slotProps">
                    {{ slotProps.data.product.name }}
                  </template>
                </Column>
                <Column field="order_price" header="ราคา" :sortable="true" headerStyle="min-width:8rem;">
                  <template v-slot:body="slotProps">
                    {{ formatCurrency(slotProps.data.order_price) }}
                  </template>
                </Column>
                <Column field="quantity" header="จำนวน" :sortable="true" headerStyle="min-width:8rem;">
                  <template v-slot:body="slotProps">
                    {{ slotProps.data.quantity }}
                  </template>
                </Column>
                <Column field="total_price" header="ราคารวม" :sortable="true" headerStyle="min-width:8rem;">
                  <template v-slot:body="slotProps">
                    {{ formatCurrency(slotProps.data.total_price) }}
                  </template>
                </Column>
                <Column field="order_id" header="Action" headerStyle="min-width:10rem;">
                  <template v-slot:body="slotProps">
                    <Button label="ลบสินค้า" icon="pi pi-trash" class="p-button-raised p-button-danger" @click="deleteOrder(slotProps.data.order_id)" />
                  </template>
                </Column>
              </DataTable>
              <div class="grid m-4">
                <div class="col-12">
                  <div class="grid">
                    <div class="col align-items-center justify-content-center font-bold">
                      สินค้าทั้งหมด
                    </div>
                    <div class="col justify-content-end flex-wrap font-bold">
                      <div class="flex align-items-end justify-content-end">
                        {{ formatCurrency(countAllPrice) }}
                      </div>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="col align-items-center justify-content-center font-bold">
                      ค่าจัดส่ง
                    </div>
                    <div class="col justify-content-end flex-wrap font-bold">
                      <div class="flex align-items-end justify-content-end">
                        {{ formatCurrency(ShippedCost) }}
                      </div>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="col align-items-center justify-content-center font-bold">
                      ภาษีมูลค่าเพิ่ม (7%)
                    </div>
                    <div class="col justify-content-end flex-wrap font-bold">
                      <div class="flex align-items-end justify-content-end">
                        {{ formatCurrency(tax) }}
                      </div>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="col font-bold">
                      รวมทั้งหมด
                    </div>
                    <div class="col justify-content-end flex-wrap font-bold">
                      <div class="flex align-items-end justify-content-end">
                        {{ formatCurrency(sumPrice) }}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  label="ชำระเงิน" icon="pi pi-money-bill"
                  class="col p-button-raised p-button-success w-auto"
                  :disabled="orderList.length === 0"
                  @click="Payment"
                />
              </div>
            </OverlayPanel>
          </div>
        </div>
      </div>
    </div>
    <Menubar :model="menus" />
  </div>

  <ModalSignIn ref="modalSignIn" />
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth'
import { useToast } from 'primevue/usetoast'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import HeaderLogo from './HeaderLogo.vue'
import formatCurrency from '@/plugins/formatCurrency'
import CategoryData from '@/composables/categories'
import OrderData from '@/composables/orders'

import ModalSignIn from '@/views/Auth/ModalSignIn.vue'

import db from '@/main'
import ProductData from '@/composables/products'

const categoryData = CategoryData()
const categories = ref<any>({
  data: [],
})
const categoryList = computed(() => categories.value.data)
async function getAllCategories() {
  categories.value.data = await categoryData.getAllCategories()
}

const items = ref([
  {
    label: 'หน้าแรก',
    icon: 'pi pi-fw pi-home',
    to: '/',
  },
])

const menus = computed(() => {
  return items.value.concat(
    categoryList.value.filter((category: any) => category.status === true).map((category: any) => {
      return {
        label: category.label,
        to: `/view/${category.value}`,
      }
    }),
  )
})

const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=e6b54247-37f3-4bfa-a584-dd52122a4673')
const isVerified = ref(true)
const isAdmin = ref(true)
const userList = ref<any>([])

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
      class: !isAdmin.value ? 'hidden' : '',
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
function showSuccess() {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'ออกจากระบบสำเร็จ', life: 3000 })
}
function showError(summary: string, detail: string, life: number) {
  toast.add({ severity: 'error', summary, detail, life })
}

const selectedProduct = ref()
const op2 = ref()

const orderData = OrderData()
const orders = ref<any>({
  data: [],
})

const orderList = computed(() => {
  return orders.value.data.filter((order: any) => order.order_status === 'waiting_for_payment')
})

async function getAllOrders() {
  orders.value.data = await orderData.getAllOrders()
}

const countCart = computed(() => {
  return orderList.value.length
})

const countAllPrice = computed(() => {
  return orderList.value.reduce((a: any, b: any) => a + b.total_price, 0)
})

const tax = computed(() => {
  return countAllPrice.value * 0.07
})

const ShippedCost = computed(() => {
  if (countAllPrice.value > 1000)
    return 0
  else
    return 100
})

const sumPrice = computed(() => {
  return countAllPrice.value + ShippedCost.value + tax.value
})

function toggleDataTable(event: any) {
  op2.value.toggle(event)
  getAllOrders()
}

function deleteOrder(orderId: string) {
  orderData.deleteOrder(orderId)
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'ลบสินค้าสำเร็จ', life: 3000 })
  getAllOrders()
}

const router = useRouter()
const isLoggedin = ref(true)

async function getUserById(userId: string) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      userList.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        userId: doc.data().userId,
        role: doc.data().role,
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

function Payment() {
  router.push('/payment')
}

const productData = ProductData()
const search = ref('')
const products = ref<any>({
  data: [],
})
const productList = computed(() => products.value.data)

async function getAllProducts() {
  products.value.data = await productData.getAllProducts()
}

const searchedProducts = computed(() => {
  return productList.value.filter((product: any) => {
    return (
      product.name
        .includes(search.value)
    )
  })
})

function searchProduct(category: string, id: string) {
  router.push(`/view/${category}/${id}`)
  search.value = ''
}

(async () => {
  const auth = getAuth()
  getAllProducts()
  getAllCategories()
  getAllOrders()

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
        getUserById(auth.currentUser!.uid)
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.admin)
            isAdmin.value = idTokenResult.claims.admin
          else isAdmin.value = false
        })
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
.searchbar{
  position: fixed;
  height: 200px;
  width: 850px;
  z-index: 997;
  .searchbar-content{
    cursor: pointer;
  }
}
</style>
