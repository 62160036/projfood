<template>
  <div class="userManage">
    <Toolbar class="mb-4">
      <template v-slot:start>
        <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
        <Button label="Delete" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedProducts || !selectedProducts.length" @click="confirmDeleteSelected" />
      </template>
    </Toolbar>

    <DataTable
      ref="dt" v-model:selection="selectedProducts" :value="products" dataKey="id"
      :paginator="true" :rows="10" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll"
    >
      <template v-slot:header>
        <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
          <h5 class="mb-2 md:m-0 p-as-md-center">
            Manage Products
          </h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters.global.value" placeholder="Search..." />
          </span>
        </div>
      </template>

      <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
      <Column field="code" header="Code" :sortable="true" style="min-width:12rem" />
      <Column field="name" header="Name" :sortable="true" style="min-width:16rem" />
      <Column header="Image">
        <template v-slot:body="slotProps">
          <img :src="`${contextPath}demo/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="product-image">
        </template>
      </Column>
      <Column field="price" header="Price" :sortable="true" style="min-width:8rem">
        <template v-slot:body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="category" header="Category" :sortable="true" style="min-width:10rem" />
      <Column field="rating" header="Reviews" :sortable="true" style="min-width:12rem">
        <template v-slot:body="slotProps">
          <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
        </template>
      </Column>
      <Column field="inventoryStatus" header="Status" :sortable="true" style="min-width:12rem">
        <template v-slot:body="slotProps">
          <span :class="`product-badge status-${slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : ''}`">{{ slotProps.data.inventoryStatus }}</span>
        </template>
      </Column>
      <Column :exportable="false" style="min-width:8rem">
        <template v-slot:body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
      <img v-if="product.image" :src="`${contextPath}demo/images/product/${product.image}`" :alt="product.image" class="product-image">
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
        <small v-if="submitted && !product.name" class="p-error">Name is required.</small>
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
          <template v-slot:value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="`product-badge status-${slotProps.value.value}`">{{ slotProps.value.label }}</span>
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <span :class="`product-badge status-${slotProps.value.toLowerCase()}`">{{ slotProps.value }}</span>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
      </div>

      <div class="field">
        <label class="mb-3">Category</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton id="category1" v-model="product.category" name="category" value="Accessories" />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category2" v-model="product.category" name="category" value="Clothing" />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category3" v-model="product.category" name="category" value="Electronics" />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="category4" v-model="product.category" name="category" value="Fitness" />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Price</label>
          <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="product.quantity" integeronly />
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
        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>
      <template v-slot:footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete the selected products?</span>
      </div>
      <template v-slot:footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import ProductService from '@/service/ProductService'
import { useLayout } from '@/layout/composables/layout'

const { contextPath } = useLayout()
const toast = useToast()
const dt = ref()
const products = ref()
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref<any>({})
const productService = ref(new ProductService())
const selectedProducts = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false)
const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' },
])

onMounted(() => {
  productService.value.getProducts().then(data => products.value = data)
})
const formatCurrency = (value: { toLocaleString: (arg0: string, arg1: { style: string; currency: string }) => any }) => {
  if (value)
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
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

const findIndexById = (id: any) => {
  let index = -1
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i
      break
    }
  }

  return index
}

const createId = () => {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length))

  return id
}

const saveProduct = () => {
  submitted.value = true

  if (product.value.name.trim()) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus
      products.value[findIndexById(product.value.id)] = product.value
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 })
    }
    else {
      product.value.id = createId()
      product.value.code = createId()
      product.value.image = 'product-placeholder.svg'
      product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK'
      products.value.push(product.value)
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 })
    }

    productDialog.value = false
    product.value = {}
  }
}
const editProduct = (prod: {}) => {
  product.value = { ...prod }
  productDialog.value = true
}
const confirmDeleteProduct = (prod: {}) => {
  product.value = prod
  deleteProductDialog.value = true
}
const deleteProduct = () => {
  products.value = products.value.filter((val: { id: any }) => val.id !== product.value.id)
  deleteProductDialog.value = false
  product.value = {}
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 })
}

const exportCSV = () => {
  dt.value.exportCSV()
}
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}
const deleteSelectedProducts = () => {
  products.value = products.value.filter((val: any) => !selectedProducts.value.includes(val))
  deleteProductsDialog.value = false
  selectedProducts.value = null
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 })
}
</script>

<style lang="scss" scoped>
.userManage {
    padding: 0 0 0 16rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: space-between;
    transition: margin-left 0.2s;

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
        width: 50px;
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
}
</style>
