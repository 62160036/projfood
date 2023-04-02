import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { reactive } from 'vue'
import db from '@/main'

export default function CategoryData() {
  return {
    async getAllCategories() {
      const categories = reactive<any>({
        data: [],
      })
      const querySnapshot = await getDocs(collection(db, 'categories'))
      querySnapshot.forEach((doc) => {
        categories.data.push(doc.data())
      })

      return categories.data
    },
    async createCategory(id: string, label: string, value: string, status: string) {
      const docRef = {
        id,
        label,
        value,
        status,
      }
      return await setDoc(doc(db, 'categories', `${id}`), docRef)
    },
    async updateCategory(id: string, label: string, value: string, status: string) {
      const docRef = {
        id,
        label,
        value,
        status,
      }
      return await updateDoc(doc(db, 'categories', `${id}`), docRef)
    },
    async deleteCategory(id: string) {
      try {
        await deleteDoc(doc(db, 'categories', id))
      }
      catch (e) {
        return e
      }
    },
  }
}
