<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppInput from "../components/ui/AppInput.vue";
import { ref } from "vue";

const testInput = ref("");
</script>
<template>
  <div class="test-page">
    <h1>Тест на компоненти</h1>

    <section class="component-section">
      <h2>Бутони</h2>
      <div class="buttons-showcase">
        <AppButton>Нормален бутон</AppButton>
        <AppButton variant="secondary">Вторичен бутон</AppButton>
        <AppButton variant="outline">Очертан бутон</AppButton>
        <AppButton size="large">Голям бутон</AppButton>
        <AppButton disabled>Неактивен бутон</AppButton>
      </div>
    </section>

    <section class="component-section">
      <h2>Input полета</h2>
      <div class="inputs-showcase">
        <AppInput
          v-model="testInput"
          label="Нормално поле"
          placeholder="Въведете текст"
        />
        <AppInput
          label="Задължително поле"
          required
          placeholder="Това поле е задължително"
        />
        <AppInput
          label="Поле с грешка"
          error="Това е примерна грешка"
          placeholder="Грешно поле"
        />
        <AppInput label="Неактивно поле" disabled placeholder="Неактивно" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.test-page h1 {
  margin-bottom: 2rem;
}

.component-section {
  margin-bottom: 3rem;
}

.component-section h2 {
  margin-bottom: 1rem;
}

.buttons-showcase {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.inputs-showcase {
  max-width: 400px;
}
</style>
