<template>
  <div class="card">
    <DataView
      :value="productList" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder"
      :sortField="sortField" dataKey="id"
    >
      <template v-slot:header>
        <div class="grid grid-nogutter">
          <div class="col-6" style="text-align: left">
            <Dropdown
              v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="เรียงตามราคา"
              @change="onSortChange($event)"
            />
          </div>
          <div class="col-6" style="text-align: right">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </div>
      </template>

      <template v-slot:list="slotProps">
        <div class="col-12">
          <div class="product-list-item">
            <img
              :src="`${slotProps.data.image === 'product-placeholder.svg' ? noImage : slotProps.data.image}`"
              :alt="slotProps.data.name"
            >
            <div class="product-list-detail">
              <div class="product-name" @click="() => $router.push(`/view/${slotProps.data.category}/${slotProps.data.id}`)">
                {{ slotProps.data.name }}
              </div>
              <!-- <div class="product-description">
                {{ slotProps.data.description }}
              </div> -->
              <i class="pi pi-tag product-category-icon" />
              <span v-for="item, index in categoryList" :key="index" class="product-category">{{ slotProps.data.category === item.value ? item.label : '' }}</span>
            </div>
            <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
              <span class="product-price">{{ formatCurrency(slotProps.data.price) }}</span>
              <!-- <Button
                icon="pi pi-shopping-cart" label="เพิ่มลงตะกร้า"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
              /> -->
              <span :class="`product-badge text-center status-${slotProps.data.inventoryStatus.toLowerCase()}`">
                {{ statuses.filter((item: any) => item.value === slotProps.data.inventoryStatus)[0].label }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:grid="slotProps">
        <div class="col-12 md:col-4">
          <div class="product-grid-item card">
            <div class="product-grid-item-top">
              <div>
                <i class="pi pi-tag product-category-icon" />
                <span v-for="item, index in categoryList" :key="index" class="product-category">{{ slotProps.data.category === item.value ? item.label : '' }}</span>
              </div>
              <span :class="`product-badge status-${slotProps.data.inventoryStatus.toLowerCase()}`">
                {{ statuses.filter((item: any) => item.value === slotProps.data.inventoryStatus)[0].label }}
              </span>
            </div>
            <div class="product-grid-item-content">
              <img
                :src="`${slotProps.data.image === 'product-placeholder.svg' ? noImage : slotProps.data.image}`" class="product-image"
                :alt="slotProps.data.name"
                @click="() => $router.push(`/view/${slotProps.data.category}/${slotProps.data.id}`)"
              >
              <div class="product-name" @click="() => $router.push(`/view/${slotProps.data.category}/${slotProps.data.id}`)">
                {{ slotProps.data.name }}
              </div>
              <!-- <div class="product-description">
                {{ slotProps.data.description }}
              </div> -->
            </div>
            <div class="product-grid-item-bottom">
              <span class="product-price">{{ formatCurrency(slotProps.data.price) }}</span>
              <!-- <Button
                icon="pi pi-shopping-cart"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
              /> -->
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductData from '@/composables/products'
import formatCurrency from '@/plugins/formatCurrency'
import CategoryData from '@/composables/categories'

const route = useRoute()
const routeID = ref()
const productData = ProductData()
const categoryData = CategoryData()

function getRouteId() {
  routeID.value = route.params.id
}
const products = ref<any>({
  data: [],
})
const productList = computed(() => products.value.data.filter((item: any) => item.category === routeID.value))

const categories = ref<any>({
  data: [],
})
const categoryList = computed(() => categories.value.data)

async function getAllCategories() {
  categories.value.data = await categoryData.getAllCategories()
}

watch(() => route.params.id, () => {
  getAllProducts()
  getRouteId()
})

const noImage = ref('https://firebasestorage.googleapis.com/v0/b/prjfood-dc319.appspot.com/o/products%2Fproduct-placeholder.svg?alt=media&token=e6b54247-37f3-4bfa-a584-dd52122a4673')
const layout = ref<any>('grid')
const sortKey = ref<any>()
const sortOrder = ref<any>()
const sortField = ref<any>()
const sortOptions = ref<any>([
  { label: 'เรียงจากราคาสูงไปต่ำ', value: '!price' },
  { label: 'เรียงจากราคาต่ำไปสูง', value: 'price' },
])

const statuses = ref([
  { label: 'มีสินค้า', value: 'INSTOCK' },
  { label: 'สินค้ามีน้อย', value: 'LOWSTOCK' },
  { label: 'สินค้าหมด', value: 'OUTOFSTOCK' },
])

function onSortChange(event: any) {
  const value = event.value.value
  const sortValue = event.value

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1
    sortField.value = value.substring(1, value.length)
    sortKey.value = sortValue
  }
  else {
    sortOrder.value = 1
    sortField.value = value
    sortKey.value = sortValue
  }
}

async function getAllProducts() {
  products.value.data = await productData.getAllProducts()
}

(() => {
  getRouteId()
  getAllProducts()
  getAllCategories()
})()
</script>

<style lang="scss" scoped>
.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
    border-radius: 4px;
    margin-bottom: 2rem;
}

.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
}

.product-description {
    margin: 0 0 1rem 0;
    max-width: 1000px;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.product-category-icon {
    vertical-align: middle;
    margin-right: .5rem;
}

.product-category {
    font-weight: 600;
    vertical-align: middle;
}

::v-deep(.product-list-item) {
    display: flex;
    align-items: center;
    padding: 1rem;
    width: 100%;

    img {
        width: 50px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        margin-right: 2rem;
    }

    .product-list-detail {
        flex: 1 1 0;
    }

    .p-rating {
        margin: 0 0 .5rem 0;
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: .5rem;
        align-self: flex-end;
    }

    .p-button {
        margin-bottom: .5rem;
    }
}

::v-deep(.product-grid-item) {
    margin: .5rem;
    border: 1px solid var(--surface-border);

    .product-grid-item-top,
    .product-grid-item-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    img {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        margin: 2rem 0;
    }

    .product-grid-item-content {
        text-align: center;
        .product-image {
            width: 60%;
            height: 150px;
            cursor: pointer;
        }
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 600;
    }
}

@media screen and (max-width: 576px) {
    .product-list-item {
        flex-direction: column;
        align-items: center;

        img {
            margin: 2rem 0;
        }

        .product-list-detail {
            text-align: center;
        }

        .product-price {
            align-self: center;
        }

        .product-list-action {
            display: flex;
            flex-direction: column;
        }

        .product-list-action {
            margin-top: 2rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
}
</style>
