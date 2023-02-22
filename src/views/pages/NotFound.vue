<template>
  <Card class="card-tab mt-4">
    <template v-slot:content>
      <div class="flex align-items-center justify-content-center max-h-screen max-w-screen">
        <div class="flex flex-column align-items-center justify-content-center">
          <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
            <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
              <span class="text-blue-500 font-bold text-3xl">404</span>
              <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
                Not Found
              </h1>
              <div class="text-600 mb-5">
                ไม่พบหน้าที่คุณต้องการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
  .card-tab{
      margin: 0 auto;
      width: 100%;
      max-width: max-content;

  }
</style>
