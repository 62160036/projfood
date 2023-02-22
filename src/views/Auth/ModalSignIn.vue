<template>
  <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '40%' }" position="top">
    <div class="d-flex align-items-center flex-column pt-6 px-3">
      <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }" />
      <h5>ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว</h5>
      <div class="d-flex align-items-center flex-column pt-6 px-3" :style="{ lineHeight: 1.5, textIndent: '1rem' }">
        บัญชีของคุณได้ส่งอีเมลรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว <b>{{ state.email }}</b> กรุณาตรวจสอบอีเมลของคุณ และกรอกรหัสผ่านใหม่
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-content-center">
        <Button label="OK" class="p-button-text" @click="toggleDialog" />
      </div>
    </template>
  </Dialog>
  <Dialog v-if="isLogin" v-model:visible="displayModal" header="เข้าสู่ระบบ" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '25%' }" :modal="true">
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
        <a href="#" class="link-primary text-remove-underline" @click="isLogin = false">ลืมรหัสผ่าน?</a>
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
  </Dialog>
  <Dialog v-else v-model:visible="displayModal" header="ลืมรหัสผ่าน" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '25%' }" :modal="true">
    <FormKit
      type="form"
      :formClass="submitted ? 'hide' : 'show'"
      submitLabel="ลืมรหัสผ่าน"
      :actions="false"
      @submit="forgotPassword"
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
      <div class="mb-3">
        <Button label="เข้าสู่ระบบ" class="mt-2 p-button-danger" @click="isLogin = true" />
        <Button type="submit" label="ส่งอีเมลรีเซ็ตรหัสผ่าน" class="mt-2 p-button-secondary" />
      </div>
    </FormKit>
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
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@firebase/auth'

interface signInState {
  email: string
  password: string
}

const isLogin = ref(true)
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
const showMessage = ref(false)

const toggleDialog = () => {
  showMessage.value = !showMessage.value

  if (!showMessage.value) {
    resetForm()
    router.push({ name: 'Home' })
  }
}

const toast = useToast()
const showSuccess = (detail: string) => {
  toast.add({ severity: 'success', summary: 'Success Message', detail, life: 3000 })
}
const showError = (summary: string, detail: string, life: number) => {
  toast.add({ severity: 'error', summary, detail, life })
}

const handleSubmit = () => {
  submitted.value = true
  const auth = getAuth()

  signInWithEmailAndPassword(auth, state.email, state.password)
    .then(() => {
      showSuccess('เข้าสู่ระบบสำเร็จ')
      resetForm()
      displayModal.value = false
      router.push('/')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      showError(errorCode, errorMessage, 3000)
    })
}

const forgotPassword = () => {
  submitted.value = true
  const auth = getAuth()

  if (isLogin.value === false) {
    sendPasswordResetEmail(auth, state.email)
      .then(() => {
        showSuccess('ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ')
        displayModal.value = false
        toggleDialog()
        resetForm()
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        showError(errorCode, errorMessage, 3000)
      })
  }
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
