<template>
  <div class="logo" @click="goToHome">
    <label class="logo-text d-flex justify-content-center align-items-center h-100">
      Logo
    </label>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.logo {
  width: 200px;
  height: 100px;
  background-color: #FEC8D8;

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #000;
    cursor: pointer;
  }
}
</style>
