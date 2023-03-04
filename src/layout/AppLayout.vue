<template>
  <div class="layout-wrapper">
    <AppTopbar />
    <div class="layout-sidebar">
      <AppSidebar />
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
</script>

<style lang="scss" scoped>
.layout-sidebar {
    position: fixed;
    width: 300px;
    height: calc(100vh - 9rem);
    z-index: 999;
    overflow-y: auto;
    user-select: none;
    top: 7rem;
    left: 1rem;
    transition: transform 0.2s, left 0.2s;
    background-color: var(--surface-overlay);
    border-radius: 12px;
    padding: 0.5rem 1.5rem;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}
.layout-main {

  padding: 2rem 2rem 2rem 20rem;
  display: flex;
  flex-direction: column;
  // min-height: 100vh;
  justify-content: space-between;
  transition: margin-left 0.2s;

}
</style>
