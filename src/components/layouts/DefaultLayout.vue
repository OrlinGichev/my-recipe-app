<script setup>
import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
</script>
<template>
  <div class="layout">
    <TheHeader />
    <main class="main-content">
      <slot></slot>
    </main>
    <TheFooter />
  </div>
</template>
<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}
</style>
