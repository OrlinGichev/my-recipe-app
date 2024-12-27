<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { computed, ref } from "vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();

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

const errorMessage = ref("");

const handleSubmit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  try {
    await authStore.registerUser(formData.value.email, formData.value.password);
    router.push("/"); // след успешна регистрация , пренасочваме към първоначалната страница
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      errorMessage.value = "Този имейл вече е регистриран";
    } else if (error.code === "auth/invalid-email") {
      errorMessage.value = "Невалиден имейл адрес";
    } else {
      errorMessage.value = "Възникна грешка при регистрацията";
    }
  }
};
</script>

<template>
  <div class="register-form">
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
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
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
</template>
<style scoped>
.register-form {
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
