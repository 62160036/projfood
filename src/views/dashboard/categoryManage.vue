<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="-mt-5">
    <div class="card">
      <Toolbar class="mb-4">
        <template v-slot:start>
          <Button label="สินค้าใหม่" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
        </template>
      </Toolbar>

      <h5>จัดการหมวดหมู่</h5>
      <DataTable
        ref="dt" v-model:editingRows="editingRows" :value="categoryList"
        editMode="row" dataKey="id" responsiveLayout="scroll"
        :filters="filters" :globalFilterFields="['label', 'value']"
        @row-edit-save="onRowEditSave"
      >
        <template v-slot:header>
          <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.global.value" placeholder="Search..." />
            </span>
          </div>
        </template>
        <Column field="label" header="Label" style="width:40%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="value" header="Value" style="width:40%">
          <template v-slot:editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="status" header="Status" style="width:20%">
          <template v-slot:body="{ data, field }">
            <InputSwitch v-model="data[field]" disabled />
          </template>
          <template v-slot:editor="{ data, field }">
            <InputSwitch v-model="data[field]" />
          </template>
        </Column>
        <Column header="Edit" :rowEditor="true" style="width:10%; min-width:8rem;" />
        <Column field="id" header="Delete" style="width:10%; min-width:8rem;">
          <template v-slot:body="{ data, field }">
            <Button
              icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
              @click="deleteCategory(data[field])"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="categoryDialog" :modal="true" :style="{ width: '450px' }" header="เพิ่มหมวดหมู่"
      class="p-fluid"
    >
      <div class="field">
        <label for="label">Label</label>
        <InputText
          id="label" v-model.trim="state.label" :class="{ 'p-invalid': submitted && !state.label }" autofocus
        />
        <small v-if="submitted && !state.label" class="p-error">ชื่อหมวดหมู่จำเป็นต้องระบุ</small>
      </div>
      <div class="field">
        <label for="value">Value</label>
        <InputText
          id="value" v-model.trim="state.value" :class="{ 'p-invalid': submitted && !state.value }"
        />
        <small v-if="submitted && !state.value" class="p-error">รายละเอียดหมวดหมู่จำเป็นต้องระบุ</small>
      </div>

      <template v-slot:footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCategory" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import CategoryData from '@/composables/categories'

interface Category {
  id: string
  label: string
  value: string
  status: string
}
const state = ref<Category>({
  id: '',
  label: '',
  value: '',
  status: '',
})

const categoryData = CategoryData()
const categoryDialog = ref(false)
const category = ref<any>({})
const categories = ref<any>({
  data: [],
})
const categoryList = computed(() => categories.value.data)
const toast = useToast()
const editingRows = ref([])
const dt = ref()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const submitted = ref(false)
function resetForm() {
  state.value = {
    id: '',
    label: '',
    value: '',
    status: '',
  }
}

async function getAllCategories() {
  categories.value.data = await categoryData.getAllCategories()
}

async function onRowEditSave(event: { newData: any; index: any }) {
  const { newData, index } = event

  categoryList.value[index] = await newData
  state.value = {
    id: newData.id,
    label: newData.label,
    value: newData.value,
    status: newData.status,
  }

  await categoryData.updateCategory(newData.id, state.value.label, state.value.value, state.value.status)
}

function openNew() {
  category.value = {}
  submitted.value = false
  categoryDialog.value = true
}

function hideDialog() {
  resetForm()
  categoryDialog.value = false
  submitted.value = false
}

function createId() {
  const id = ref('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 5; i++)
    id.value += chars.charAt(Math.floor(Math.random() * chars.length))

  return id
}

function saveCategory() {
  submitted.value = true

  if (state.value.label && state.value.value) {
    category.value.id = createId()
    category.value.label = state.value.label ? state.value.label : category.value.label
    category.value.value = state.value.value ? state.value.value : category.value.value
    category.value.categoryStatus = false
    categoryData.createCategory(category.value.id, category.value.label, category.value.value, category.value.categoryStatus)
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 })
    getAllCategories()
    resetForm()
    categoryDialog.value = false
    category.value = {}
  }
}

function deleteCategory(id: any) {
  categoryData.deleteCategory(id)
  getAllCategories()
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 })
}

(async () => {
  getAllCategories()
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
