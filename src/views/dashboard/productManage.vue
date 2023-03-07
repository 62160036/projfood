<template>
  <div class="-mt-5">
    <div class="card">
      <Toolbar class="mb-4">
        <template v-slot:start>
          <Button label="สินค้าใหม่" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
          <Button
            label="ลบ" icon="pi pi-trash" class="p-button-danger"
            :disabled="!selectedProducts || !selectedProducts.length" @click="confirmDeleteSelected"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt" v-model:selection="selectedProducts" :value="productList" dataKey="id" :paginator="true"
        :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="แสดงสินค้า {first} ถึง {last} จาก {totalRecords} รายการ"
        responsiveLayout="scroll"
      >
        <template v-slot:header>
          <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center">
              จัดการสินค้า
            </h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.global.value" placeholder="Search..." />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column field="code" header="Code" :sortable="true" style="min-width:12rem" />
        <Column field="name" header="ชื่อ" :sortable="true" style="min-width:16rem" />
        <Column header="รูป">
          <template v-slot:body="slotProps">
            <img
              :src="`${slotProps.data.image === 'product-placeholder.svg' ? noImage : slotProps.data.image}`"
              :alt="slotProps.data.image" class="product-image"
            >
          </template>
        </Column>
        <Column field="price" header="ราคา" :sortable="true" style="min-width:8rem">
          <template v-slot:body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="quantity" header="จำนวน" :sortable="true" style="min-width:8rem" />
        <Column field="category" header="หมวดหมู่" :sortable="true" style="min-width:10rem">
          <template v-slot:body="slotProps">
            <div v-for="item, index in category" :key="index">
              <span>{{ slotProps.data.category === item.value ? item.label : '' }}</span>
            </div>
          </template>
        </Column>
        <Column field="inventoryStatus" header="สถานะ" :sortable="true" style="min-width:12rem">
          <template v-slot:body="slotProps">
            <span
              :class="`product-badge status-${slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : ''}`"
            >{{
              slotProps.data.inventoryStatus }}</span>
          </template>
        </Column>
        <Column field="productStatus" header="สถานะสินค้า" :sortable="true" style="min-width:12rem">
          <template v-slot:body="slotProps">
            <div v-for="item, index in status" :key="index">
              <span>{{ slotProps.data.productStatus === item.value ? item.label : '' }}</span>
            </div>
          </template>
        </Column>
        <Column :exportable="false" style="min-width:8rem">
          <template v-slot:body="slotProps">
            <Button
              icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash" class="p-button-rounded p-button-warning"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="productDialog" :style="{ width: '450px' }" header="รายละเอียดสินค้า" :modal="true"
      class="p-fluid"
    >
      <img
        v-if="product.image"
        :src="`${product.image === 'product-placeholder.svg' ? noImage : product.image}`"
        :alt="product.image"
        class="product-image"
      >
      <div class="field">
        <label for="name">ชื่อ</label>
        <InputText
          id="name" v-model.trim="product.name" autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small v-if="submitted && !product.name" class="p-error">ชื่อสินค้าจำเป็นต้องระบุ</small>
      </div>
      <div class="field">
        <label for="description">รายละเอียด</label>
        <Textarea id="description" v-model="product.description" rows="3" cols="20" :class="{ 'p-invalid': submitted && !product.description }" />
        <small v-if="submitted && !product.description" class="p-error">รายละเอียดสินค้าจำเป็นต้องระบุ</small>
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">สถานะสินค้าคงคลัง</label>
        <Dropdown
          id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label"
          placeholder="เลือกสถานะ" required="true"
          :class="{ 'p-invalid': submitted && !product.inventoryStatus }"
        >
          <template v-slot:value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="`product-badge status-${slotProps.value.value}`">{{ slotProps.value.label
              }}</span>
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <span :class="`product-badge status-${slotProps.value.toLowerCase()}`">{{ slotProps.value
              }}</span>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
        <small v-if="submitted && !product.inventoryStatus" class="p-error">สถานะสินค้าคงคลังจำเป็นต้องระบุ</small>
      </div>

      <div class="field">
        <label for="productStatus" class="mb-3">สถานะสินค้า</label>
        <Dropdown
          id="productStatus" v-model="product.productStatus" :options="status" optionLabel="label"
          placeholder="เลือกสถานะ" required="true"
          :class="{ 'p-invalid': submitted && !product.productStatus }"
        >
          <template v-slot:value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="`product-badge status-${slotProps.value.value}`">{{ slotProps.value.label
              }}</span>
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <span>{{ slotProps.value }}</span>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
        <small v-if="submitted && !product.productStatus" class="p-error">สถานะสินค้าคงคลังจำเป็นต้องระบุ</small>
      </div>

      <div class="field">
        <label class="mb-3">หมวดหมู่</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton id="category1" v-model="product.category" name="category" value="FruitsAndVegetables" :class="{ 'p-invalid': submitted && !product.category }" />
            <label for="category1">ผักผลไม้</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category2" v-model="product.category" name="category" value="FrozenMeats" :class="{ 'p-invalid': submitted && !product.category }" />
            <label for="category2">เนื้อสัตว์แช่แข็ง</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category3" v-model="product.category" name="category" value="FrozenSeafood" :class="{ 'p-invalid': submitted && !product.category }" />
            <label for="category3">อาหารทะเลแช่แข็ง</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category4" v-model="product.category" name="category" value="InstantFood" :class="{ 'p-invalid': submitted && !product.category }" />
            <label for="category4">อาหารสำเร็จรูป</label>
          </div>
          <small v-if="submitted && !product.category" class="p-error ml-3">หมวดหมู่สินค้าจำเป็นต้องระบุ</small>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">ราคา</label>
          <InputNumber id="price" v-model="product.price" mode="currency" :allowEmpty="false" currency="THB" locale="th-TH" />
        </div>
        <div class="field col">
          <label for="quantity">จำนวน</label>
          <InputNumber id="quantity" v-model="product.quantity" :allowEmpty="false" integeronly />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-10">
          <label>อัพโหลดรูปภาพ</label><br>
          <Button class="p-button p-component p-button-secondary">
            <input id="image" type="file" accept="image/*" @change="onAdvancedUpload">
          </Button>
        </div>
        <div v-if="product.image" class="field col-2">
          <label>&nbsp;</label><br>
          <Button class="p-button p-component p-button-danger" @click="deleteImage">
            <i class="pi pi-trash" />
          </Button>
        </div>
      </div>
      <template v-slot:footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">คุณแน่ใจหรือไม่ว่าต้องการลบ <b>{{ product.name }}</b>?</span>
      </div>
      <template v-slot:footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct(product.id, product.image)" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าที่เลือก?</span>
      </div>
      <template v-slot:footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { ref as StorageRef, deleteObject, getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import formatCurrency from '@/plugins/formatCurrency'
import ProductData from '@/composables/products'

interface Product {
  id: string
  code: string
  name: string
  description: string
  price: number
  image: string
  quantity: number
  inventoryStatus: string
  productStatus: string
  category: string
}

interface RawData {
  data: Product[]
}

const productData = ProductData()
const toast = useToast()
const dt = ref()
const products = ref<RawData>({
  data: [],
})
const productList = computed(() => products.value.data)
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref<any>({})
const selectedProducts = ref()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false)
const statuses = ref([
  { label: 'INSTOCK', value: 'INSTOCK' },
  { label: 'LOWSTOCK', value: 'LOWSTOCK' },
  { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' },
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

const openNew = () => {
  product.value = {}
  submitted.value = false
  productDialog.value = true
}
const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const editProduct = (prod: any) => {
  product.value = { ...prod }
  productDialog.value = true
}

const createId = () => {
  const id = ref('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++)
    id.value += chars.charAt(Math.floor(Math.random() * chars.length))

  return id
}

const fileName = ref('')
const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=59bf9fe8-8848-4e48-9681-4d66bb17dd5f')

const onAdvancedUpload = (e: any) => {
  const storage = getStorage()

  const file = e.target.files[0].name
  // rename to new file name no space and special character
  const newFile = file.replace(/[^a-zA-Z0-9.]/g, '_')
  // change file name with new file name
  const newFileName = `category_${createId().value}_${newFile}`

  fileName.value = newFileName

  const storageRef = StorageRef(storage, `products/${newFileName}`)

  // Upload the file
  uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL: any) => {
      product.value.image = downloadURL
    })
  })

  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
}

