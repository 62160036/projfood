import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { reactive } from 'vue'
import db from '@/main'

export default function OrderData() {
  return {
    async getAllOrders() {
      const orders = reactive<any>({
        data: [],
      })
      const querySnapshot = await getDocs(collection(db, 'orders'))
      querySnapshot.forEach((doc) => {
        orders.data.push(doc.data())
      })

      return orders.data
    },
    async createOrder(order_id: string, product: string[], user_id: string, order_price: number, quantity: number, total_price: number, order_status: string) {
      const docRef = {
        order_id,
        product,
        user_id,
        order_price,
        quantity,
        total_price,
        order_date: new Date(),
        order_status,
      }
      return await setDoc(doc(db, 'orders', `${order_id}`), docRef)
    },
    async updateOrder(order_id: string, quantity: number, total_price: number) {
      const orderRef = doc(db, 'orders', order_id)
      await updateDoc(orderRef, {
        quantity,
        total_price,
      })
    },
    async deleteOrder(order_id: string) {
      try {
        await deleteDoc(doc(db, 'orders', order_id))
      }
      catch (e) {
        return e
      }
    },
    async updateOrderStatus(order_id: string, order_status: string) {
      const orderRef = doc(db, 'orders', order_id)
      await updateDoc(orderRef, {
        order_status,
      })
    },
  }
}
