<script setup>
import TheHeader from "../../components/layout/TheHeader.vue";
import TheFooter from "../../components/layout/TheFooter.vue";
import { watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useFavoritesStore } from "../../stores/favorites";

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

// Зареждаме любимите рецепти при промяна на потребителя
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      favoritesStore.fetchUserFavorites(newUser.uid);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="layout">
    <TheHeader />
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <TheFooter />
  </div>
</template>
<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgba(245, 245, 245, 0.7);
  padding: 1rem;
  margin: 2rem auto;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Анимации за преход между страници */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
