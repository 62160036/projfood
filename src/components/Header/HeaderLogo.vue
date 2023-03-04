<template>
  <div class="logo" @click="goToHome">
    <!-- <img :src="Logo" alt="Logo"> -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// import Logo from '@/assets/icon/PimFood.svg'

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

}
</style>
