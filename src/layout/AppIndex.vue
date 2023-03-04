<template>
  <div class="main-container">
    <Header />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
</script>

  <style lang="scss" scoped>
  .main-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      justify-content: space-between;
      padding: 16rem 2rem 2rem 4rem;
      transition: margin-left 0.2s;
  }
  </style>
