<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRecipesStore } from "../stores/recipes";
import { useAuthStore } from "../stores/auth";
import AppButton from "../components/ui/AppButton.vue";
import defaultRecipeImage from "../assets/default-recipe.jpg";

const route = useRoute();
const router = useRouter();
const recipesStore = useRecipesStore();
const authStore = useAuthStore();

const recipe = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

// Функция за зареждане на рецептата
const loadRecipe = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const recipeData = await recipesStore.fetchRecipeById(route.params.id);

    recipe.value = recipeData;
  } catch (error) {
    errorMessage.value = "Грешка при зареждане на рецептата";
  } finally {
    isLoading.value = false;
  }
};
// Функция за изтриване на рецепта
const handleDelete = async () => {
  if (!confirm("Сигурни ли сте, че искате да изтриете тази рецепта?")) {
    return;
  }

  try {
    await recipesStore.deleteRecipe(recipe.value.id);
    router.push("/recipes");
  } catch (error) {
    errorMessage.value = "Грешка при изтриване на рецептата";
    console.error("Error deleting recipe:", error);
  }
};

// Проверка дали текущият потребител е автор на рецептата
const isAuthor = () => {
  return recipe.value?.userId === authStore.user?.uid;
};

onMounted(() => {
  loadRecipe();
});
</script>
<template>
  <div class="recipe-details">
    <!-- Състояние на зареждане -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner">
        <p>Зареждане...</p>
      </div>
    </div>

    <!-- Съобщение за грешка -->
    <div v-else-if="errorMessage" class="error-state">
      <p>{{ errorMessage }}</p>
      <AppButton @click="loadRecipe">Опитай отново</AppButton>
    </div>

    <!-- Детайли на рецептата -->
    <div v-else-if="recipe" class="recipe-content">
      <div class="recipe-header">
        <h1>{{ recipe.title }}</h1>
        <div v-if="isAuthor()" class="recipe-actions">
          <AppButton
            variant="outline"
            @click="router.push(`/recipes/${recipe.id}/edit`)"
          >
            Редактирай
          </AppButton>
          <AppButton variant="secondary" @click="handleDelete">
            Изтрий
          </AppButton>
        </div>
      </div>
      <div class="recipe-image">
        <img :src="recipe.imageUrl || defaultRecipeImage" :alt="recipe.title" />
      </div>
      <div class="recipe-info">
        <div class="info-item">
          <span class="label">Време за приготвяне:</span>
          <span>{{ recipe.cookingTime }} минути</span>
        </div>
        <div class="info-item">
          <span class="label">Порции:</span>
          <span>{{ recipe.servings }}</span>
        </div>
        <div class="info-item">
          <span class="label">Сложност:</span>
          <span>{{ recipe.difficulty }}</span>
        </div>
      </div>

      <div class="recipe-description">
        <h2>Описание</h2>
        <p>{{ recipe.description }}</p>
      </div>

      <div class="recipe-ingredients">
        <h2>Съставки</h2>
        <p>{{ recipe.ingredients }}</p>
      </div>

      <div class="recipe-instructions">
        <h2>Начин на приготвяне</h2>
        <p>{{ recipe.instructions }}</p>
      </div>
    </div>

    <!-- Рецептата не е намерена -->
    <div v-else class="not-found">
      <p>Рецептата не е намерена</p>
      <AppButton @click="router.push('/recipes')">
        Към всички рецепти
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.recipe-details {
  background: white;
  color: #333;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.recipe-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.recipe-actions {
  display: flex;
  gap: 1rem;
}

.recipe-image {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
  color: #666;
}

.recipe-description,
.recipe-ingredients,
.recipe-instructions {
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.loading-state,
.error-state,
.not-found {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
