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
        <Form
          :validationSchema="schema"
          @submit="onSubmit"
        >
          <div class="flex">
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="email">
                <label for="email">อีเมล<span class="text-red-500">*</span></label>
                <InputText
                  v-bind="field"
                  v-model="state.email"
                  aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="phone">
                <label for="phone">เบอร์โทรศัพท์<span class="text-red-500">*</span></label>
                <InputMask
                  v-bind="field"
                  v-model="state.phone"
                  mask="999-999-9999"
                  placeholder="999-999-9999"
                  :class="{ 'p-invalid': errorMessage }"
                  aria-describedby="mask-error"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
          </div>

          <div class="flex">
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="firstname">
                <label for="firstname">ชื่อ<span class="text-red-500">*</span></label>
                <InputText
                  v-bind="field"
                  v-model="state.firstname"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="lastname">
                <label for="lastname">นามสกุล<span class="text-red-500">*</span></label>
                <InputText
                  v-bind="field"
                  v-model="state.lastname"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
          </div>

          <div class="flex">
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="password">
                <label for="password">รหัสผ่าน<span class="text-red-500">*</span></label>
                <Password
                  v-bind="field"
                  v-model="state.password"
                  aria-describedby="password-help"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="confirmPassword">
                <label for="password">ยืนยันรหัสผ่าน<span class="text-red-500">*</span></label>
                <Password
                  v-bind="field"
                  v-model="state.confirmPassword"
                  aria-describedby="password-help"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
          </div>

          <div v-for="item, index in state.address" :key="index" class="row">
            <div class="col mb-2">
              <Field v-slot="{ field, errorMessage }" name="address_info">
                <label for="address_info">ที่อยู่<span class="text-red-500">*</span></label>
                <InputText
                  v-bind="field"
                  v-model="item.address_info"
                  aria-describedby="address-help"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="flex">
              <div class="col mb-2">
                <Field v-slot="{ field, errorMessage }" name="sub_district">
                  <label for="sub_district">ตำบล<span class="text-red-500">*</span></label>
                  <InputText
                    v-bind="field"
                    v-model="item.sub_district"
                    aria-describedby="sub_district-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="col mb-2">
                <Field v-slot="{ field, errorMessage }" name="district">
                  <label for="district">อำเภอ<span class="text-red-500">*</span></label>
                  <InputText
                    v-bind="field"
                    v-model="item.district"
                    aria-describedby="district-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>
            <div class="flex">
              <div class="col mb-2">
                <Field v-slot="{ field, errorMessage }" name="province">
                  <label for="province">จังหวัด<span class="text-red-500">*</span></label>
                  <InputText
                    v-bind="field"
                    v-model="item.province"
                    aria-describedby="province-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="col mb-2">
                <Field v-slot="{ field, errorMessage }" name="zip">
                  <label for="zip">รหัสไปรษณีย์<span class="text-red-500">*</span></label>
                  <InputText
                    v-bind="field"
                    v-model="item.zip"
                    aria-describedby="zip-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>
          </div>

          <div class="footer">
            <Button label="สมัครสมาชิก" type="submit" />
          </div>
        </Form>
      </div>
    </template>
  </Card>
  <Toast position="bottom-left" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from '@firebase/auth'
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

function resetForm() {
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

const schema = yup.object({
  email: yup.string().required().email().label('Email address')
    .test('is-duplicate-email', 'Email already exists', async (value) => {
      const q = query(collection(db, 'users'), where('email', '==', value))
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty
    }),
  password: yup.string().required().min(6).label('Password'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm Password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  firstname: yup.string().required().label('Firstname'),
  lastname: yup.string().required().label('Lastname'),
  phone: yup.string().required().label('Phone'),
  address_info: yup.string().required().label('Address Info'),
  sub_district: yup.string().required().label('Sub District'),
  district: yup.string().required().label('District'),
  province: yup.string().required().label('Province'),
  zip: yup.string().required().label('Zip'),
})

function showToast(severity: string, summary: string, detail: string, life: number) {
  toast.add({ severity, summary, detail, life })
}

function toggleDialog() {
  showMessage.value = !showMessage.value

  if (!showMessage.value) {
    resetForm()
    router.push({ name: 'Home' })
  }
}

async function onSubmit() {
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
