<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="userManage -mt-5">
    <div class="card">
      <h5>จัดการผู้ใช้งาน</h5>
      <DataTable
        ref="dt" v-model:editingRows="editingRows" :value="usersList"
        editMode="row" dataKey="userId" responsiveLayout="scroll"
        :filters="filters" :globalFilterFields="['email', 'firstname', 'lastname', 'phone']"
        @row-edit-save="onRowEditSave"
      >
        <template v-slot:header>
          <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.global.value" placeholder="Search..." />
            </span>
          </div>
        </template>
        <Column field="email" header="อีเมล" style="width:20%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" disabled />
          </template>
        </Column>
        <Column field="firstname" header="ชื่อ" style="width:20%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="lastname" header="นามสกุล" style="width:20%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="phone" header="เบอร์โทร" style="width:20%">
          <template v-slot:editor="{ data, field }">
            <InputMask v-model="data[field]" mask="999-999-9999" />
          </template>
        </Column>
        <Column field="role" header="ผู้ดูแลระบบ" style="width:20%">
          <template v-slot:body="{ data, field }">
            <InputSwitch v-model="data[field].admin" disabled />
          </template>
          <template v-slot:editor="{ data, field }">
            <InputSwitch v-model="data[field].admin" @change="changeRole(data.userId, data[field].admin)" />
          </template>
        </Column>
        <Column header="Action" :rowEditor="true" style="width:10%; min-width:8rem" bodyStyle="text-align:center" />
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { httpsCallable } from 'firebase/functions'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { functions } from '@/main'
import UserData from '@/composables/users'

interface ProflieState {
  firstname: string
  lastname: string
  phone: string

}

const state = ref<ProflieState>({
  firstname: '',
  lastname: '',
  phone: '',
})

const dt = ref()
const users = UserData()
const usersList = ref()
const loading = ref(true)
const isMe = ref(true)
const editingRows = ref([])
const toast = useToast()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

function showToast(severity: string, summary: string, detail: string, life: number) {
  toast.add({ severity, summary, detail, life })
}

async function onRowEditSave(event: { newData: any; index: any }) {
  const { newData, index } = event

  usersList.value[index] = await newData
  state.value = {
    firstname: newData.firstname,
    lastname: newData.lastname,
    phone: newData.phone,
  }
  await users.updateUser(newData.userId, state.value.firstname, state.value.lastname, state.value.phone)
}

function changeRole(uid: any, event: any) {
  const addMessage = httpsCallable(functions, 'setUserRole')
  const data = { uid, role: { admin: event } }
  addMessage(data)
    .then(() => {
      showToast('success', 'สำเร็จ', 'เปลี่ยนสิทธิ์ผู้ใช้งานเรียบร้อย', 3000)
    })
    .catch((error) => {
      showToast('error', 'ผิดพลาด', error.message, 3000)
    })
}

(async () => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    usersList.value = await users.getAllUsers()
    if (user)
      isMe.value = user.uid === usersList.value.userId
  })

  usersList.value = await users.getAllUsers()
  loading.value = false
})()
</script>

<style lang="scss" scoped>
.userManage {
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
}
}

}
</style>
