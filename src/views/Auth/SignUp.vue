<template>
  <Header />
  <div>
    <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '40%' }" position="top">
      <div class="d-flex align-items-center flex-column pt-6 px-3">
        <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }" />
        <h5>สมัครสมาชิกสำเร็จ!!</h5>
        <div class="d-flex align-items-center flex-column pt-6 px-3" :style="{ lineHeight: 1.5, textIndent: '1rem' }">
          บัญชีของคุณได้ถูกสร้างเรียบร้อยแล้ว กรุณาทำการยืนยันอีเมลของคุณ <b>{{ state.email }}</b> หากไม่พบอีเมลในกล่องข้อความ กรุณาตรวจสอบในกล่องข้อความขยะ
        </div>
      </div>
      <template v-slot:footer>
        <div class="flex justify-content-center">
          <Button label="OK" class="p-button-text" @click="toggleDialog" />
        </div>
      </template>
    </Dialog>

    <Card class="card-custom mt-5">
      <template v-slot:title>
        <div class="card-custom-title">
          สมัครสมาชิก
        </div>
      </template>
      <template v-slot:content>
        <div class="p-fluid">
          <FormKit
            type="form"
            :formClass="submitted ? 'hide' : 'show'"
            submitLabel="สมัครสมาชิก"
            :actions="false"
            @submit="handleSubmit"
          >
            <div class="row">
              <div class="col mb-2">
                <label for="email">อีเมล<span class="text-danger">*</span></label>
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
              <div class="col mb-2">
                <label for="phone">เบอร์โทรศัพท์<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.phone"
                  type="tel"
                  placeholder="xxx-xxx-xxxx"
                  validation="required|matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
                  :validationMessages="{
                    matches: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง ตามรูปแบบ xxx-xxx-xxxx',
                    required: 'จำเป็นต้องกรอกเบอร์โทรศัพท์',
                  }"
                  prefixIcon="telephone"
                  validationVisibility="dirty"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-2">
                <label for="password">รหัสผ่าน<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.password"
                  type="password"
                  name="password"
                  validation="required|length:8|matches:/[^a-zA-Z]/"
                  :validationMessages="{
                    matches: 'รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว ตัวอักษรพิเศษเช่น !@#$%^&*()_+',
                    required: 'จำเป็นต้องกรอกรหัสผ่าน',
                    length: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
                  }"
                  prefixIcon="password"
                  suffixIcon="eyeClosed"
                  @suffixIconClick="handleIconClick"
                />
              </div>
              <div class="col mb-2">
                <label for="password_confirm">ยืนยันรหัสผ่าน<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.confirmPassword"
                  type="password"
                  name="password_confirm"
                  validation="required|confirm"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกยืนยันรหัสผ่าน',
                    confirm: 'รหัสผ่านไม่ตรงกัน',
                  }"
                  prefixIcon="password"
                  suffixIcon="eyeClosed"
                  @suffixIconClick="handleIconClick"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-2">
                <label for="firstname">ชื่อ<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.firstname"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกชื่อ',
                  }"
                  prefixIcon="text"
                />
              </div>
              <div class="col mb-2">
                <label for="lastname">นามสกุล<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.lastname"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกนามสกุล',
                  }"
                  prefixIcon="text"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-2">
                <label for="address">ที่อยู่<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.address"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกที่อยู่',
                  }"
                  prefixIcon="text"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-2">
                <label for="sub_district">ตำบล<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.sub_district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกตำบล',
                  }"
                  prefixIcon="text"
                />
              </div>
              <div class="col mb-2">
                <label for="district">อำเภอ<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกอำเภอ',
                  }"
                  prefixIcon="text"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-2">
                <label for="province">จังหวัด<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.province"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกจังหวัด',
                  }"
                  prefixIcon="text"
                />
              </div>
              <div class="col mb-2">
                <label for="zip">รหัสไปรษณีย์<span class="text-danger">*</span></label>
                <FormKit
                  v-model="state.zip"
                  type="text"
                  validation="required|matches:/[0-9]/"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกรหัสไปรษณีย์',
                    matches: 'รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น',
                  }"
                  prefixIcon="text"
                />
              </div>
            </div>
            <Button type="submit" label="สมัครสมาชิก" class="mt-2 p-button-secondary" />
          </FormKit>
        </div>
      </template>
    </Card>
  </div>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import Header from '../../components/Header/Header.vue'
import UserData from '../../../projfoodApi/users'

interface RegisterState {
  email: string
  password: string
  confirmPassword: string
  firstname: string
  lastname: string
  phone: string
  address: string
  sub_district: string
  district: string
  province: string
  zip: string
}

const users = UserData()

const state = reactive<RegisterState>({
  email: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
  phone: '',
  address: '',
  sub_district: '',
  district: '',
  province: '',
  zip: '',
})

const submitted = ref(false)
const showMessage = ref(false)

const resetForm = () => {
  state.email = ''
  state.password = ''
  state.confirmPassword = ''
  state.firstname = ''
  state.lastname = ''
  state.phone = ''
  state.address = ''
  state.sub_district = ''
  state.district = ''
  state.province = ''
  state.zip = ''
  submitted.value = false
}

const router = useRouter()
const toast = useToast()
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successful registration', life: 3000 })
}
const showError = () => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please fill in the required fields', life: 3000 })
}

const handleIconClick = (node: any) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

const toggleDialog = () => {
  showMessage.value = !showMessage.value

  if (!showMessage.value) {
    resetForm()
    router.push({ name: 'Home' })
  }
}

const handleSubmit = () => {
  // Let's pretend this is an ajax request:
  submitted.value = true

  createUserWithEmailAndPassword(getAuth(), state.email, state.password)
    .then((data) => {
      users.writeUserData(data.user.uid, state.email, state.firstname, state.lastname, state.phone, state.address, state.sub_district, state.district, state.province, state.zip)
      showSuccess()
      toggleDialog()
    })
    .catch((error) => {
      console.log('Error creating user account: ', error.code)
      alert(error.message)
    })
}
</script>

<style lang="scss" scoped>
.card-custom {
  max-width: 1000px;
  margin: 0 auto;
  .card-custom-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

}
</style>
