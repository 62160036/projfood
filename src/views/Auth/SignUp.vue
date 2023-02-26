<template>
  <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '40%' }" position="top">
    <div class="flex align-items-center flex-column pt-6 px-3">
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
          <div class="flex">
            <div class="col mb-2">
              <label for="email">อีเมล<span class="text-red-500">*</span></label>
              <FormKit
                v-model="state.email"
                help="กดปุ่มไอคอนเพื่อตรวจสอบว่ามีอีเมลนี้ในระบบหรือไม่"
                type="email"
                validation="required|email"
                :validationMessages="{
                  required: 'จำเป็นต้องกรอกอีเมล',
                  email: 'กรุณากรอกอีเมลให้ถูกต้อง',
                }"
                prefixIcon="email"
                suffixIcon="check"
                validationVisibility="dirty"
                @suffixIconClick="checkDuplicateEmail"
              />
            </div>
            <div class="col mb-2">
              <label for="phone">เบอร์โทรศัพท์<span class="text-red-500">*</span></label>
              <FormKit
                v-model="state.phone"
                type="mask"
                name="phone"
                mode="select"
                mask="0##-###-####"
                :tokens="{
                  '#': {
                    selectFill: '0',
                  },
                }"
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
          <div class="flex">
            <div class="col mb-2">
              <label for="password">รหัสผ่าน<span class="text-red-500">*</span></label>
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
              <label for="password_confirm">ยืนยันรหัสผ่าน<span class="text-red-500">*</span></label>
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
          <div class="flex">
            <div class="col mb-2">
              <label for="firstname">ชื่อ<span class="text-red-500">*</span></label>
              <FormKit
                v-model="state.firstname"
                type="text"
                validation="required"
                :validationMessages="{
                  required: 'จำเป็นต้องกรอกชื่อ',
                }"
              />
            </div>
            <div class="col mb-2">
              <label for="lastname">นามสกุล<span class="text-red-500">*</span></label>
              <FormKit
                v-model="state.lastname"
                type="text"
                validation="required"
                :validationMessages="{
                  required: 'จำเป็นต้องกรอกนามสกุล',
                }"
              />
            </div>
          </div>
          <div v-for="item, index in state.address" :key="index" class="row">
            <div class="flex">
              <div class="col mb-2">
                <label for="address">ที่อยู่<span class="text-red-500">*</span></label>
                <FormKit
                  v-model="item.address_info"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกที่อยู่',
                  }"
                />
              </div>
            </div>
            <div class="flex">
              <div class="col mb-2">
                <label for="sub_district">ตำบล<span class="text-red-500">*</span></label>
                <FormKit
                  v-model="item.sub_district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกตำบล',
                  }"
                />
              </div>
              <div class="col mb-2">
                <label for="district">อำเภอ<span class="text-red-500">*</span></label>
                <FormKit
                  v-model="item.district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกอำเภอ',
                  }"
                />
              </div>
            </div>
            <div class="flex">
              <div class="col mb-2">
                <label for="province">จังหวัด<span class="text-red-500">*</span></label>
                <FormKit
                  v-model="item.province"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกจังหวัด',
                  }"
                />
              </div>
              <div class="col mb-2">
                <label for="zip">รหัสไปรษณีย์<span class="text-red-500">*</span></label>
                <FormKit
                  v-model="item.zip"
                  type="text"
                  validation="required|matches:/[0-9]/"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกรหัสไปรษณีย์',
                    matches: 'รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น',
                  }"
                />
              </div>
            </div>
          </div>
          <Button type="submit" label="สมัครสมาชิก" class="mt-2 p-button-secondary" />
        </FormKit>
      </div>
    </template>
  </Card>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth'
import { collection, getDocs, query, where } from '@firebase/firestore'
import UserData from '@/composables/users'
import db from '@/main'

interface RegisterState {
  email: string
  password: string
  confirmPassword: string
  firstname: string
  lastname: string
  phone: string
  address: Address[]
}

interface Address {
  address_info: string
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
  address: [
    {
      address_info: '',
      sub_district: '',
      district: '',
      province: '',
      zip: '',
    },
  ],
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
  state.address = [
    {
      address_info: '',
      sub_district: '',
      district: '',
      province: '',
      zip: '',
    },
  ]
  submitted.value = false
}

const router = useRouter()
const toast = useToast()

const showToast = (severity: string, summary: string, detail: string, life: number) => {
  toast.add({ severity, summary, detail, life })
}

const handleIconClick = (node: any) => {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

const checkDuplicateEmail = async (node: any) => {
  const q = query(collection(db, 'users'), where('email', '==', state.email))
  const email = ref('')
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    email.value = doc.data().email
  })

  if (state.email === email.value && state.email !== '') {
    node.props.suffixIcon = node.props.suffixIcon === 'check' ? 'check' : 'check'
    showToast('error', 'Error Message', 'อีเมลนี้มีผู้ใช้งานแล้ว', 3000)
  }
  else if (state.email !== email.value && state.email !== '') {
    node.props.suffixIcon = node.props.suffixIcon === 'check' ? 'check' : 'check'
    showToast('success', 'Success Message', 'อีเมลนี้สามารถใช้งานได้', 3000)
  }
}

const toggleDialog = () => {
  showMessage.value = !showMessage.value

  if (!showMessage.value) {
    resetForm()
    router.push({ name: 'Home' })
  }
}

async function handleSubmit() {
  submitted.value = true
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, state.email, state.password)
    .then((data) => {
      sendEmailVerification(data.user)
      const address: any = state.address.map((item) => {
        return {
          address_info: item.address_info,
          sub_district: item.sub_district,
          district: item.district,
          province: item.province,
          zip: item.zip,
        }
      })
      users.createUser(data.user.uid, state.email, state.firstname, state.lastname, state.phone, address)

      showToast('success', 'Success Message', 'สมัครสมาชิกสำเร็จ', 3000)
      toggleDialog()
    })
    .catch((error) => {
      showToast('error', error.code, error.message, 3000)
    })
}
</script>

<style lang="scss" scoped>
.card-custom {
  max-width: max-content;
  margin: 0 auto;
  .card-custom-title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
  }
}
</style>
