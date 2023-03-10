<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem :item="item" :index="i" />
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }],
  },
  {
    label: 'manage manu',
    items: [
      { label: 'User Manage', icon: 'pi pi-fw pi-id-card', to: '/user/manage' },
      { label: 'Product Manage', icon: 'pi pi-fw pi-shopping-bag', to: '/product/manage' },
      { label: 'Order Manage', icon: 'pi pi-fw pi-list', to: '/order/manage' },
      { label: 'Report Manage', icon: 'pi pi-fw pi-file', to: '/report/manage' },
    ],
  },

])
</script>

<style lang="scss" scoped></style>
