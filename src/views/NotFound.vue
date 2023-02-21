<template>
  <Header />
  <Card class="card-tab mt-4">
    <template v-slot:title>
      404 Not Found
    </template>
    <template v-slot:content>
      404 Not Found
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
  </style>
