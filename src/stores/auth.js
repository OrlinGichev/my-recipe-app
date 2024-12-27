import { defineStore } from "pinia";
import { auth } from "../services/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () =>{
    // State

    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters

    const isAuthenticated = () => !!user.value

    // Actions

    const registerUser = async ( email, password ) => {
        loading.value = true
        error.value = null
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            user.value = userCredential.user
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const loginUser = async ( email, password ) => {
        loading.value = true
        error.value = null
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            user.value = userCredential.user
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const logoutUser = async () => {
        try {
            await signOut(auth)
            user.value = null
        } catch (e) {
            error.value = e.message
            throw e
        }
    }

    const clearError = () => {
        error.value = null
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        registerUser,
        loginUser,
        logoutUser,
        clearError
    }
})