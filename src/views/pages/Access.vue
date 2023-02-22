<template>
  <Card class="card-tab mt-4">
    <template v-slot:content>
      <div class="flex align-items-center justify-content-center max-h-screen max-w-screen">
        <div class="flex flex-column align-items-center justify-content-center">
          <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
            <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
              <div class="grid flex flex-column align-items-center">
                <div class="flex justify-content-center align-items-center bg-orange-500 border-circle" style="width: 3.2rem; height: 3.2rem">
                  <i class="text-50 pi pi-fw pi-lock text-2xl" />
                </div>
                <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">
                  Access Denied
                </h1>
                <span class="text-600 mb-5">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ</span>
                <Image src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-5" width="250" />
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
