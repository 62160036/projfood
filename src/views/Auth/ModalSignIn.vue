<template>
  <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '50%' }" position="top">
    <div class="flex align-items-center flex-column pt-6 px-3">
      <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }" />
      <h5>ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว</h5>
      <div class="flex align-items-center flex-column pt-6 px-3" :style="{ lineHeight: 1.5, textIndent: '1rem' }">
        บัญชีของคุณได้ส่งอีเมลรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลของคุณ และกรอกรหัสผ่านใหม่
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-content-center">
        <Button label="OK" class="p-button-text" @click="toggleDialog" />
      </div>
    </template>
  </Dialog>
  <Dialog v-if="isLogin" v-model:visible="displayModal" header="เข้าสู่ระบบ" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: 'max-content' }" :modal="true">
    <div class="p-fluid">
      <Form
        :validationSchema="schema"
        @submit="handleSubmit"
      >
        <div class="mb-2">
          <Field v-slot="{ field, errorMessage }" name="email">
            <label for="email">อีเมล:</label>
            <InputText
              v-bind="field"
              v-model="state.email"
              aria-describedby="email-help"
              :class="{ 'p-invalid': errorMessage }"
            />
            <small class="p-error">{{ errorMessage }}</small>
          </Field>
        </div>

        <div class="mb-2">
          <Field v-slot="{ field, errorMessage }" name="password">
            <label for="password">รหัสผ่าน:</label>
            <Password
              v-bind="field"
              v-model="state.password"
              :feedback="false"
              :class="{ 'p-invalid': errorMessage }"
            />
            <small class="p-error">{{ errorMessage }}</small>
          </Field>
        </div>

        <div class="mb-3">
          <Button label="ลืมรหัสผ่าน?" class="p-button-text" @click="isLogin = false" />
        </div>

        <Button type="submit" label="เข้าสู่ระบบ" class="p-button-secondary" />

        <Button label="ยังไม่มีบัญชีใช่ไหม? ลงทะเบียนเลย" class="p-button-text" @click="goToSignUp" />
      </Form>
    </div>
  </Dialog>
  <Dialog v-else v-model:visible="displayModal" header="ลืมรหัสผ่าน" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: 'max-content' }" :modal="true">
    <div class="p-fluid">
      <form
        @submit.prevent="forgotPassword"
      >
        <div class="mb-2">
          <Field v-slot="{ field, errorMessage }" name="email">
            <label for="email">อีเมล:</label>
            <InputText
              v-bind="field"
              v-model="state.email"
              aria-describedby="email-help"
              :class="{ 'p-invalid': errorMessage }"
            />
            <small class="p-error">{{ errorMessage }}</small>
          </Field>
        </div>
        <Button label="เข้าสู่ระบบ" class="mt-2 p-button-danger" @click="isLogin = true" />
        <Button type="submit" label="ส่งอีเมลรีเซ็ตรหัสผ่าน" class="mt-2 p-button-secondary" />
      </form>
    </div>
  </Dialog>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
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

function resetForm() {
  state.email = ''
  state.password = ''
  submitted.value = false
}

const schema = yup.object({
  email: yup.string().required().email().label('Email address'),
  password: yup.string().required().min(6).label('Password'),
})

const displayModal = ref(false)
const showMessage = ref(false)

function toggleDialog() {
  showMessage.value = !showMessage.value

  if (!showMessage.value) {
    resetForm()
    router.push({ name: 'Home' })
  }
}

const toast = useToast()
function showSuccess(detail: string) {
  toast.add({ severity: 'success', summary: 'Success Message', detail, life: 3000 })
}
function showError(summary: string, detail: string, life: number) {
  toast.add({ severity: 'error', summary, detail, life })
}

function handleSubmit() {
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

function forgotPassword() {
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

function goToSignUp() {
  displayModal.value = false
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
