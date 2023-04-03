import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { reactive } from 'vue'
import db from '@/main'

export default function PaymentData() {
  return {
    async createPayment(payment_id: string, order_id: string[], user_id: string, payment_image: string, total_price: number, payment_status: string) {
      const docRef = {
        payment_id,
        orders: order_id,
        user_id,
        payment_image,
        total_price,
        payment_date: new Date(),
        payment_status,
        shipping_status: 'pending',
      }
      return await setDoc(doc(db, 'payments', `${payment_id}`), docRef)
    },
    async updatePayment(payment_id: string, payment_status: string, image: string) {
      const paymentRef = doc(db, 'payments', payment_id)
      await updateDoc(paymentRef, {
        payment_status,
        payment_image: image,
      })
    },
    async getAllPayments() {
      const payments = reactive<any>({
        data: [],
      })
      const querySnapshot = await getDocs(collection(db, 'payments'))
      querySnapshot.forEach((doc) => {
        payments.data.push(doc.data())
      })

      return payments.data
    },
  }
}
