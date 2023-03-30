<template>
  <div class="logo" @click="goToHome">
    <img :src="urlLogo" alt="Logo">
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const urlLogo = 'https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/image_2023-03-31_020017808.png?alt=media&token=31f57b85-8161-4676-9030-12814c54bd46'
function goToHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.logo {
  width: 200px;
  height: 100px;
  // background-color: #FEC8D8;
  cursor: pointer;

}
</style>
