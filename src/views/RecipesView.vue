<script setup>
import { computed, onMounted, ref } from "vue";
import { useRecipesStore } from "../stores/recipes";
import { useNotification } from "../composables/useNotification";
// import { useAuthStore } from "../stores/auth";
// import { useFavoritesStore } from "../stores/favorites";
import AppNotification from "../components/ui/AppNotification.vue";
import AppSearch from "../components/ui/AppSearch.vue";
import RecipeCard from "../components/recipes/RecipeCard.vue";

const recipesStore = useRecipesStore();
const { message, type, isVisible, showNotification } = useNotification();

const isLoading = ref(false);

const loadRecipes = async () => {
  isLoading.value = true;

  try {
    await recipesStore.fetchRecipes();
  } catch (error) {
    showNotification("Грешка при зареждане на рецептите", "error");
  } finally {
    isLoading.value = false;
  }
};

// Зареждаме рецептите когато компонентът се монтира
onMounted(() => {
  loadRecipes();
});

const searchQuery = ref("");

const filteredRecipes = computed(() => {
  if (!recipesStore.recipes) return [];

  if (!searchQuery.value) return recipesStore.recipes;

  const query = searchQuery.value.toLowerCase();
  return recipesStore.recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query)
  );
});

const handleSearch = (query) => {
  searchQuery.value = query;
};
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
    <div class="recipes-view">
      <div class="recipes-header">
        <h1 class="view-title">Рецепти</h1>
        <div class="header-actions">
          <AppSearch @search="handleSearch" placeholder="Търси рецепта..." />
          <router-link to="/recipes/create" class="create-button">
            Добави рецепта
          </router-link>
        </div>
      </div>

      <!-- Състояние на зареждане -->
      <div v-if="isLoading" class="status-message loading">
        <div class="spinner"></div>
        <p>Зареждане на рецептите...</p>
      </div>

      <!-- Няма рецепти -->
      <div
        v-else-if="!recipesStore.recipes || recipesStore.recipes.length === 0"
        class="status-message empty"
      >
        <p>Все още няма добавени рецепти.</p>
        <router-link to="/recipes/create" class="create-link">
          Добави първата рецепта
        </router-link>
      </div>

      <!-- Списък с рецепти -->
      <div v-else class="recipes-grid">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipes-view {
  padding: 2rem;
}

.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-title {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.create-button {
  background-color: #4caf50;
  color: white;
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #45a049;
}

/* Стилове за съобщения за статус */
.status-message {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.header-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty {
  color: #666;
}

.create-link {
  display: inline-block;
  margin-top: 1rem;
  color: #4caf50;
  text-decoration: none;
}

.create-link:hover {
  text-decoration: underline;
}

/* Стилове за мрежата с рецепти */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* .recipe-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-15px);
}

.recipe-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-content {
  padding: 1.5rem;
}

.recipe-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
}

.recipe-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.cooking-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recipe-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
}

.favorite-action {
  padding: 8px;
  cursor: pointer;
}

.favorite-action i {
  font-size: 1.25rem;
  color: #666;
  transition: all 0.2s ease;
}

.favorite-action i.is-favorite {
  color: #ff4b4b;
}

.favorite-action:hover i {
  transform: scale(1.3);
}

.view-button {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}

.view-button:hover {
  text-decoration: underline;
} */
</style>
