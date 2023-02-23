import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import db from '@/main'

export default function UserData() {
  return {
    async writeUserData(userId: string, email: string, firstname: string, lastname: string, phone: string, address: string[]) {
      try {
        const docRef = {
          userId,
          email,
          firstname,
          lastname,
          phone,
          address,
        }
        await setDoc(doc(db, 'users', `${userId}`), docRef)
      }
      catch (e) {
        return e
      }
    },
    async getAllUsers() {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      return userSnapshot.docs.map(doc => doc.data())
    },
    async updateUser(userId: string, email: string, firstname: string, lastname: string, phone: string) {
      try {
        const userRef = doc(db, 'users', `${userId}`)
        await updateDoc(userRef, {
          email,
          firstname,
          lastname,
          phone,
        })
      }
      catch (e) {
        return e
      }
    },

  }
}
