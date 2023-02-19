<template>
  <Dialog v-model:visible="displayModal" header="เข้าสู่ระบบ" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '25%' }" :modal="true">
    <div>
      <FormKit
        type="form"
        :formClass="submitted ? 'hide' : 'show'"
        submitLabel="เข้าสู่ระบบ"
        :actions="false"
        @submit="handleSubmit"
      >
        <div class="mb-2">
          <label for="email">อีเมล:</label>
          <FormKit
            v-model="state.email"
            type="email"
            validation="required|email"
            :validationMessages="{
              required: 'จำเป็นต้องกรอกอีเมล',
              email: 'กรุณากรอกอีเมลให้ถูกต้อง',
            }"
            prefixIcon="email"
            validationVisibility="dirty"
          />
        </div>
        <div class="mb-2">
          <label for="password">รหัสผ่าน:</label>
          <FormKit
            v-model="state.password"
            type="password"
            name="password"
            validation="required"
            :validationMessages="{
              required: 'จำเป็นต้องกรอกรหัสผ่าน',
            }"
            prefixIcon="password"
            suffixIcon="eyeClosed"
            @suffixIconClick="handleIconClick"
          />
        </div>
        <div class="mb-3">
          <a href="#" class="link-primary text-remove-underline">ลืมรหัสผ่าน?</a>
        </div>
        <div class="mb-3">
          <Button type="submit" label="เข้าสู่ระบบ" class="mt-2 p-button-secondary" />
        </div>
        <div class="mb-3">
          <label class="me-1">ยังไม่มีบัญชีใช่ไหม?</label>
          <a class="link-primary text-remove-underline" @click="goToSignUp">
            ลงทะเบียนเลย
          </a>
        </div>
      </FormKit>
    </div>
  </Dialog>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth'

interface signInState {
  email: string
  password: string
}

const router = useRouter()
const state = reactive<signInState>({
  email: '',
  password: '',

})
const submitted = ref(false)

const resetForm = () => {
  state.email = ''
  state.password = ''
  submitted.value = false
}

const displayModal = ref(false)

const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'เข้าสู่ระบบสำเร็จ', life: 3000 })
}
const showError = (detail: string) => {
  toast.add({ severity: 'error', summary: 'Error Message', detail, life: 3000 })
}

const handleSubmit = () => {
  submitted.value = true
  const auth = getAuth()

  signInWithEmailAndPassword(auth, state.email, state.password)
    .then((data) => {
      showSuccess()
      resetForm()
      displayModal.value = false
      router.push('/')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
      showError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    })
}

const handleIconClick = (node: any) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

function goToSignUp() {
  router.push('/sign-up')
}

function openModal() {
  displayModal.value = true
  resetForm()
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
