<template>
  <section>
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h1>Admin</h1>
        <p v-if="users">
          User:{{ users.email }}
        </p>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in usersList" :key="item">
              <div v-if="users.email !== item.email">
                <td data-label="Name">
                  {{ item.email }}
                </td>
                <td>
                  Admin: {{ item.role.admin }}
                </td>
                <td v-if="isAdmin">
                  <InputSwitch v-model="item.role.admin" @change="changeRole(item.userId, item.role.admin)" />
                </td>
                <td v-if="!isAdmin">
                  <InputSwitch v-model="item.role.admin" disabled @change="changeRole(item.userId, item.role.admin)" />
                </td>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { httpsCallable } from 'firebase/functions'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import db, { functions } from '@/main'
import UserData from '@/composables/users'

const users = ref({
  email: '',
  firstname: '',
  lastname: '',
  userId: '',
  role: {
    admin: true,
  },
})

const user = UserData()
const usersList = ref()
const isAdmin = ref(true)

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

async function readUserData(userId: string) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      users.value = {
        email: doc.data().email,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        userId: doc.data().userId,
        role: doc.data().role,
      }
    })
  })
}

(async () => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (auth && auth.currentUser)

        readUserData(auth.currentUser!.uid)
    }
    user?.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.admin)
        isAdmin.value = idTokenResult.claims.admin

      else
        isAdmin.value = false
    })
  })

  usersList.value = await user.getAllUsers()
})()
</script>
