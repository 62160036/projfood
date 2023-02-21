<template>
  <Header />
  <Card class="card-tab mt-4">
    <template v-slot:title>
      <div class="card-title">
        No Permission
      </div>
    </template>
    <template v-slot:content>
      <div class="tabmenudemo-content">
        <h1>No Permission</h1>
        <p>ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { Header } from '../components/Header'
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
  .card-title{
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1.2;
      color: #495057;
      text-align: center;
  }
  .tabmenudemo-content {
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }
  </style>
