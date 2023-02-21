<template>
  <Header />
  <Card class="card-tab mt-4">
    <template v-slot:title>
      <i :class="items[active].icon" class="me-2" />{{ items[active].label }}
    </template>
    <template v-slot:content>
      <TabMenu v-model:activeIndex="active" :model="items" />
      <RouterView />
    </template>
  </Card>
</template>

<script setup lang="ts">
import TabMenu from 'primevue/tabmenu'
import Card from 'primevue/card'
import { ref } from 'vue'
import { Header } from '../../../components/Header'

const active = ref(0)
const items = ref([
  {
    label: 'ข้อมูลส่วนตัว',
    icon: 'pi pi-fw pi-user-edit',
    to: '/settings/profile',
  },
  {
    label: 'ข้อมูลการจัดส่ง',
    icon: 'pi pi-fw pi-truck',
    to: '/settings/shipping',
  },
  {
    label: 'ประวัติการสั่งซื้อ',
    icon: 'pi pi-fw pi-history',
    to: '/settings/orderHistory',
  },

])
</script>

<style lang="scss" scoped>
::v-deep(.tabmenudemo-content) {
    padding: 2rem 1rem;
}
.card-tab{
    margin: 0 auto;
    width: 100%;
    max-width: 1000px;

}
</style>
