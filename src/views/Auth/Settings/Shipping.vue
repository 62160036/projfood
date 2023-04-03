<template>
  <div class="m-2 mx-4">
    <div class="flex">
      <div class="col-5">
        <div class="flex justify-content-center align-items-center font-bold mb-4">
          สถานะการส่งสินค้า
        </div>
        <Divider />
        <div v-for="item, index in paymentList" :key="index">
          <div>
            #{{ item.payment_id }}
          </div>
          <div class="flex">
            <div class="col">
              สถานะการส่งสินค้า :
              <span class="flex">{{ item.shipping_status === "shipped" ? "จัดส่งแล้ว" : "รอการจัดส่ง" }}</span>
            </div>
            <div class="col-1">
              <Divider layout="vertical" />
            </div>
            <div class="col">
              ที่อยู่ในการจัดส่ง :
              <span class="flex">{{ item.address.address_info }}</span>
            </div>
          </div>
          <Divider />
        </div>
      </div>
      <div class="col-1">
        <Divider layout="vertical" />
      </div>
      <div class="col-6">
        <div class="flex justify-content-center align-items-center font-bold mb-2">
          เพิ่มที่อยู่ในการจัดส่ง
          <Button v-tooltip="'เพิ่มที่อยู่ใหม่'" icon="pi pi-plus-circle" class="p-button-rounded p-button-text" :class="{ hidden: stateAddress.length === 3 }" @click="openModalCreateAddress" />
        </div>
        <div class="grid">
          <div class="col">
            <Accordion :activeIndex="0">
              <AccordionTab v-for="(item, index) in stateAddress" :key="index">
                <template v-slot:header>
                  <i class="pi pi-map-marker mr-2" />
                  <span>ที่อยู่ {{ index + 1 }}</span>
                </template>
                <div class="flex flex-column">
                  <div class="field">
                    <div class="grid">
                      <div class="col">
                        <label class="font-bold">รายละเอียดที่อยู่</label>
                        <div>
                          {{ item.address_info }}
                        </div>
                      </div>
                      <div class="col">
                        <label class="font-bold">แก้ไข/ลบ ที่อยู่</label>
                        <div>
                          <Button icon="pi pi-file-edit" class="p-button-rounded p-button-text" @click="openModalEditAddress(index)" />
                          <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" :class="{ hidden: stateAddress.length <= 1 }" @click="deleteAddress(index, $event)" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="col">
                      <label class="font-bold">ตำบล</label>
                      <div>
                        {{ item.sub_district }}
                      </div>
                    </div>
                    <div class="col">
                      <label class="font-bold">อำเภอ</label>
                      <div>
                        {{ item.district }}
                      </div>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="col">
                      <label class="font-bold">จังหวัด</label>
                      <div>
                        {{ item.province }}
                      </div>
                    </div>
                    <div class="col">
                      <label class="font-bold">รหัสไปรษณีย์</label>
                      <div>
                        {{ item.zip }}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmPopup />
  <ModalEditAddress ref="modalEditAddress" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import ModalEditAddress from './ModalEditAddress.vue'
import Address from './data/address'
import UserData from '@/composables/users'
import PaymentData from '@/composables/payments'

const dataAddress = Address()

const stateAddress = computed(() =>
  dataAddress.stateAddress.value,
)

const paymentData = PaymentData()
const payments = ref<any>({
  data: [],
})

const paymentList = computed(() => {
  return payments.value.data
})

async function getAllPayments() {
  payments.value.data = await paymentData.getAllPayments()
}

// const events1 = ref([
//   { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
//   { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
//   { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
//   { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
// ])

const confirm = useConfirm()
const auth = getAuth()
const indexAd = ref('')
const toast = useToast()
const userData = UserData()
const submitted = ref(false)
function showToast(severity: string, summary: string, detail: string, life: number) {
  toast.add({ severity, summary, detail, life })
}

const modalEditAddress = ref<InstanceType<typeof ModalEditAddress>>(null!)

function openModalCreateAddress() {
  const isCreate = ref('create')
  modalEditAddress.value.openModal(isCreate.value)
}
function openModalEditAddress(index: string) {
  modalEditAddress.value.openModal(index)
}

async function deleteAddress(index: string, event: { currentTarget: any }) {
  submitted.value = true
  indexAd.value = index
  const user = auth.currentUser
  confirm.require({
    target: event.currentTarget,
    message: 'คุณต้องการลบที่อยู่นี้ใช่หรือไม่',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      if (user) {
        userData.deleteAddress(user.uid, indexAd.value)
        showToast('success', 'ลบที่อยู่สำเร็จ', '', 3000)
        submitted.value = false
      }
      else {
        showToast('error', 'ลบที่อยู่ไม่สำเร็จ', '', 3000)
      }
    },
    // reject: () => {
    //   showToast('info', 'ยกเลิกการลบที่อยู่', '', 3000)
    // },
  })
}

(() => {
  dataAddress.getAddress()
  getAllPayments()
})()
</script>

<style lang="scss" scoped>
.custom-marker {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-radius: 50%;
    z-index: 1;
}
</style>
