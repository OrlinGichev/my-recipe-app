<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { ref } from "vue";
import { useNotification } from "../composables/useNotification";
import AppNotification from "../components/ui/AppNotification.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const { message, type, isVisible, showNotification } = useNotification();

const formData = ref({
  email: "",
  password: "",
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
};

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  try {
    await authStore.loginUser(formData.value.email, formData.value.password);
    showNotification("Успешен вход!", "success");
    router.push("/");
  } catch (error) {
    showNotification("Грешен имейл или парола", "error");
  }
};
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />

    <div class="login-form">
      <h1 class="form-title">Вход</h1>

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
            placeholder="Въведете парола"
            :error="
              v$.password.$error ? 'Паролата трябва да бъде поне 6 символа' : ''
            "
            required
          />
        </div>

        <div class="form-actions">
          <AppButton type="submit" :disabled="v$.$invalid || authStore.loading">
            {{ authStore.loading ? "Зареждане..." : "Вход" }}
          </AppButton>
        </div>

        <div class="form-footer">
          <p>
            Нямате акаунт?
            <router-link to="/auth/register">Регистрирайте се</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

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
