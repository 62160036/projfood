<template>
  <Dialog v-model:visible="displayModal" header="Sign In" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '30%' }" :modal="true">
    <div>
      <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="mb-4">
          <div class="p-float-label">
            <InputText id="username" v-model="v$.username.$model" :class="{ 'p-invalid': v$.username.$invalid && submitted }" />
            <label for="username" :class="{ 'p-error': v$.username.$invalid && submitted }">Username:</label>
          </div>
          <small v-if="(v$.username.$invalid && submitted)" class="p-error">{{ v$.username.required.$message.replace('Value', 'Username') }}</small>
        </div>
        <div class="mb-0">
          <div class="p-float-label">
            <Password id="password" v-model="v$.password.$model" :class="{ 'p-invalid': v$.password.$invalid && submitted }" toggleMask :feedback="false">
              <template v-slot:footer>
                <p class="mt-2">
                  Suggestions
                </p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>Minimum 8 characters</li>
                </ul>
              </template>
            </Password>
            <label for="password" :class="{ 'p-error': v$.password.$invalid && submitted }">Password<span class="text-danger">*</span></label>
          </div>
        </div>
        <div class="mb-3">
          <a href="#" class="link-primary text-remove-underline">Forgot password?</a>
        </div>
        <div class="mb-3">
          <Button type="submit" label="Sign In" class="mt-2 p-button-secondary" />
        </div>
        <div class="mb-3">
          <label class="me-1">Not yet a member?</label>
          <a class="link-primary text-remove-underline" @click="goToSignUp">
            Signup Now
          </a>
        </div>
      </form>
    </div>
  </Dialog>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, reactive, ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Button from 'primevue/button'

interface signInState {
  username: string
  password: string
}

const state = reactive<signInState>({
  username: '',
  password: '',

})

const rules = computed(() => {
  return {
    username: { required },
    password: { required, minLength: minLength(8) },
  }
})
const submitted = ref(false)
const showMessage = ref(false)

const v$ = useVuelidate(rules, state)
const resetForm = () => {
  state.username = ''
  state.password = ''
  submitted.value = false
}

const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successful registration', life: 3000 })
}
const showError = () => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please fill in the required fields', life: 3000 })
}

const handleSubmit = (isFormValid: any) => {
  submitted.value = true

  if (!isFormValid)
    return showError()
  showSuccess()
}

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
