<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useFavoritesStore } from "../../stores/favorites";
import { useNotification } from "../../composables/useNotification";
import AppNotification from "../../components/ui/AppNotification.vue";
import defaultRecipeImage from "../../assets/default-recipe.jpg";

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const { message, type, isVisible, showNotification } = useNotification();

// Проверяваме дали рецептата е в любими при зареждане
const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.recipe.id);
});

const toggleFavorite = async () => {
  if (!authStore.user) {
    showNotification("Моля, влезте в профила си първо", "warning");
    return;
  }
  try {
    if (isFavorite.value) {
      await favoritesStore.removeFromFavorites(
        authStore.user.uid,
        props.recipe.id
      );
      isFavorite.value = false;
      showNotification("Рецептата е премахната от любими", "success");
    } else {
      await favoritesStore.addToFavorites(authStore.user.uid, props.recipe.id);
      isFavorite.value = true;
      showNotification("Рецептата е добавена в любими", "success");
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    showNotification("Възникна грешка", "error");
  }
};
</script>

<template>
  <div>
    <AppNotification :message="message" :type="type" :isVisible="isVisible" />
    <div class="recipe-card">
      <div class="recipe-image">
        <img :src="recipe.imageUrl || defaultRecipeImage" :alt="recipe.title" />
      </div>
      <div class="recipe-content">
        <span class="category">
          {{ recipe.category || "Други" }}
        </span>
        <h3>{{ recipe.title }}</h3>
        <p class="recipe-description">{{ recipe.description }}</p>
        <div class="recipe-meta">
          <span class="cooking-time">
            <i class="time-icon"></i>
            {{ recipe.cookingTime }} мин
          </span>
          <span class="difficulty">
            {{ recipe.difficulty }}
          </span>
        </div>
        <div class="recipe-footer">
          <div class="favorite-action">
            <i
              :class="[
                isFavorite ? 'fas fa-heart' : 'far fa-heart',
                { 'is-favorite': isFavorite },
              ]"
              @click="toggleFavorite"
            ></i>
          </div>
          <router-link :to="`/recipes/${recipe.id}`" class="view-button">
            Виж повече
          </router-link>
        </div>
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

.recipe-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.category {
  background-color: #5b8bbb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
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
}
</style>
