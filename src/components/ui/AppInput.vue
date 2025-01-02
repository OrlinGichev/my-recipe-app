<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      ["text", "password", "email", "number", "tel", "url", "search"].includes(
        value
      ),
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

// Емитване на събития при промяна
const emit = defineEmits(["update:modelValue"]);

// Изчисляване на класовете според състоянието
const inputClasses = computed(() => ({
  input: true,
  "input--error": !!props.error,
  "input--disabled": props.disabled,
}));
</script>
<template>
  <div class="input-wrapper">
    <!-- Label -->
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <!-- Input -->
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <!-- Съобщение за грешка -->
    <span v-if="error" class="error-message">
      {{ error }}
    </span>
  </div>
</template>
<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
}

.label {
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 4px;
}

.required {
  color: #dc3545;
  margin-left: 4px;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.input--error {
  border-color: #dc3545;
}

.input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.input--disabled {
  background-color: #f8f8f8;
  cursor: not-allowed;
}

.error-message {
  font-size: 0.75rem;
  color: #dc3545;
}
</style>
