<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRecipesStore } from "../stores/recipes";
import { useAuthStore } from "../stores/auth";
import { useNotification } from "../composables/useNotification";
import AppNotification from "../components/ui/AppNotification.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";

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
  difficulty: "medium",
  servings: "",
  imageUrl: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    // Добавяме ID на текущия потребител
    const recipeWithUser = {
      ...recipe.value,
      userId: authStore.user.uid,
    };

    await recipesStore.addRecipe(recipeWithUser);
    showNotification("Рецептата е създадена успешно!", "success");
    router.push("/recipes");
  } catch (error) {
    showNotification("Грешка при създаване на рецептата", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
    <div class="create-recipe">
      <h1 class="page-title">Създай нова рецепта</h1>
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
            <option value="easy">Лесна</option>
            <option value="medium">Средна</option>
            <option value="hard">Сложна</option>
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
            @click="router.push('/recipes')"
          >
            Отказ
          </AppButton>
          <AppButton type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Създаване..." : "Създай рецепта" }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.create-recipe {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.form-file-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

@media (max-width: 768px) {
  .create-recipe {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group.half {
    width: 100%;
  }
}
</style>
