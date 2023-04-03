<template>
  <div class="m-2 mx-4">
    <div class="flex">
      <div class="col">
        <div class="flex justify-content-center align-items-center font-bold mb-4">
          ประวัติการสั่งซื้อ
        </div>
        <Divider />
        <div v-for="item, index in paymentList" :key="index">
          <div>
            #{{ item.payment_id }}
          </div>
          <div class="flex">
            <div class="col">
              วันที่สั่งซื้อ :
              <span class="flex">{{ dateConverter(item.payment_date) }}</span>
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col-2">
              ยอดรวม :
              <span class="flex">{{ formatCurrency(item.total_price) }}</span>
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col">
              สถานะการชำระเงิน :
              <span class="flex">{{ item.payment_status === "paymented_waiting_for_confirm" ? "ชำระเงินแล้ว" : "รอการชำระเงิน" }}</span>
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col">
              สถานะการส่งสินค้า :
              <span class="flex">{{ item.shipping_status === "shipped" ? "จัดส่งแล้ว" : "รอการจัดส่ง" }}</span>
            </div>
          </div>
          <div>
            <Button label="ดูรายละเอียด" @click="showOrderDetail(item.payment_id)" />
          </div>
          <Divider />
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="showOrderDetails" :style="{ width: '800px' }" header="Confirm" :modal="true">
    <template v-slot:header>
      รายการสั่งซื้อ #{{ paymentDetailList.payment_id }}
    </template>
    <div class="flex">
      <div class="col">
        <div class="col">
          สั่งซื้อเมื่อ : {{ datetimeConverter(paymentDetailList.payment_date, 'th-TH') }}
        </div>
        <div class="flex">
          <div class="col">
            การชำระเงิน: {{ paymentDetailList.payment_status === "paymented_waiting_for_confirm" ? "ชำระเงินแล้ว" : "รอการชำระเงิน" }}
          </div>
          <div class="col-1">
            <Divider layout="vertical" />
          </div>
          <div class="col">
            สถานะ: {{ paymentDetailList.shipping_status === "shipped" ? "จัดส่งแล้ว" : "รอการจัดส่ง" }}
          </div>
        </div>
        <div class="col">
          สินค้าที่สั่งซื้อ
        </div>
        <Divider />
        <div v-for="item, index in orderDetailList " :key="index">
          <!-- {{ item.product_name }} x {{ item.product_amount }} ชิ้น ราคา {{ formatCurrency(item.product_price) }} -->
          <div class="flex">
            <div class="col">
              {{ item.product_name }}
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col">
              x {{ item.product_amount }} ชิ้น
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col">
              ราคา {{ formatCurrency(item.product_price) }}
            </div>
          </div>
        </div>
        <Divider />
        <div class="col">
          ยอดรวม : {{ formatCurrency(paymentDetailList.total_price) }}
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import { dateConverter, datetimeConverter } from '@/plugins/dateConverter'
import formatCurrency from '@/plugins/formatCurrency'
import PaymentData from '@/composables/payments'
import db from '@/main'

interface paymentDetail {
  payment_id: string
  payment_date: Date
  payment_status: string
  shipping_status: string
  total_price: number
}

const isLoggedin = ref(true)
const showOrderDetails = ref(false)
const user_id = ref<string>()

const orderDetailList = ref<any>([])
const paymentDetailList = ref<paymentDetail>({
  payment_id: '',
  payment_date: new Date(),
  payment_status: '',
  shipping_status: '',
  total_price: 0,
})

const paymentData = PaymentData()
const payments = ref<any>({
  data: [],
})

const paymentList = computed(() => {
  return payments.value.data
})

function showOrderDetail(payment_id: string) {
  getOrderByOrderId(payment_id)
  showOrderDetails.value = true
}

async function getAllPayments() {
  payments.value.data = await paymentData.getAllPayments()
}

async function getOrderByOrderId(payment_id: string) {
  const q = query(collection(db, 'payments'), where('payment_id', '==', payment_id))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      paymentDetailList.value = {
        payment_id: doc.data().payment_id,
        payment_date: doc.data().payment_date,
        payment_status: doc.data().payment_status,
        shipping_status: doc.data().shipping_status,
        total_price: doc.data().total_price,
      }
      orderDetailList.value = doc.data().orders
    })
  })
}

(async () => {
  getAllPayments()

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

<style scoped lang="scss">
</style>
