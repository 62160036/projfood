<template>
  <Dialog v-model:visible="displayModal" :header="`${isCreate ? 'เพิ่มที่อยู่ใหม่' : 'แก้ไขที่อยู่'}`" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }" :modal="true">
    <div class="p-fluid m-2 mx-4">
      <Form
        :validationSchema="schema"
        :initialValues="state"
        @submit="updateAddress"
      >
        <div class="flex">
          <div class="col">
            <div class="field">
              <Field v-slot="{ field, errorMessage }" name="address_info">
                <label for="address_info">ที่อยู่<span class="text-red-500">*</span></label>
                <InputText
                  v-model="state.address_info"
                  v-bind="field"
                  aria-describedby="address-help"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <small class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="grid">
              <div class="field col">
                <Field v-slot="{ field, errorMessage }" name="sub_district">
                  <label for="sub_district">ตำบล<span class="text-red-500">*</span></label>
                  <InputText
                    v-model="state.sub_district"
                    v-bind="field"
                    aria-describedby="sub_district-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="field col">
                <Field v-slot="{ field, errorMessage }" name="district">
                  <label for="district">อำเภอ<span class="text-red-500">*</span></label>
                  <InputText
                    v-model="state.district"
                    v-bind="field"
                    aria-describedby="district-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>
            <div class="grid">
              <div class="field col">
                <Field v-slot="{ field, errorMessage }" name="province">
                  <label for="province">จังหวัด<span class="text-red-500">*</span></label>
                  <InputText
                    v-model="state.province"
                    v-bind="field"
                    aria-describedby="province-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="field col">
                <Field v-slot="{ field, errorMessage }" name="zip">
                  <label for="zip">รหัสไปรษณีย์<span class="text-red-500">*</span></label>
                  <InputText
                    v-model="state.zip"
                    v-bind="field"
                    aria-describedby="zip-help"
                    :class="{ 'p-invalid': errorMessage }"
                  />
                  <small class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-content-center align-items-center font-bold mt-1rem">
          <Button type="submit" label="บันทึกการเปลี่่ยนแปลง" icon="pi pi-user-edit" class="p-button-success" />
        </div>
      </Form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { collection, getDocs, query, where } from '@firebase/firestore'
import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { Field, Form } from 'vee-validate'
import * as yup from 'yup'
import db from '@/main'
import UserData from '@/composables/users'

interface AddressState {
  address_info: string
  sub_district: string
  district: string
  province: string
  zip: string
}

const state = ref<AddressState>({
  address_info: '',
  sub_district: '',
  district: '',
  province: '',
  zip: '',
})

const schema = yup.object({
  address_info: yup.string().required().label('Address Info'),
  sub_district: yup.string().required().label('Sub District'),
  district: yup.string().required().label('District'),
  province: yup.string().required().label('Province'),
  zip: yup.string().required().label('Zip'),
})

const isCreate = ref(false)
const auth = getAuth()
const router = useRouter()
const userData = UserData()
const displayModal = ref(false)
const indexAd = ref('')
const submitted = ref(false)
const toast = useToast()
function showToast(severity: string, summary: string, detail: string, life: number) {
  toast.add({ severity, summary, detail, life })
}

async function openModal(index: string) {
  if (index === 'create') {
    isCreate.value = true
    state.value = {
      address_info: '',
      sub_district: '',
      district: '',
      province: '',
      zip: '',
    }
    displayModal.value = true
  }
  else {
    isCreate.value = false
    indexAd.value = index
    getAddress(index)
    displayModal.value = true
  }
}

async function getAddress(curIndex: string) {
  const q = query(collection(db, 'users'), where('userId', '==', auth.currentUser?.uid))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    state.value = doc.data().address[curIndex]
  })
}

function resetForm() {
  state.value = {
    address_info: '',
    sub_district: '',
    district: '',
    province: '',
    zip: '',
  }
}

async function updateAddress() {
  const address: any = {
    address_info: state.value.address_info,
    sub_district: state.value.sub_district,
    district: state.value.district,
    province: state.value.province,
    zip: state.value.zip,
  }
  if (isCreate.value) {
    submitted.value = true
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      userData.createAddress(user.uid, address)
      showToast('success', 'บันทึกข้อมูลสำเร็จ', 'บันทึกข้อมูลสำเร็จ', 3000)
      resetForm()
      displayModal.value = false
    }
    else {
      showToast('error', 'บันทึกข้อมูลไม่สำเร็จ', 'บันทึกข้อมูลไม่สำเร็จ', 3000)
    }
  }
  else {
    submitted.value = true
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      userData.updateAddress(user.uid, address, indexAd.value)
      showToast('success', 'บันทึกข้อมูลสำเร็จ', 'บันทึกข้อมูลสำเร็จ', 3000)
      displayModal.value = false
    }
    else {
      showToast('error', 'บันทึกข้อมูลไม่สำเร็จ', 'บันทึกข้อมูลไม่สำเร็จ', 3000)
    }
  }
}

defineExpose({
  openModal,
})
</script>

<style scoped>

</style>
