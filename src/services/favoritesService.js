import { db } from './firebase'
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc,
    setDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore'

const FAVORITES_COLLECTION = 'favorites'

export const favoritesService = {
     // Добавяне на рецепта към любими
     async addToFavorites(userId, recipeId) {
        const docRef = doc(db, FAVORITES_COLLECTION, `${userId}_${recipeId}`)
        await setDoc(docRef, {
            userId,
            recipeId,
            createdAt: new Date()
        })
    },

    // Премахване на рецепта от любими
    async removeFromFavorites(userId, recipeId) {
        const docRef = doc(db, FAVORITES_COLLECTION, `${userId}_${recipeId}`)
        await deleteDoc(docRef)
    },

     // Вземане на всички любими рецепти на потребител
     async getUserFavorites(userId) {
        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where("userId", "==", userId)
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => doc.data().recipeId)
    },

    // Проверка дали рецептата е в любими
    async isFavorite(userId, recipeId) {
        const docRef = doc(db, FAVORITES_COLLECTION, `${userId}_${recipeId}`)
        const docSnap = await getDoc(docRef)
        return docSnap.exists()
    }
}