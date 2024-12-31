<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { auth } from "../../services/firebase";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await authStore.logoutUser();
    router.push("/auth/login");
  } catch (error) {
    console.error("Грешка при излизане:", error);
  }
};
</script>
<template>
  <header class="header">
    <nav class="nav-container">
      <div class="nav-wrapper">
        <div class="logo">
          <router-link to="/"> Моето приложение </router-link>
        </div>
        <div class="nav-links">
          <router-link to="/"> Начало </router-link>
          <router-link to="/recipes"> Рецепти </router-link>
          <router-link to="/about"> За нас </router-link>
          <template v-if="authStore.isAuthenticated()">
            <span class="user-email">{{ authStore.user?.email }}</span>
            <button @click="handleLogout" class="logout-button">Изход</button>
          </template>
          <template v-else>
            <router-link to="/auth/login" class="auth-link"> Вход </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
}

.logo a {
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #333;
}

.logout-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.logout-button:hover {
  color: #c82333;
}

.auth-link {
  color: #4caf50 !important;
}
</style>
