import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import UserData from '@/composables/users'
import db from '@/main'

export default function Address() {
  const auth = getAuth()
  const userData = UserData()
  interface AddressState {
    address_id: string
    address_info: any
    sub_district: string
    district: string
    province: string
    zip: string
    length: number
  }

  const stateAddress = ref<AddressState>({
    address_id: '',
    address_info: '',
    sub_district: '',
    district: '',
    province: '',
    zip: '',
    length: 0,
  })

  async function getAddress() {
    const user = auth.currentUser

    const q = query(collection(db, 'users'), where('userId', '==', user?.uid))

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        stateAddress.value = doc.data().address.map((item: AddressState) => {
          return {
            address_info: item.address_info,
            sub_district: item.sub_district,
            district: item.district,
            province: item.province,
            zip: item.zip,
          }
        })
      })
    })
  }

  return {
    stateAddress,
    getAddress,
  }
}
