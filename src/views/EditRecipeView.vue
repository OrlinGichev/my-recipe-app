<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRecipesStore } from "../stores/recipes";
import { useAuthStore } from "../stores/auth";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const route = useRoute();
const router = useRouter();
const recipesStore = useRecipesStore();
const authStore = useAuthStore();

const recipe = ref({
  title: "",
  description: "",
  ingredients: "",
  instructions: "",
  cookingTime: "",
  difficulty: "средна",
  servings: "",
  imageUrl: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);
const isLoading = ref(true);

// Зареждане на данните за рецептата
const loadRecipe = async () => {
  try {
    const recipeData = await recipesStore.fetchRecipeById(route.params.id);

    if (recipeData.userId !== authStore.user?.uid) {
      router.push("/recipes");
      return;
    }

    // Попълване на формата с данните
    recipe.value = {
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      cookingTime: recipeData.cookingTime,
      difficulty: recipeData.difficulty,
      servings: recipeData.servings,
      imageUrl: recipeData.imageUrl,
    };
  } catch (error) {
    errorMessage.value = "Грешка при зареждане на рецептата";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await recipesStore.updateRecipe(route.params.id, recipe.value);
    router.push(`/recipes/${route.params.id}`);
  } catch (error) {
    errorMessage.value =
      error.message || "Възникна грешка при обновяване на рецептата";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadRecipe();
});
</script>

<template>
  <div class="edit-recipe">
    <div v-if="isLoading" class="loading-state">
      <p>Зареждане...</p>
    </div>

    <template v-else>
      <h1 class="page-title">Редактиране на рецепта</h1>
      <form @submit.prevent="handleSubmit" class="recipe-form">
        <div class="form-group">
          <AppInput
            v-model="recipe.title"
            label="Заглавие"
            placeholder="Въведете заглавие на рецептата"
            required
          />
        </div>
        <div class="form-group">
          <AppInput
            v-model="recipe.description"
            label="Кратко описание"
            placeholder="Въведете кратко описание"
            required
          />
        </div>

        <div class="form-group">
          <AppInput
            v-model="recipe.ingredients"
            label="Съставки"
            placeholder="Въведете съставките, всяка на нов ред"
            required
          />
        </div>

        <div class="form-group">
          <AppInput
            v-model="recipe.instructions"
            label="Инструкции"
            placeholder="Въведете инструкциите стъпка по стъпка"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <AppInput
              v-model="recipe.cookingTime"
              label="Време за приготвяне (минути)"
              type="number"
              min="1"
              required
            />
          </div>
          <div class="form-group half">
            <AppInput
              v-model="recipe.servings"
              label="Порции"
              type="number"
              min="1"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Сложност</label>
          <select v-model="recipe.difficulty" class="form-select">
            <option value="лесна">Лесна</option>
            <option value="средна">Средна</option>
            <option value="трудна">Сложна</option>
          </select>
        </div>

        <div class="form-group">
          <AppInput
            v-model="recipe.imageUrl"
            label="URL на снимката"
            placeholder="Въведете URL на снимката на рецептата"
            type="url"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <AppButton
            type="button"
            variant="outline"
            @click="router.push(`/recipes/${route.params.id}`)"
          >
            Отказ
          </AppButton>
          <AppButton type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Запазване..." : "Запази промените" }}
          </AppButton>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
.edit-recipe {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-state {
  text-align: center;
  padding: 2rem;
}

.page-title {
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  width: 100%;
}

.form-group.half {
  width: 50%;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.875rem;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
