import { defineStore } from "pinia";
import { ref } from "vue";
import { recipesService } from '../services/recipesService'

export const useRecipesStore = defineStore('recipes', () =>{
    // State
    const recipes = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const getAllRecipes = () => recipes.value
    const getRecipeById = (id) => recipes.value.find(recipe => recipe.id === id)

    // Actions
    const fetchRecipes = async () => {
        loading.value = true
        error.value = null
        try {            
            const response = await recipesService.getAllRecipes()            
            recipes.value = response || []
        } catch (e) {
           error.value = e.message || 'Възникна грешка при зареждане на рецептите'
            throw e
        } finally {
            loading.value = false
        }
    }

    const addRecipe = async (recipeData) => {
        loading.value = true
        error.value = null
        try {          
            const response = await recipesService.createRecipe(recipeData)   
            if (!recipes.value) recipes.value = [];
            recipes.value.push(response);
            return response;
        } catch (e) {
             error.value = e.message || 'Възникна грешка при добавяне на рецептата'
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateRecipe = async (id, recipeData) => {
        loading.value = true
        error.value = null
        try {          
            const response = await recipesService.updateRecipe(id, recipeData)   
            const index = recipes.value.findIndex(recipe => recipe.id === id)
            if (index !== -1) {
                recipes.value[index] = response.data
            }
            return response.data
        } catch (e) {
             error.value = e.message || 'Възникна грешка при обновяване на рецептата'
            throw e
        } finally {
            loading.value = false
        }
    }

    const deleteRecipe = async (id) => {
        loading.value = true
        error.value = null
        try {
            await recipesService.deleteRecipe(id)
            recipes.value = recipes.value.filter(recipe => recipe.id !== id)
        } catch (e) {
            error.value = e.message || 'Възникна грешка при изтриване на рецептата'
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        recipes,
        loading,
        error,
        getAllRecipes,
        getRecipeById,
        fetchRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe
    }
})