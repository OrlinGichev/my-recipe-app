<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRecipesStore } from "../stores/recipes";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "../composables/useNotification";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  numeric,
  url,
  maxLength,
} from "@vuelidate/validators";
import AppNotification from "../components/ui/AppNotification.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

const route = useRoute();
const router = useRouter();
const recipesStore = useRecipesStore();
const authStore = useAuthStore();
const { message, type, isVisible, showNotification } = useNotification();

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

const rules = {
  title: {
    required,
    minLength: minLength(3),
    $autoDirty: true,
  },
  description: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(200),
    $autoDirty: true,
  },
  ingredients: {
    required,
    minLength: minLength(5),
    $autoDirty: true,
  },
  instructions: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(200),
    $autoDirty: true,
  },
  cookingTime: {
    required,
    numeric,
    $autoDirty: true,
  },
  difficulty: {
    required,
    $autoDirty: true,
  },
  servings: {
    required,
    numeric,
    $autoDirty: true,
  },
  imageUrl: {
    url,
    $autoDirty: true,
  },
};

const isSubmitting = ref(false);
const isLoading = ref(true);

const v$ = useVuelidate(rules, recipe);

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
    showNotification("Грешка при зареждане на рецептата", "error");
    // errorMessage.value = "Грешка при зареждане на рецептата";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  const result = await v$.value.$validate();
  if (!result) {
    showNotification(
      "Моля попълнете всички задължителни полета коректно",
      "error"
    );
    return;
  }

  isSubmitting.value = true;

  try {
    const recipeWithUser = {
      ...recipe.value,
      userId: authStore.user.uid,
    };

    await recipesStore.updateRecipe(recipeWithUser);
    showNotification("Рецептата е коригирана успешно!", "success");
    router.push("/recipes");
  } catch (error) {
    showNotification("Грешка при коригиране на рецептата", "error");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadRecipe();
});
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
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
              :error="
                v$.title.$error
                  ? 'Заглавието трябва да бъде поне 3 символа'
                  : ''
              "
              required
            />
          </div>
          <div class="form-group">
            <AppInput
              v-model="recipe.description"
              label="Кратко описание"
              placeholder="Въведете кратко описание"
              :error="
                v$.description.$error
                  ? 'Описанието трябва да бъде поне 10 символа и не повече от 200 символа'
                  : ''
              "
              required
            />
          </div>

          <div class="form-group">
            <AppInput
              v-model="recipe.ingredients"
              label="Съставки"
              placeholder="Въведете съставките, всяка на нов ред"
              :error="
                v$.ingredients.$error
                  ? 'Съставките трябва да бъдат поне 5 символа'
                  : ''
              "
              required
            />
          </div>

          <div class="form-group">
            <AppInput
              v-model="recipe.instructions"
              label="Инструкции"
              placeholder="Въведете инструкциите стъпка по стъпка"
              :error="
                v$.instructions.$error
                  ? 'Инструкциите трябва да бъдат поне 10 символа и не повече от 200 символа'
                  : ''
              "
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
                :error="
                  v$.cookingTime.$error
                    ? 'Времето трябва да бъде положително число'
                    : ''
                "
                required
              />
            </div>
            <div class="form-group half">
              <AppInput
                v-model="recipe.servings"
                label="Порции"
                type="number"
                min="1"
                :error="
                  v$.servings.$error
                    ? 'Порциите трябва да бъдат положително число'
                    : ''
                "
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
