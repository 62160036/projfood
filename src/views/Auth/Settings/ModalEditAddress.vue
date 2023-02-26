<template>
  <Dialog v-model:visible="displayModal" :header="`${isCreate ? 'เพิ่มที่อยู่ใหม่' : 'แก้ไขที่อยู่'}`" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '50vw' }" :modal="true">
    <div class="m-2 mx-4">
      <FormKit
        type="form"
        :formClass="submitted ? 'hide' : 'show'"
        :actions="false"
        @submit="updateAddress"
      >
        <div class="flex">
          <div class="col">
            <div class="field">
              <label for="phone">ที่อยู่</label>
              <FormKit
                v-model="state.address_info"
                type="text"
                validation="required"
                :validationMessages="{
                  required: 'จำเป็นต้องกรอกที่อยู่',
                }"
              />
            </div>
            <div class="grid">
              <div class="field col">
                <label for="phone">ตำบล</label>
                <FormKit
                  v-model="state.sub_district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกตำบล',
                  }"
                />
              </div>
              <div class="field col">
                <label for="email">อำเภอ</label>
                <FormKit
                  v-model="state.district"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกอำเภอ',
                  }"
                />
              </div>
            </div>
            <div class="grid">
              <div class="field col">
                <label for="phone">จังหวัด</label>
                <FormKit
                  v-model="state.province"
                  type="text"
                  validation="required"
                  :validationMessages="{
                    required: 'จำเป็นต้องกรอกจังหวัด',
                  }"
                />
              </div>
              <div class="field col">
                <label for="email">รหัสไปรษณีย์</label>
                <FormKit
                  v-model="state.zip"
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
        </div>
        <div class="flex justify-content-center align-items-center font-bold mt-1rem">
          <Button type="submit" label="บันทึกการเปลี่่ยนแปลง" icon="pi pi-user-edit" class="p-button-success" />
        </div>
      </FormKit>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { collection, getDocs, query, updateDoc, where } from '@firebase/firestore'
import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
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

const isCreate = ref(false)
const auth = getAuth()
const router = useRouter()
const userData = UserData()
const displayModal = ref(false)
const ind = ref('')
const submitted = ref(false)
const toast = useToast()
const showToast = (severity: string, summary: string, detail: string, life: number) => {
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
    ind.value = index
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

const resetForm = () => {
  state.value = {
    address_info: '',
    sub_district: '',
    district: '',
    province: '',
    zip: '',
  }
}

async function updateAddress() {
  if (isCreate.value) {
    submitted.value = true
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      const address: any = {
        address_info: state.value.address_info,
        sub_district: state.value.sub_district,
        district: state.value.district,
        province: state.value.province,
        zip: state.value.zip,
      }
      userData.createAddressByUserId(user.uid, address)
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
      const q = query(collection(db, 'users'), where('userId', '==', user.uid))

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const address = doc.data().address
        address[ind.value] = state.value
        updateDoc(doc.ref, {
          address,
        })
      })
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
