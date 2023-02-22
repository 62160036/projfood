import { computed, reactive, toRefs } from 'vue'

const contextPath = import.meta.env.BASE_URL

const layoutConfig = reactive({
  ripple: false,
  darkTheme: false,
  inputStyle: 'outlined',
  scale: 14,
  activeMenuItem: null,
})

const layoutState = reactive({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
})

export function useLayout() {
  const setScale = (scale: number) => {
    layoutConfig.scale = scale
  }

  const setActiveMenuItem = (item: { value: any }) => {
    layoutConfig.activeMenuItem = item.value || item
  }

  const onMenuToggle = () => {
    if (window.innerWidth > 991)
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive

    else
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
  }

  const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive)

  return { contextPath, layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), setScale, onMenuToggle, isSidebarActive, setActiveMenuItem }
}
