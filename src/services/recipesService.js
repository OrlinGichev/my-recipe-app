import { db, storage } from './firebase'
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const RECIPES_COLLECTION = 'recipes'

export const recipesService = {

    // Вземане на всички рецепти
    async getAllRecipes() {
      
        try {
            const querySnapshot = await getDocs(collection(db, RECIPES_COLLECTION));
            const recipes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return recipes;
        } catch (error) {

            throw error;
        }
    },

    // Вземане на конкретна рецепта по ID
    async getRecipeById(id) {
        try {
           
            const docRef = doc(db,RECIPES_COLLECTION, id)
            const docSnap = await getDoc(docRef)          

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data
                };
            } 

            throw new Error('Рецептата не е намерена')
        } catch (error) {
            throw error;
        }
    },

      // Създаване на нова рецепта
      
    async createRecipe(recipeData) {        
        // Създаване на рецептата в Firestore
        try {
        const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
            ...recipeData,       
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return {
            id: docRef.id,
            ...recipeData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        } catch (error) {
            console.error('Error in createRecipe:', error);
            throw error;
        }
    },

     // Обновяване на рецепта
     async updateRecipe(id, recipeData, imageFile) {
        let imageUrl = recipeData.imageUrl
         // Качване на ново изображение ако има такова
         if(imageFile){
            const storageRef = ref(storage, `recipe-images/${Date.now()}-${imageFile.name}`)
            await uploadBytes(storageRef, imageFile)
            imageUrl = await getDownloadURL(storageRef)
         }
         const docRef = doc(db, RECIPES_COLLECTION, id)
         await updateDoc(docRef, {
             ...recipeData,
             imageUrl,
             updatedAt: new Date()
         })
 
         return {
             id,
             ...recipeData,
             imageUrl
         }
    },

     // Изтриване на рецепта
     async deleteRecipe(id) {
        const docRef = doc(db, RECIPES_COLLECTION, id)
        await deleteDoc(docRef)
    },

    // Вземане на рецепти по потребител
    async getRecipesByUser(userId){
        const q = query(
            collection(db,RECIPES_COLLECTION),
            where("userId","==", userId)
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }))
    }
}