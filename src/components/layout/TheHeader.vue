<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
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
  gap: 2rem; /* пространство между линковете */
}

.nav-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #333;
}
</style>
