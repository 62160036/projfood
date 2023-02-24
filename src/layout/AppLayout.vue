<template>
  <div class="layout-wrapper">
    <div class="layout-sidebar">
      <AppSidebar />
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
    </div>
    <div class="layout-mask" />
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
</script>

<style lang="scss" scoped>
.layout-sidebar {
    position: fixed;
    width: 300px;
    height: calc(100vh - 9rem);
    z-index: 999;
    overflow-y: auto;
    user-select: none;
    top: 16rem;
    left: 1rem;
    transition: transform 0.2s, left 0.2s;
    background-color: var(--surface-overlay);
    border-radius: 12px;
    padding: 0.5rem 1.5rem;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
