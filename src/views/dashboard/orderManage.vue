<template>
  <div class="-mt-5">
    <div class="card">
      <h5>จัดการออเดอร์</h5>
      <DataTable
        v-model:filters="filters" :value="orderList" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
        :globalFilterFields="['name', 'order_id', 'total_price', 'date']"
        filterDisplay="row" :loading="loading"
      >
        <template v-slot:header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.global.value" placeholder="ค้นหาออเดอร์" />
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
        <Column field="order_id" header="Order ID">
          <template v-slot:body="slotProps">
            {{ slotProps.data.order_id }}
          </template>
        </Column>
        <Column field="date" header="Order Date">
          <template v-slot:body="slotProps">
            {{ dateConverter(slotProps.data.order_date) }}
          </template>
        </Column>
        <Column field="total_price" header="Order Date">
          <template v-slot:body="slotProps">
            {{ formatCurrency(slotProps.data.total_price) }}
          </template>
        </Column>
        <Column field="order_status" header="Order Status">
          <template v-slot:body="slotProps">
            {{ slotProps.data.order_status === 'waiting_for_payment' ? 'รอการชำระเงิน' : 'ชำระเงินแล้ว' }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { computed, ref } from 'vue'
import OrderData from '@/composables/orders'
import { dateConverter } from '@/plugins/dateConverter'
import formatCurrency from '@/plugins/formatCurrency'

const loading = ref(true)

const orderData = OrderData()
const orders = ref<any>({
  data: [],
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  order_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  total_price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
})

const orderList = computed(() => {
  return orders.value.data
})

async function getAllOrders() {
  orders.value.data = await orderData.getAllOrders()
}

(async () => {
  getAllOrders()

  loading.value = false
})()
</script>

<style scoped>

</style>
