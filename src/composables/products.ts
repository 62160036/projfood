import { reactive } from 'vue'
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import db from '@/main'

export default function ProductData() {
  return {
    async getAllProducts() {
      const products = reactive<any>({
        data: [],
      })
      const querySnapshot = await getDocs(collection(db, 'products'))
      querySnapshot.forEach((doc) => {
        products.data.push(doc.data())
      })
      return products.data
    },
    async createProduct(id: string, code: string, name: string, description: string, price: number, image: string, quantity: number, inventoryStatus: string, category: string) {
      const docRef = {
        id,
        code,
        name,
        description,
        price,
        image,
        quantity,
        inventoryStatus,
        category,
      }
      return await setDoc(doc(db, 'products', `${id}`), docRef)
    },
    async updateProduct(id: string, code: string, name: string, description: string, price: number, image: string, quantity: number, inventoryStatus: string, category: string) {
      const docRef = {
        id,
        code,
        name,
        description,
        price,
        image,
        quantity,
        inventoryStatus,
        category,
      }
      return await updateDoc(doc(db, 'products', `${id}`), docRef)
    },
    async deleteProducts(id: string) {
      try {
        await deleteDoc(doc(db, 'products', id))
      }
      catch (e) {
        return e
      }
    },

  }
}
