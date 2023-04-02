import { doc, setDoc, updateDoc } from 'firebase/firestore'
import db from '@/main'

export default function PaymentData() {
  return {
    async createPayment(payment_id: string, order_id: string[], user_id: string, payment_image: string, payment_status: string) {
      const docRef = {
        payment_id,
        order_id,
        user_id,
        payment_image,
        payment_date: new Date(),
        payment_status,
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
  }
}
