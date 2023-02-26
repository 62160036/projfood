<template>
  <div class="m-2 mx-4">
    <FormKit
      type="form"
      :formClass="submitted ? 'hide' : 'show'"
      :actions="false"
      @submit="updateProfile"
    >
      <div class="flex">
        <div class="col-5">
          <div class="flex justify-content-center align-items-center font-bold mb-4">
            ข้อมูลผู้ใช้งาน
          </div>
          <div class="field">
            <label for="email">อีเมล</label>
            <FormKit
              v-model="state.email"
              type="email"
              validationVisibility="dirty"
              disabled
            />
          </div>
          <div class="field">
            <label for="phone">เบอร์โทรศัพท์</label>
            <FormKit
              v-model="state.phone"
              type="mask"
              mode="select"
              name="phone"
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
        <div class="col-2">
          <Divider layout="vertical" />
        </div>
        <div class="col-5">
          <div class="flex justify-content-center align-items-center font-bold mb-4">
            ข้อมูลส่วนบุคคล
          </div>
          <div class="grid">
            <div class="field col">
              <label for="firstname">ชื่อ</label>
              <FormKit
                v-model="state.firstname"
                type="text"
                validation="required"
                :validationMessages="{
                  required: 'จำเป็นต้องกรอกชื่อ',
                }"
              />
            </div>
            <div class="field col">
              <label for="lastname">นามสกุล</label>
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
        </div>
      </div>
      <div class="flex justify-content-center align-items-center font-bold mt-1rem">
        <Button type="submit" label="บันทึกการเปลี่่ยนแปลง" icon="pi pi-user-edit" class="p-button-success" />
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import db from '@/main'
import UserData from '@/composables/users'

interface ProflieState {
  email: string | null
  firstname: string
  lastname: string
  phone: string

}

const state = ref<ProflieState>({
  email: '',
  firstname: '',
  lastname: '',
  phone: '',
})
const auth = getAuth()
const router = useRouter()
const toast = useToast()
const userData = UserData()
const submitted = ref(false)
const showToast = (severity: string, summary: string, detail: string, life: number) => {
  toast.add({ severity, summary, detail, life })
}

function getUserProfile() {
  const auth = getAuth()
  const user = auth.currentUser

  if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
    const email = user.email
    state.value.email = email
    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid
    readUserData(uid)
  }
}

async function readUserData(userId: string) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      state.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        phone: doc.data().phone,
      }
    })
  })
}

async function updateProfile() {
  submitted.value = true
  const auth = getAuth()
  const user = auth.currentUser

  if (user !== null) {
    const uid = user.uid
    await userData.updateUser(uid, state.value.firstname, state.value.lastname, state.value.phone)
    showToast('success', 'บันทึกข้อมูลสำเร็จ', 'บันทึกข้อมูลสำเร็จ', 3000)
  }
  else {
    showToast('error', 'บันทึกข้อมูลไม่สำเร็จ', 'บันทึกข้อมูลไม่สำเร็จ', 3000)
  }
}

(async () => {
  await getUserProfile()
})()
</script>

<style lang="scss" scoped>

</style>
