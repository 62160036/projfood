import { reactive, ref } from 'vue'
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
    async createProduct(id: string, name: string, description: string, price: number, image: string, quantity: number, productStatus: string, category: string) {
      const docRef = {
        id,
        name,
        description,
        price,
        image,
        quantity,
        inventoryStatus: 'INSTOCK',
        productStatus,
        category,
      }
      return await setDoc(doc(db, 'products', `${id}`), docRef)
    },
    async updateProduct(id: string, name: string, description: string, price: number, image: string, quantity: number, productStatus: string, category: string) {
      const inventoryStatus = ref('')

      const statuses = ref([
        { label: 'INSTOCK', value: 'INSTOCK' },
        { label: 'LOWSTOCK', value: 'LOWSTOCK' },
        { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' },
      ])

      if (quantity <= 0)
        inventoryStatus.value = statuses.value[2].value

      else if (quantity <= 10)
        inventoryStatus.value = statuses.value[1].value

      else
        inventoryStatus.value = statuses.value[0].value

      const docRef = {
        id,
        name,
        description,
        price,
        image,
        quantity,
        inventoryStatus: inventoryStatus.value,
        productStatus,
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
    async updateQuantityandInventoryStatus(id: string, quantity: number) {
      const inventoryStatus = ref('')
      const statuses = ref([
        { label: 'INSTOCK', value: 'INSTOCK' },
        { label: 'LOWSTOCK', value: 'LOWSTOCK' },
        { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' },
      ])

      if (quantity <= 0)
        inventoryStatus.value = statuses.value[2].value

      else if (quantity <= 10)
        inventoryStatus.value = statuses.value[1].value

      else
        inventoryStatus.value = statuses.value[0].value

      const docRef = {
        quantity,
        inventoryStatus: inventoryStatus.value,
      }
      return await updateDoc(doc(db, 'products', `${id}`), docRef)
    },
  }
}