// delete image
const deleteImage = () => {
  const storage = getStorage()

  const file = product.value.image.split('%2F')[1].split('?')[0]

  const imageRef = StorageRef(storage, `products/${file}`)
  deleteObject(imageRef).then(() => {
    product.value.image = 'product-placeholder.svg'
  }).catch((error) => {
    console.log(error)
  })
}

const deleteImageOne = (image: string) => {
  const storage = getStorage()

  const file = image.split('%2F')[1].split('?')[0]

  const imageRef = StorageRef(storage, `products/${file}`)
  deleteObject(imageRef).then(() => {
    toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบรูปสินค้าสำเร็จ', life: 3000 })
  }).catch((error) => {
    console.log(error)
  })
}

const deleteImageMuti = (image: string) => {
  const storage = getStorage()

  const file = image.split('%2F')[1].split('?')[0]

  const imageRef = StorageRef(storage, `products/${file}`)
  deleteObject(imageRef).then(() => {
    toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบรูปสินค้าสำเร็จ', life: 3000 })
  }).catch((error) => {
    console.log(error)
  })
}

const confirmDeleteProduct = (prod: any) => {
  product.value = prod
  deleteProductDialog.value = true
}
const deleteProduct = (id: string, image: string) => {
  deleteProductDialog.value = false
  productData.deleteProducts(id)
  deleteImageOne(image)
  getAllProducts()
  toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสินค้าสำเร็จ', life: 3000 })
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}
const deleteSelectedProducts = () => {
  selectedProducts.value.forEach((item: any) => {
    productData.deleteProducts(item.id)
    deleteImageMuti(item.image)
  })
  deleteProductsDialog.value = false
  selectedProducts.value = null
  getAllProducts()
  toast.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสินค้าสำเร็จ', life: 3000 })
}

