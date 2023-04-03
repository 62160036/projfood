<template>
  <div class="card">
    <div class="p-fluid m-2 mx-4">
      <div v-for="(item, inx) in productList" :key="inx">
        <div class="flex">
          <div class="col-5 mb-2">
            <div class="field">
              <Image :src="`${item.image === 'product-placeholder.svg' ? noImage : item.image}`" alt="Image" width="600" preview />
            </div>
          </div>
          <div class="col-2">
            <Divider layout="vertical" />
          </div>
          <div class="col-5">
            <div class="flex justify-content-center align-items-center mb-2 product-name">
              <h4>
                {{ item.name }}
              </h4>
            </div>
            <div class="grid">
              <div class="col-12 p-0 pb-2">
                <div v-for="itm, index in status" :key="index">
                  <Chip v-if="item.productStatus === itm.value" :label="item.productStatus === itm.value ? itm.label : ''" />
                </div>
              </div>
              <div class="col-6 p-0">
                รหัสสินค้า : {{ item.id }}
              </div>
              <div class="col-6 p-0">
                จำนวนคงเหลือ : {{ item.quantity }}
              </div>
              <div class="col p-0">
                ราคา :
              </div>
              <div class="col p-0">
                <span class="text-red-500">{{ formatCurrency(item.price) }}</span>
              </div>
              <div class="col-12 text-description">
                <Editor v-model="item.description" readonly>
                  <template v-slot:toolbar>
                    <span class="ql-formats">
                      รายละเอียด :
                    </span>
                  </template>
                </Editor>
              </div>

              <div class="col-6 p-0">
                สถานะ :
              </div>
              <div class="col-6 p-0">
                หมวดหมู่ :
              </div>
              <div class="col-6">
                <div v-for="itm, index in statuses" :key="index">
                  <span v-if="item.inventoryStatus === itm.value" :class="`product-badge status-${item.inventoryStatus.toLowerCase()}`">{{ item.inventoryStatus === itm.value ? itm.label : '' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div v-for="itm, index in categoryList" :key="index">
                  <span v-if="item.category === itm.value" class="product-category">{{ item.category === itm.value ? itm.label : '' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="flex justify-content-center align-items-center">
                  <InputNumber
                    v-model="quantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :min="0" :max="item.quantity"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    @change="calculateTotalPrice(item.price, quantity)"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="flex justify-content-center align-items-center">
                  <Button
                    :label="`เพิ่มสินค้าลงตะกร้า ${formatCurrency(totalPrice)}`"
                    icon="pi pi-shopping-cart"
                    class="p-button-rounded p-button-success"
                    :disabled="quantity === 0 || !isLoggedin"
                    @click="addProductToCart()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import formatCurrency from '@/plugins/formatCurrency'
import db from '@/main'
import CategoryData from '@/composables/categories'
import OrderData from '@/composables/orders'

interface ProflieState {
  email: string | null
  firstname: string
  lastname: string
  phone: string

}

const state = ref<ProflieState>({
  email: '',
  firstname: '',
  lastname: '',
  phone: '',
})

const route = useRoute()
const routeID = ref()

const isLoggedin = ref(true)
const categoryData = CategoryData()
const categories = ref<any>({
  data: [],
})
const categoryList = computed(() => categories.value.data)

function getRouteId() {
  routeID.value = route.params.name
}

const products = ref<any>({
  data: [],
})

const productList = computed(() => {
  return products.value.data
})

watch(() => route.params.id, () => {
  getProductById()
  getRouteId()
})

const quantity = ref(0)
const totalPrice = ref(0)

function calculateTotalPrice(price: number, quantity: number) {
  totalPrice.value = price * quantity
}

async function getAllCategories() {
  categories.value.data = await categoryData.getAllCategories()
}

watch(() => quantity.value, () => {
  calculateTotalPrice(productList.value[0].price, quantity.value)
})
watch(() => products.value.data, () => {
  quantity.value = 0
  calculateTotalPrice(productList.value[0].price, quantity.value)
})

watch(() => routeID.value, () => {
  getProductById()
})

const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=59bf9fe8-8848-4e48-9681-4d66bb17dd5f')

const statuses = ref([
  { label: 'มีสินค้า', value: 'INSTOCK' },
  { label: 'สินค้ามีน้อย', value: 'LOWSTOCK' },
  { label: 'สินค้าหมด', value: 'OUTOFSTOCK' },
])

const status = ref([
  { label: 'สินค้าแนะนำ', value: 'recommended_product' },
  { label: 'สินค้าขายดี', value: 'best_seller' },
  { label: 'สินค้าใหม่', value: 'new_product' },
  { label: 'สินค้าลดราคา', value: 'discount_product' },
  { label: 'สินค้า', value: 'product' },
])

async function getProductById() {
  const q = query(collection(db, 'products'), where('id', '==', routeID.value))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      products.value.data = [
        {
          id: doc.id,
          ...doc.data(),
        },

      ]
    })
  })
}

function createId() {
  const id = ref('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const char = ref('')
  for (let i = 0; i < 10; i++)
    char.value += chars.charAt(Math.floor(Math.random() * chars.length))

  id.value = `order_${char.value}`

  return id
}

const user_id = ref<any>()
const orderData = OrderData()
const orders = ref<any>({
  data: [],
})

const orderList = computed(() => {
  return orders.value.data
})

async function getAllOrders() {
  orders.value.data = await orderData.getAllOrders()
}

function addProductToCart() {
  getAllOrders()
  if (orderList.value.find((item: any) => item.product.id === productList.value[0].id && item.order_status === 'waiting_for_payment')) {
    const id = orderList.value.find((item: any) => item.product.id === productList.value[0].id).order_id
    orderData.updateOrder(id, quantity.value, totalPrice.value)
  }
  else {
    const id = createId()
    const order = {
      id: id.value,
      user_id: user_id.value,
      order_price: productList.value[0].price,
      quantity: quantity.value,
      totalPrice: totalPrice.value,
      status: 'waiting_for_payment',
    }
    const users: any = {
      user_id: user_id.value,
      firstname: state.value.firstname,
      lastname: state.value.lastname,
    }
    const product: any
    = {
      id: productList.value[0].id,
      name: productList.value[0].name,
      image: productList.value[0].image,
    }
    orderData.createOrder(order.id, product, users, order.order_price, order.quantity, order.totalPrice, order.status)
  }
}

async function getUserProfile() {
  const auth = getAuth()
  const user = auth.currentUser

  if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
    const email = user.email
    state.value.email = email
    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid
    readUserData(uid)
  }
}

async function readUserData(userId: string) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      state.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        phone: doc.data().phone,
      }
    })
  })
}

(async () => {
  getUserProfile()
  getRouteId()
  getProductById()
  getAllCategories()
  getAllOrders()

  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedin.value = true
      user_id.value = user.uid
    }

    else { isLoggedin.value = false }
  })
})()
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
    border-radius: 4px;
    margin-bottom: 2rem;
    width: 80%;
    margin: 0 auto;
}

.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
    font-size: 1.5rem;
    font-weight: 700;
}

.text-description {
    margin: 0 0 1rem 0;
}

.product-category-icon {
    vertical-align: middle;
    margin-right: .5rem;
}

.product-category {
    font-weight: 600;
    vertical-align: middle;
}
</style>
