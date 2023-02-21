import { doc, setDoc, updateDoc } from 'firebase/firestore'
import db from '../src/main'

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
        console.log('Document written with ID: ', `${userId}`)
      }
      catch (e) {
        console.error('Error adding document: ', e)
      }
    },
    async updateUser(userId: string, firstname: string) {
      try {
        const userRef = doc(db, 'users', `${userId}`)

        // Set the "capital" field of the city 'DC'
        await updateDoc(userRef, {
          firstname,
        })
      }
      catch (e) {
        console.error('Error adding document: ', e)
      }
    },

  }
}
