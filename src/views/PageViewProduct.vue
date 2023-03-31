<template>
  <div class="card">
    <div class="p-fluid m-2 mx-4">
      <div v-for="(item, inx) in productList" :key="inx">
        <div class="flex">
          <div class="col-5 mb-2">
            <div class="field">
              <Image :src="`${item.image === 'product-placeholder.svg' ? noImage : item.image}`" alt="Image" width="600" preview />
            </div>
          </div>
          <div class="col-2">
            <Divider layout="vertical" />
          </div>
          <div class="col-5">
            <div class="flex justify-content-center align-items-center mb-2 product-name">
              <h4>
                {{ item.name }}
              </h4>
            </div>
            <div class="grid">
              <div class="col-12 p-0 pb-2">
                <div v-for="itm, index in status" :key="index">
                  <Chip v-if="item.productStatus === itm.value" :label="item.productStatus === itm.value ? itm.label : ''" />
                </div>
              </div>
              <div class="col-6 p-0">
                รหัสสินค้า : {{ item.id }}
              </div>
              <div class="col-6 p-0">
                จำนวนคงเหลือ : {{ item.quantity }}
              </div>
              <div class="col p-0">
                ราคา :
              </div>
              <div class="col p-0">
                <span class="text-red-500">{{ item.price }}</span> บาท
              </div>
              <div class="col-12 text-description">
                <Editor v-model="item.description" editorStyle="border: none" readonly>
                  <template v-slot:toolbar>
                    <span class="ql-formats2">
                      รายละเอียด :
                    </span>
                  </template>
                </Editor>
              </div>

              <div class="col-6 p-0">
                สถานะ :
              </div>
              <div class="col-6 p-0">
                หมวดหมู่ :
              </div>
              <div class="col-6">
                <div v-for="itm, index in statuses" :key="index">
                  <span v-if="item.inventoryStatus === itm.value" :class="`product-badge status-${item.inventoryStatus.toLowerCase()}`">{{ item.inventoryStatus === itm.value ? itm.label : '' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div v-for="itm, index in category" :key="index">
                  <span v-if="item.category === itm.value" class="product-category">{{ item.category === itm.value ? itm.label : '' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="flex justify-content-center align-items-center">
                  <InputNumber
                    v-model="quantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" :min="0" :max="item.quantity"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    @change="calculateTotalPrice(item.price, quantity)"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="flex justify-content-center align-items-center">
                  <Button
                    :label="`เพิ่มสินค้าลงตะกร้า ${formatCurrency(totalPrice)}`"
                    icon="pi pi-shopping-cart"
                    class="p-button-rounded p-button-success"
                    :disabled="quantity === 0 || !isLoggedin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import ProductData from '@/composables/products'
import formatCurrency from '@/plugins/formatCurrency'

const route = useRoute()
const routeID = ref()
const productData = ProductData()

const isLoggedin = ref(true)

function getRouteId() {
  routeID.value = route.params.name
}

const products = ref<any>({
  data: [],
})
const productList = computed(() => products.value.data.filter((item: any) => item.id === routeID.value))

watch(() => route.params.id, () => {
  getAllProducts()
  getRouteId()
})

const quantity = ref(0)
const totalPrice = ref(0)

function calculateTotalPrice(price: number, quantity: number) {
  totalPrice.value = price * quantity
}

watch(() => quantity.value, () => {
  calculateTotalPrice(productList.value[0].price, quantity.value)
})

const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=59bf9fe8-8848-4e48-9681-4d66bb17dd5f')

const statuses = ref([
  { label: 'มีสินค้า', value: 'INSTOCK' },
  { label: 'สินค้ามีน้อย', value: 'LOWSTOCK' },
  { label: 'สินค้าหมด', value: 'OUTOFSTOCK' },
])

const status = ref([
  { label: 'สินค้าแนะนำ', value: 'recommended_product' },
  { label: 'สินค้าขายดี', value: 'best_seller' },
  { label: 'สินค้าใหม่', value: 'new_product' },
  { label: 'สินค้าลดราคา', value: 'discount_product' },
  { label: 'สินค้า', value: 'product' },
])

const category = ref([
  { label: 'ผักผลไม้', value: 'FruitsAndVegetables' },
  { label: 'เนื้อสัตว์แช่แข็ง', value: 'FrozenMeats' },
  { label: 'อาหารทะเลแช่แข็ง', value: 'FrozenSeafood' },
  { label: 'อาหารสำเร็จรูป', value: 'InstantFood' },
])

async function getAllProducts() {
  products.value.data = await productData.getAllProducts()
}

(async () => {
  getRouteId()
  getAllProducts()

  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user)
      isLoggedin.value = true

    else isLoggedin.value = false
  })
})()
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
    border-radius: 4px;
    margin-bottom: 2rem;
    width: 80%;
    margin: 0 auto;
}

.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
    font-size: 1.5rem;
    font-weight: 700;
}

.text-description {
    margin: 0 0 1rem 0;
    // word-break: break-all;
}

.product-category-icon {
    vertical-align: middle;
    margin-right: .5rem;
}

.product-category {
    font-weight: 600;
    vertical-align: middle;
}
</style>
