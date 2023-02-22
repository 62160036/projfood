<template>
  <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
    <i class="pi pi-cog" />
  </button>

  <Sidebar v-model:visible="visible" position="right" transitionOptions=".3s cubic-bezier(0, 0, 0.2, 1)" class="layout-config-sidebar w-20rem">
    <h5>Scale</h5>
    <div class="flex align-items-center">
      <Button icon="pi pi-minus" type="button" class="p-button-text p-button-rounded w-2rem h-2rem mr-2" :disabled="layoutConfig.scale.value === scales[0]" @click="decrementScale()" />
      <div class="flex gap-2 align-items-center">
        <i v-for="s in scales" :key="s" class="pi pi-circle-fill text-300" :class="{ 'text-primary-500': s === layoutConfig.scale.value }" />
      </div>
      <Button icon="pi pi-plus" type="button" pButton class="p-button-text p-button-rounded w-2rem h-2rem ml-2" :disabled="layoutConfig.scale.value === scales[scales.length - 1]" @click="incrementScale()" />
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLayout } from '@/layout/composables/layout'

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
})
const scales = ref([12, 13, 14, 15, 16])
const visible = ref(false)

const { setScale, layoutConfig } = useLayout()

const onConfigButtonClick = () => {
  visible.value = !visible.value
}

const applyScale = () => {
  document.documentElement.style.fontSize = `${layoutConfig.scale.value}px`
}
const decrementScale = () => {
  setScale(layoutConfig.scale.value - 1)
  applyScale()
}
const incrementScale = () => {
  setScale(layoutConfig.scale.value + 1)
  applyScale()
}
</script>

<style lang="scss" scoped></style>
