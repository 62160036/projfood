<template>
  <header class="p-3 text-bg-light">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
      <HeaderLogo class="mx-4" />

      <form class="col col-lg col-md col-sm me-3 me-lg-3" role="search">
        <input type="search" class="form-control form-control-light text-bg-light" placeholder="ค้นหาสินค้า, หมวดหมู่" aria-label="Search">
      </form>

      <div class="text-end mt-lg-0 mt-md-0 mt-sm-0 mt-2">
        <Button label="Login" icon="pi pi-sign-in" class="me-3 p-button-secondary" @click="openModalSignIn" />
        <Button label="Register" icon="pi pi-plus-circle" class="p-button-info" @click="goToSignUp" />
      </div>
    </div>
  </header>
  <header class="p-1 text-bg-dark">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start ms-5">
      <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
        <li><a href="#" class="nav-link px-2 text-white">ผักผลไม้</a></li>
        <li><a href="#" class="nav-link px-2 text-white">เนื้อสัตว์แช่แข็ง</a></li>
        <li><a href="#" class="nav-link px-2 text-white">อาหารทะเลแช่แข็ง</a></li>
        <li><a href="#" class="nav-link px-2 text-white">อาหารสำเร็จรูป</a></li>
        <li><a href="#" class="nav-link px-2 text-white">สินค้าแนะนำ</a></li>
      </ul>
    </div>
  </header>

  <ModalSignIn ref="modalSignIn" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ModalSignIn from '../../views/ModalSignIn.vue'
import HeaderLogo from './HeaderLogo.vue'

const router = useRouter()

const modalSignIn = ref<InstanceType<typeof ModalSignIn>>(null!)

function openModalSignIn() {
  modalSignIn.value.openModal()
}

function goToSignUp() {
  router.push('/sign-up')
}
</script>

<style lang="sass" scoped>

</style>