const saveProduct = () => {
  submitted.value = true

  if (product.value.name.trim()) {
    if (product.value.id) {
      product.value.image = product.value.image ? product.value.image : 'product-placeholder.svg'
      product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus
      product.value.productStatus = product.value.productStatus.value ? product.value.productStatus.value : product.value.productStatus
      productData.updateProduct(product.value.id, product.value.code, product.value.name, product.value.description, product.value.price, product.value.image, product.value.quantity, product.value.inventoryStatus, product.value.productStatus, product.value.category)
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 })
    }
    else {
      product.value.id = createId()
      product.value.code = createId()
      product.value.image = fileName.value ? product.value.image : 'product-placeholder.svg'
      product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK'
      product.value.productStatus = product.value.productStatus ? product.value.productStatus.value : 'product'
      product.value.price = product.value.price ? product.value.price : 0
      product.value.quantity = product.value.quantity ? product.value.quantity : 0
      productData.createProduct(product.value.id, product.value.code, product.value.name, product.value.description, product.value.price, product.value.image, product.value.quantity, product.value.inventoryStatus, product.value.productStatus, product.value.category)
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 })
    }
    getAllProducts()
    productDialog.value = false
    product.value = {}
  }
}

(() => {
  getAllProducts()
})()
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
    }
}

.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
    width: 200px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 960px) {
    ::v-deep(.p-toolbar) {
        flex-wrap: wrap;

        .p-button {
            margin-bottom: 0.25rem;
        }
    }
}
::v-deep(.custom-progress-bar) {
        .p-progressbar-value {
            background-color: #f44336;
        }
    }
</style>
