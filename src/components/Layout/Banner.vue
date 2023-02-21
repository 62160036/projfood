<template>
  <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" class="custom-carousel" :circular="true" :autoplayInterval="3000">
    <template v-slot:item="slotProps">
      <div class="product-item">
        <div class="product-item-content">
          <div class="mb-3">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="slotProps.data.name" class="product-image">
          </div>
          <div>
            <h4 class="mb-1">
              {{ slotProps.data.name }}
            </h4>
            <h6 class="mt-0 mb-3">
              ${{ slotProps.data.price }}
            </h6>
            <span :class="`p-badge status-${slotProps.data.inventoryStatus.toLowerCase()}`">{{ slotProps.data.inventoryStatus }}</span>
            <!-- <div class="car-buttons mt-5">
              <Button icon="pi pi-search" class="p-button p-button-rounded me-2" />
              <Button icon="pi pi-star-fill" class="p-button-success p-button-rounded me-2" />
              <Button icon="pi pi-cog" class="p-button-help p-button-rounded" />
            </div> -->
          </div>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import Carousel from 'primevue/carousel'
import { ref } from 'vue'

const products = ref([
  {
    name: 'Product 1',
    price: 100,
    inventoryStatus: 'INSTOCK',
  },
  {
    name: 'Product 2',
    price: 100,
    inventoryStatus: 'LOWSTOCK',
  },
  {
    name: 'Product 3',
    price: 100,
    inventoryStatus: 'INSTOCK',
  },
  {
    name: 'Product 4',
    price: 100,
    inventoryStatus: 'OUTOFSTOCK',
  },
  {
    name: 'Product 5',
    price: 100,
    inventoryStatus: 'INSTOCK',
  },
  {
    name: 'Product 6',
    price: 100,
    inventoryStatus: 'LOWSTOCK',
  },
])

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '600px',
    numVisible: 2,
    numScroll: 2,
  },
  {
    breakpoint: '480px',
    numVisible: 1,
    numScroll: 1,
  },
])
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
