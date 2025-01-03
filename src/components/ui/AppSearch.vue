<script setup>
import { ref, watch } from "vue";
import AppInput from "./AppInput.vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Търсене...",
  },
});

const emit = defineEmits(["search"]);
const searchTerm = ref("");

// Изчакваме 300ms след последното въвеждане преди да емитнем събитието
let timeout;
watch(searchTerm, (newValue) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("search", newValue);
  }, 3000);
});

const handleEnter = () => {
  clearTimeout(timeout);
  emit("search", searchTerm.value);
};
</script>

<template>
  <div class="search-container">
    <AppInput
      v-model="searchTerm"
      :placeholder="placeholder"
      type="search"
      @keyup.enter="handleEnter"
    >
      <template #prefix>
        <span class="search-icon">🔍</span>
      </template>
    </AppInput>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  color: #666;
  margin-right: 0.5rem;
}

.input-wrapper {
  margin-bottom: 0rem;
}
</style>
