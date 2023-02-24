<template>
  <Carousel :value="products" :numVisible="3" :numScroll="1" :circular="true" :autoplayInterval="3000" :responsiveOptions="carouselResponsiveOptions">
    <template v-slot:item="product">
      <div class="product-item">
        <div class="product-item-content">
          <div class="mb-3">
            <img :src="`/demo/images/product/${product.data.image}`" :alt="product.data.name" class="product-image">
          </div>
          <div>
            <h4 class="mb-1">
              {{ product.data.name }}
            </h4>
            <h6 class="mt-0 mb-3">
              {{ formatCurrency(product.data.price) }}
            </h6>
            <span :class="`product-badge status-${product.data.inventoryStatus.toLowerCase()}`">{{ product.data.inventoryStatus }}</span>
            <!-- <div class="car-buttons mt-5">
              <Button type="button" class="p-button p-button-rounded mr-2" icon="pi pi-search" />
              <Button type="button" class="p-button-success p-button-rounded mr-2" icon="pi pi-star-fill" />
              <Button type="button" class="p-button-help p-button-rounded" icon="pi pi-cog" />
            </div> -->
          </div>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductService from '@/service/ProductService'
import PhotoService from '@/service/PhotoService'
import formatCurrency from '@/plugins/formatCurrency'

const carouselResponsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 2,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1,
  },
])

const products = ref([])
const images = ref([])

const productService = new ProductService()
const photoService = new PhotoService()

onMounted(() => {
  productService.getProductsSmall().then((data: never[]) => (products.value = data))
  photoService.getImages().then((data: any) => (images.value = data))
})
</script>

<style lang="scss" scoped>
.product-item {
    .product-item-content {
        border: 1px solid var(--surface-border);
        border-radius: 3px;
        margin: .3rem;
        text-align: center;
        padding: 2rem 0;
    }

    .product-image {
        width: 50%;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
    }
    .status-instock {
        background-color: #4caf50;
    }
    .status-lowstock {
        background-color: #ff9800;
    }
    .status-outofstock {
        background-color: #f44336;
    }

}
</style>
