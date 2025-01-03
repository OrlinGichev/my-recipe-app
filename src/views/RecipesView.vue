<script setup>
import { computed, onMounted, ref } from "vue";
import { useRecipesStore } from "../stores/recipes";
import { useFavoritesStore } from "../stores/favorites";
import { useNotification } from "../composables/useNotification";
import AppNotification from "../components/ui/AppNotification.vue";
import AppSearch from "../components/ui/AppSearch.vue";
import AppButton from "../components/ui/AppButton.vue";
import RecipeCard from "../components/recipes/RecipeCard.vue";

const recipesStore = useRecipesStore();
const favoritesStore = useFavoritesStore();
const { message, type, isVisible, showNotification } = useNotification();

const isLoading = ref(false);
const selectedCategory = ref("");

const categories = [
  "Всички",
  "Десерти",
  "Закуски",
  "Пилешки",
  "Паста",
  "Вегетариански",
  "Други",
];

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
const showOnlyFavorites = ref(false);

const filteredRecipes = computed(() => {
  if (!recipesStore.recipes) return [];

  let filtered = recipesStore.recipes;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value && selectedCategory.value !== "Всички") {
    filtered = filtered.filter(
      (recipe) => recipe.category === selectedCategory.value
    );
  }

  if (showOnlyFavorites.value) {
    filtered = filtered.filter((recipe) =>
      favoritesStore.isFavorite(recipe.id)
    );
  }

  return filtered;
});

const handleSearch = (query) => {
  searchQuery.value = query;
};

const toggleFavorites = () => {
  showOnlyFavorites.value = !showOnlyFavorites.value;
};

const itemsPerPage = ref(6);
const currentPage = ref(1);

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return filteredRecipes.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / itemsPerPage.value);
});

const changePage = (page) => {
  currentPage.value = page;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
    <div class="recipes-view">
      <div class="recipes-header">
        <h1 class="view-title">Рецепти</h1>
        <div class="header-actions">
          <AppButton
            @click="toggleFavorites"
            :class="{ 'active-filter': showOnlyFavorites }"
            class="favorites-filter"
          >
            <i class="fas fa-heart"></i>
            Любими
          </AppButton>
          <select v-model="selectedCategory" class="category-filter">
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
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
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="previousPage"
          class="pagination-button"
        >
          Предишна
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="['pagination-button', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="pagination-button"
        >
          Следваща
        </button>
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
.favorites-filter {
  background: transparent;
  border: 1px solid #ff4b4b;
  color: #ff4b4b;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.favorites-filter i {
  font-size: 0.9rem;
}

.favorites-filter:hover {
  background: rgba(225, 57, 57, 0.1) !important;
  border-color: #ff4b4b !important;
}

.favorites-filter.active-filter {
  background: #ff4b4b;
  color: white;
}

.category-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  margin-right: 1rem;
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
  align-items: start;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.pagination-button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
