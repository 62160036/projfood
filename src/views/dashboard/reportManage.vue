<template>
  <div class="-mt-5">
    <div class="card">
      <h5>จัดการรีพอร์ต</h5>
      <DataTable
        v-model:filters="filters" :value="paymentList" scrollable scrollHeight="750px" tableStyle="min-width: 50rem"
        :globalFilterFields="['name', 'order_id', 'total_price', 'date']"
        filterDisplay="row" :loading="loading"
      >
        <template v-slot:header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.global.value" placeholder="ค้นหา" />
            </span>
          </div>
        </template>
        <template v-slot:empty>
          <div class="p-d-flex p-ai-center p-jc-center" style="height: 100%">
            <span>ไม่พบข้อมูล</span>
          </div>
        </template>
        <Column field="name" header="Name">
          <template v-slot:body="slotProps">
            {{ slotProps.data.users.firstname }} {{ slotProps.data.users.lastname }}
          </template>
        </Column>
        <Column header="รูป">
          <template v-slot:body="slotProps">
            <Image
              :src="`${slotProps.data.payment_image === '' ? noImage : slotProps.data.payment_image}`"
              :alt="slotProps.data.payment_image" class="product-image" width="50" preview
            />
          </template>
        </Column>
        <Column field="payment_id" header="Payment ID">
          <template v-slot:body="slotProps">
            {{ slotProps.data.payment_id }}
          </template>
        </Column>
        <Column field="date" header="Payment Date">
          <template v-slot:body="slotProps">
            {{ dateConverter(slotProps.data.payment_date) }}
          </template>
        </Column>
        <Column field="total_price" header="Payment Date">
          <template v-slot:body="slotProps">
            {{ formatCurrency(slotProps.data.total_price) }}
          </template>
        </Column>
        <Column field="order_status" header="Payment Status">
          <template v-slot:body="slotProps">
            {{ slotProps.data.payment_status === 'paymented_waiting_for_confirm' ? 'รอการยืนยัน' : 'ยืนยันแล้ว' }}
          </template>
        </Column>
        <Column field="action" header="Action" style="width:20%">
          <template v-slot:body="slotProps">
            <InputSwitch v-if="slotProps.data.payment_status === 'paymented_waiting_for_confirm'" @input="updatePaymentStatus(slotProps.data.payment_id, slotProps.data.payment_status = 'paymented_confirmed')" />
            <InputSwitch v-else v-model="checked" @input="updatePaymentStatus(slotProps.data.payment_id, slotProps.data.payment_status = 'paymented_waiting_for_confirm')" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { computed, ref } from 'vue'
import { dateConverter } from '@/plugins/dateConverter'
import formatCurrency from '@/plugins/formatCurrency'
import PaymentData from '@/composables/payments'

const checked = ref(true)
const loading = ref(true)
const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=e6b54247-37f3-4bfa-a584-dd52122a4673')
const paymentData = PaymentData()
const payments = ref<any>({
  data: [],
})

const paymentList = computed(() => {
  return payments.value.data
})

async function getAllPayments() {
  payments.value.data = await paymentData.getAllPayments()
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  order_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  total_price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
})

async function updatePaymentStatus(payment_id: any, payment_status: any) {
  await paymentData.updatePaymentStatus(payment_id, payment_status)
  getAllPayments()
}

(async () => {
  getAllPayments()

  loading.value = false
})()
</script>

<style lang="scss" scoped>
.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
