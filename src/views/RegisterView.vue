<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { useNotification } from "../composables/useNotification";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { computed, ref } from "vue";
import AppNotification from "../components/ui/AppNotification.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const { message, type, isVisible, showNotification } = useNotification();

const formData = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = {
  email: {
    required,
    email,
    $autoDirty: true,
  },
  password: {
    required,
    minLength: minLength(6),
    $autoDirty: true,
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(computed(() => formData.value.password)),
    $autoDirty: true,
  },
};

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  try {
    await authStore.registerUser(formData.value.email, formData.value.password);
    showNotification("Регистрацията е успешна!", "success");
    router.push("/"); // след успешна регистрация , пренасочваме към първоначалната страница
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        showNotification(
          "Този имейл адрес вече е регистриран. Моля, използвайте друг или влезте в профила си.",
          "error"
        );
        break;
      case "auth/invalid-email":
        showNotification(
          "Невалиден имейл адрес. Моля, проверете въведения имейл.",
          "error"
        );
        break;
      case "auth/operation-not-allowed":
        showNotification(
          "Регистрацията е временно недостъпна. Моля, опитайте по-късно.",
          "error"
        );
        break;
      case "auth/weak-password":
        showNotification("Паролата трябва да бъде поне 6 символа.", "error");
        break;
      default:
        showNotification(
          "Възникна грешка при регистрацията. Моля, опитайте отново.",
          "error"
        );
    }
  }
};
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
    <div class="auth-container">
      <h1 class="form-title">Регистрация</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <AppInput
            v-model="formData.email"
            type="email"
            label="Имейл"
            placeholder="example@email.com"
            :error="v$.email.$error ? 'Моля, въведете валиден имейл адрес' : ''"
            required
          />
        </div>
        <div class="form-group">
          <AppInput
            v-model="formData.password"
            type="password"
            label="Парола"
            placeholder="Минимум 6 символа"
            :error="
              v$.password.$error ? 'Паролата трябва да бъде поне 6 символа' : ''
            "
            required
          />
        </div>
        <div class="form-group">
          <AppInput
            v-model="formData.confirmPassword"
            type="password"
            label="Потвърди парола"
            placeholder="Въведете паролата отново"
            :error="v$.confirmPassword.$error ? 'Паролите не съвпадат' : ''"
            required
          />
        </div>

        <div class="form-actions">
          <AppButton type="submit" :disabled="v$.$invalid || authStore.loading">
            {{ authStore.loading ? "Зареждане..." : "Регистрация" }}
          </AppButton>
        </div>
        <div class="form-footer">
          <p>
            Вече имате акаунт?
            <router-link to="/auth/login">Вход</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.auth-container {
  max-width: 460px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 2rem;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.form-footer p {
  color: #4a5568;
  font-size: 0.9rem;
}

.form-footer a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #45a049;
  text-decoration: underline;
}

.required-mark {
  color: #e53e3e;
  margin-left: 4px;
}
</style>
