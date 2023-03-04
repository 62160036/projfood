import { arrayRemove, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import db from '@/main'

export default function UserData() {
  return {
    async getAllUsers() {
      const users: any = []
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.forEach((doc) => {
        users.push(doc.data())
      })
      return users
    },
    async createUser(userId: string, email: string, firstname: string, lastname: string, phone: string, address: string[]) {
      const docRef = {
        userId,
        email,
        firstname,
        lastname,
        phone,
        address,
      }
      return await setDoc(doc(db, 'users', `${userId}`), docRef)
    },
    async updateUser(userId: string, firstname: string, lastname: string, phone: string) {
      try {
        const userRef = doc(db, 'users', userId)

        await updateDoc(userRef, {
          firstname,
          lastname,
          phone,
        })
      }
      catch (e) {
        return e
      }
    },
    async createAddress(userId: string, address: string[]) {
      try {
        const q = query(collection(db, 'users'), where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          const addressRef = doc.data().address
          addressRef.push(address)
          updateDoc(doc.ref, {
            address: addressRef,
          })
        })
      }
      catch (e) {
        return e
      }
    },
    async updateAddress(userId: string, address: string[], index: string) {
      try {
        const q = query(collection(db, 'users'), where('userId', '==', userId))

        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          const addressRef = doc.data().address
          addressRef[index] = address
          updateDoc(doc.ref, {
            address: addressRef,
          })
        })
      }
      catch (e) {
        return e
      }
    },
    async deleteAddress(userId: string, index: string) {
      try {
        const q = query(collection(db, 'users'), where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          const addressRef = doc.data().address[index]
          updateDoc(doc.ref, {
            address: arrayRemove(addressRef), // อธิบายตรงนี้ คือ ลบออกจาก array ที่มีค่าเท่ากับ address ที่เรากำหนด
          })
        })
      }
      catch (e) {
        return e
      }
    },

  }
}
