import { reactive } from 'vue'
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
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
    async createProduct(id: string, name: string, description: string, price: number, image: string, quantity: number, inventoryStatus: string, productStatus: string, category: string) {
      const docRef = {
        id,
        name,
        description,
        price,
        image,
        quantity,
        inventoryStatus,
        productStatus,
        category,
      }
      return await setDoc(doc(db, 'products', `${id}`), docRef)
    },
    async updateProduct(id: string, name: string, description: string, price: number, image: string, quantity: number, inventoryStatus: string, productStatus: string, category: string) {
      const docRef = {
        id,
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
    getProductByCategory(category: string) {
      const products = reactive<any>({
        data: [],
      })
      const q = query(collection(db, 'products'), where('category', '==', category))

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          products.data.push(doc.data())
        })
      })
      return products.data
    },

  }
}
