import { defineStore } from "pinia";
import { ref } from "vue"
import { favoritesService } from "../services/favoritesService"

export const useFavoritesStore = defineStore('favorites', () =>{
    // State
    const favorites = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Actions

    const fetchUserFavorites = async (userId) => {
        loading.value = true
        error.value = null

        try {
            const favoritesIds = await favoritesService.getUserFavorites(userId)
            favorites.value = favoritesIds
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const addToFavorites = async (userId, recipeId) =>{
        loading.value = true
        error.value = null

        try {
            await favoritesService.addToFavorites(userId, recipeId)
            favorites.value.push(recipeId)
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const removeFromFavorites  = async (userId, recipeId) =>{
        loading.value = true
        error.value = null

        try {
            await favoritesService.removeFromFavorites(userId, recipeId)
            favorites.value = favorites.value.filter( id => id !== recipeId)
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const isFavorite = (recipeId) => {
        return favorites.value.includes(recipeId)
    }

    return {
        favorites,
        loading,
        error,
        fetchUserFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }
})