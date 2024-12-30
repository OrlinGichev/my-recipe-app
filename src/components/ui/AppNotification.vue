<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
    validator: (value) => ["success", "error", "warning"].includes(value),
  },
  isVisible: Boolean,
});
</script>

<template>
  <Transition name="notification">
    <div v-if="isVisible" :class="['notification', `notification--${type}`]">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  color: white;
  z-index: 1000;
}

.notification--success {
  background-color: #4caf50;
}

.notification--error {
  background-color: #dc3545;
}

.notification--warning {
  background-color: #ffc107;
  color: #333;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
