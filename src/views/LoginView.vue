<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ref } from "vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";
import { errorMessages } from "vue/compiler-sfc";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");

const handleSubmit = async () => {
  if (!email.value || password.value) {
    errorMessages.value = "Моля, попълнете всички полета";
    return;
  }

  try {
    await authStore.loginUser(email.value, password.value);
    router.push("/"); // Пренасочваме към първоначалната страница
  } catch (error) {
    errorMessages.value = "Грешен имейл или парола";
  }
};
</script>

<template>
  <div class="login-form">
    <h1 class="form-title">Вход</h1>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <AppInput
          v-model="email"
          type="email"
          label="Имейл"
          placeholder="example@email.com"
          required
        />
      </div>
      <div class="form-group">
        <AppInput
          v-model="password"
          type="password"
          label="Парола"
          placeholder="Въведете парола"
          required
        />
      </div>

      <div v-if="errorMessages" class="error-message">
        {{ errorMessages }}
      </div>

      <div class="form-actions">
        <AppButton type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? "Зареждане..." : "Вход" }}
        </AppButton>
      </div>

      <div class="form-footer">
        <p>
          Нямате акаунт?
          <router-link to="/auth/register">Регистрирай се</router-link>
        </p>
      </div>
    </form>
  </div>
</template>
<script setup></script>
<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  width: 100%;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  text-align: center;
}

.form-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.form-footer a {
  color: #4caf50;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
