import api from './api'

export const recipesService = {

    // Вземане на всички рецепти
    getAllRecipes() {
        return api.get('/recipes')
    },

    // Вземане на конкретна рецепта по ID
    getRecipeById(id) {
        return api.get(`/recipes/${id}`)
    },

      // Създаване на нова рецепта
      createRecipe(recipeData) {
        return api.post('/recipes', recipeData)
    },

     // Обновяване на рецепта
     updateRecipe(id, recipeData) {
        return api.put(`/recipes/${id}`, recipeData)
    },

     // Изтриване на рецепта
     deleteRecipe(id) {
        return api.delete(`/recipes/${id}`)
    }
}