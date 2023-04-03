<template>
  <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '50%' }" position="top">
    <div class="flex align-items-center flex-column pt-6 px-3">
      <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }" />
      <h5>ชำระเงินเรียบร้อยแล้ว</h5>
      <div class="flex align-items-center flex-column pt-6 px-3" :style="{ lineHeight: 1.5, textIndent: '1rem' }">
        คุณได้ชำระเงินเรียบร้อยแล้ว โปรดรอการตรวจสอบจากผู้ดูแลระบบ
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-content-center">
        <Button label="OK" class="p-button-text" @click="toggleDialog" />
      </div>
    </template>
  </Dialog>
  <div class="card">
    <div class="p-fluid m-2 mx-4">
      <div class="flex">
        <div class="col-8 mb-2">
          <div>
            <h1 class="text-2xl font-bold">
              สรุปรายการสั่งซื้อ
            </h1>
            <hr>
          </div>
          <div class="field">
            <DataTable v-model:selection="selectedProduct" :value="orderList" selectionMode="single" responsiveLayout="scroll">
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
              <template v-slot:footer>
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
              </template>
            </DataTable>
          </div>
        </div>
        <div class="col-1">
          <Divider layout="vertical" />
        </div>
        <div class="col-3">
          <div>
            <h1 class="text-2xl font-bold">
              ชำระเงิน
            </h1>
            <div v-html="parliamentSVG" />
            <hr>
            <div class="field">
              <label for="file" class="font-bold">อัพโหลดสลิป</label>
              <FileUpload name="image" url="/api/upload" customUpload chooseLabel="เลือกไฟล์" uploadLabel="อัพโหลดสลิป" :multiple="false" accept="image/*" :maxFileSize="1000000" :showCancelButton="false" @uploader="onAdvancedUpload">
                <template v-slot:empty>
                  <p>ลากไฟล์มาวางหรือคลิกปุ่มเพื่ออัพโหลด</p>
                </template>
              </FileUpload>
            </div>
            <div class="field">
              <label for="address" class="font-bold">ที่อยู่จัดส่ง</label>
              <div v-for="item, index in address" :key="index">
                <div class="flex justify-content-between">
                  <div>
                    <RadioButton v-model="selectedAddress" :value="item" />
                  </div>
                  <div>
                    <div class="font-bold">
                      {{ item.label }}
                    </div>
                  </div>
                </div>
                <hr>
              </div>
            </div>
            <Button v-if="image !== '' && selectedAddress !== null" label="ยืนยันการสั่งซื้อ" icon="pi pi-check" class="p-button-success" @click="confirmOrder" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { ref as StorageRef, getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import formatCurrency from '@/plugins/formatCurrency'
import generateQRcode from '@/plugins/generateQRcode'
import OrderData from '@/composables/orders'
import PaymentData from '@/composables/payments'
import ProductData from '@/composables/products'
import db from '@/main'

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

interface AddressState {
  address_id: string
  address_info: any
  sub_district: string
  district: string
  province: string
  zip: string
  length: number
}

const stateAddress = ref<AddressState>({
  address_id: '',
  address_info: '',
  sub_district: '',
  district: '',
  province: '',
  zip: '',
  length: 0,
})

const selectedProduct = ref()
const isLoggedin = ref(true)
const showMessage = ref(false)
const router = useRouter()

const toast = useToast()
function showSuccess(detail: string) {
  toast.add({ severity: 'success', summary: 'Success Message', detail, life: 3000 })
}
function showError(summary: string, detail: string, life: number) {
  toast.add({ severity: 'error', summary, detail, life })
}

function toggleDialog() {
  showMessage.value = !showMessage.value

  if (!showMessage.value)
    router.push({ name: 'Home' })
}

const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=59bf9fe8-8848-4e48-9681-4d66bb17dd5f')

function createId() {
  const id = ref('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const char = ref('')
  for (let i = 0; i < 10; i++)
    char.value += chars.charAt(Math.floor(Math.random() * chars.length))

  id.value = `payment_${char.value}`

  return id
}

const parliamentSVG = ref<any>('')

const user_id = ref<any>()
const orderData = OrderData()
const paymentData = PaymentData()
const productData = ProductData()
const orders = ref<any>({
  data: [],
})

const orderList = computed(() => {
  return orders.value.data.filter((order: any) => order.order_status === 'waiting_for_payment')
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

watch([
  () => orderList.value,
  () => sumPrice.value,
],
() => {
  getQRcode()
},
{ deep: true },
)

async function getQRcode() {
  const data = await generateQRcode(sumPrice.value)
  parliamentSVG.value = data.value
}

const fileName = ref('')
const image = ref('')

function onAdvancedUpload(event: any) {
  const storage = getStorage()

  const file = event.files[0].name
  // rename to new file name no space and special character
  const newFile = file.replace(/[^a-zA-Z0-9.]/g, '_')
  // change file name with new file name
  const newFileName = `${createId().value}_${newFile}`

  fileName.value = newFileName

  const storageRef = StorageRef(storage, `payment/${newFileName}`)

  // Upload the file
  uploadBytes(storageRef, event.files[0]).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL: any) => {
      image.value = downloadURL
    })
  })

  showSuccess('อัพโหลดสลิปเรียบร้อย')
}

const products = ref<any>({
  data: [],
})

const productList = computed(() => products.value.data)

async function getAllProducts() {
  products.value.data = await productData.getAllProducts()
}

const selectedAddress = ref<any>()

function confirmOrder() {
  const orderId: any = []
  const payment_id = createId().value
  const userId: any = {
    user_id: user_id.value,
    firstname: state.value.firstname,
    lastname: state.value.lastname,
  }
  const order_status = 'paymented'
  const payment_status = 'paymented_waiting_for_confirm'
  const payment_image = image.value
  const address: any = selectedAddress.value.value

  orderList.value.forEach((order: any, index: any) => {
    const order_id = orderList.value[index].order_id
    orderId.push({
      order_id: orderList.value[index].order_id,
      product_id: orderList.value[index].product.id,
      product_name: orderList.value[index].product.name,
      product_price: orderList.value[index].order_price,
      product_amount: orderList.value[index].quantity,
    })
    const product_quantity = productList.value.find((product: any) => product.id === orderList.value[index].product.id).quantity
    const amount = product_quantity - orderList.value[index].quantity

    productData.updateQuantityandInventoryStatus(orderList.value[index].product.id, amount)
    orderData.updateOrderStatus(order_id, order_status)
    paymentData.createPayment(payment_id, orderId, userId, payment_image, sumPrice.value, payment_status, address)
  })
  showSuccess('สั่งซื้อสินค้าเรียบร้อย')
  toggleDialog()
}

async function getAllOrders() {
  orders.value.data = await orderData.getAllOrders()
}

const address: any = computed(() => {
  return stateAddress.value
})

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
    getAddress(uid)
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

onMounted(() => {
  const auth = getAuth()
  const user = auth.currentUser
  getAddress(user)
})

async function getAddress(user: any) {
  const q = query(collection(db, 'users'), where('userId', '==', user?.uid))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      stateAddress.value = doc.data().address.map((address: any) => {
        return {
          label: address.address_info,
          value: address,
        }
      })
    })
  })
}

(async () => {
  getUserProfile()
  getAllProducts()
  getAllOrders()

  const auth = getAuth()
  const user = auth.currentUser

  getAddress(user)
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
      width: 100%;
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
