<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="userManage">
    <div class="card">
      <h5>จัดการผู้ใช้งาน</h5>
      <DataTable v-model:editingRows="editingRows" :value="usersList" editMode="row" dataKey="id" responsiveLayout="scroll" @row-edit-save="onRowEditSave">
        <Column field="email" header="อีเมล" style="width:20%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
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
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="role" header="ผู้ดูแลระบบ" style="width:20%">
          <template v-slot:body="{ data }">
            <InputSwitch v-model="data.role.admin" disabled />
          </template>
          <template v-slot:editor="{ data }">
            <InputSwitch v-model="data.role.admin" @change="changeRole(data.userId, data.role.admin)" />
          </template>
        </Column>
        <Column :rowEditor="true" style="width:10%; min-width:8rem" bodyStyle="text-align:center" />
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { httpsCallable } from 'firebase/functions'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { functions } from '@/main'
import UserData from '@/composables/users'

const users = UserData()
const usersList = ref()
const loading = ref(true)
const isMe = ref(true)
const editingRows = ref([])

const onRowEditSave = (event: { newData: any; index: any }) => {
  const { newData, index } = event

  usersList.value[index] = newData
}

function changeRole(uid: any, event: any) {
  const addMessage = httpsCallable(functions, 'setUserRole')
  const data = { uid, role: { admin: event } }
  addMessage(data)
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
}

(async () => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    usersList.value = users.getAllUsers()
    if (user)
      isMe.value = user.uid === usersList.value.userId
  })

  usersList.value = await users.getAllUsers()
  loading.value = false
})()
</script>

<style lang="scss" scoped>
.userManage {
  padding: 0 0 0 16rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  transition: margin-left 0.2s;

}
</style>
