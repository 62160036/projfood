<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
      {{ item.label }}
    </div>
    <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" :class="item.class" :target="item.target" tabindex="0" @click="itemClick($event, item, index)">
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler" />
    </a>
    <router-link v-if="item.to && !item.items && item.visible !== false" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to" @click="itemClick($event, item, index)">
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler" />
    </router-link>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false" />
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayout } from '@/layout/composables/layout'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
})

const route = useRoute()

const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout()

const isActiveMenu = ref(false)
const itemKey = ref()

onBeforeMount(() => {
  itemKey.value = props.parentItemKey ? `${props.parentItemKey}-${props.index}` : String(props.index)

  const activeItem: any = layoutState.activeMenuItem

  // eslint-disable-next-line no-mixed-operators
  isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(`${itemKey.value}-`) : false
})

watch(
  () => layoutConfig.activeMenuItem.value,
  (newVal: any) => {
    isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(`${itemKey.value}-`)
  },
)
const itemClick = (event: { preventDefault: () => void }, item: { disabled: any; to: any; url: any; command: (arg0: { originalEvent: any; item: any }) => void; items: any }) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  const { overlayMenuActive, staticMenuMobileActive } = layoutState

  if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value))
    onMenuToggle()

  if (item.command)
    item.command({ originalEvent: event, item })

  const foundItemKey: any = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value

  setActiveMenuItem(foundItemKey)
}

const checkActiveRoute = (item: { to: string }) => {
  return route.path === item.to
}
</script>

<style lang="scss" scoped></style>
