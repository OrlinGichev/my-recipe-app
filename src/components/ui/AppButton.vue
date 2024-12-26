<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "outline"].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
});

const buttonClasses = coomputed(() => ({
  button: true,
  [`button--${props.variant}`]: true,
  [`button--${props.size}`]: true,
  "button--disabled": props.disabled,
}));
</script>
<template>
  <button :class="buttonClasses" :type="type" :disabled="disabled">
    <slot></slot>
  </button>
</template>
<style scoped>
.button {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Варианти */
.button--primary {
  background-color: #4caf50;
  color: white;
}

.button--primary:hover:not(.button--disabled) {
  background-color: #45a049;
}

.button--secondary {
  background-color: #2196f3;
  color: white;
}

.button--secondary:hover:not(.button--disabled) {
  background-color: #1976d2;
}

.button--outline {
  background-color: transparent;
  border: 2px solid #4caf50;
  color: #4caf50;
}

.button--outline:hover:not(.button--disabled) {
  background-color: #4caf50;
  color: white;
}

/* Размери */
.button--small {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.button--medium {
  padding: 8px 16px;
  font-size: 1rem;
}

.button--large {
  padding: 12px 24px;
  font-size: 1.125rem;
}

/* Disabled състояние */
.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
