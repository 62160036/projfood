import { addDoc, collection } from 'firebase/firestore'
import db from '../src/main'

export default function UserData() {
  return {
    async writeUserData(userId: string, email: string, firstname: string, lastname: string, phone: string, address: string, sub_district: string, district: string, province: string, zip: string) {
      try {
        const docRef = await addDoc(collection(db, 'users'), {
          userId,
          email,
          firstname,
          lastname,
          phone,
          address,
          sub_district,
          district,
          province,
          zip,
        })
        console.log('Document written with ID: ', docRef.id)
      }
      catch (e) {
        console.error('Error adding document: ', e)
      }
    },

  }
}
