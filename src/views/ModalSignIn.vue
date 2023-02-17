<template>
  <Dialog v-model:visible="displayModal" header="Sign In" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }" :modal="true">
    <div>
      <div class="mb-3">
        <label class="form-label">Username:</label>
        <input class="form-control" placeholder="username">
      </div>
      <div class="mb-0">
        <label for="password" class="form-label">Password:</label>
        <input class="form-control" placeholder="password">
      </div>
      <div class="mb-3">
        <a href="#" class="link-primary text-remove-underline">Forgot password?</a>
      </div>
      <div class="mb-3">
        <button type="button" class="btn btn-dark w-100">
          Login
        </button>
      </div>
      <div class="mb-3">
        <label class="me-1">Not yet a member?</label>
        <a class="link-primary text-remove-underline" @click="goToSignUp">
          Signup Now
        </a>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
const displayModal = ref(false)

const router = useRouter()

function goToSignUp() {
  router.push('/sign-up')
}

function openModal() {
  displayModal.value = true
}

defineExpose({
  openModal,
})
</script>

<style lang="scss" scoped>
.icon-header {
  cursor: pointer;
}
.text-header {
  font-size: 24px;
  font-weight: 700;
}
.text-remove-underline {
  text-decoration: none;
  cursor: pointer;
}
.p-button {
    margin: 0.3rem .5rem;
    min-width: 10rem;
}

p {
    margin: 0;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-dialog .p-button {
    min-width: 6rem;
}
</style>
