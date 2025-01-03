// importRecipes.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORIES_MAP = {
  'Dessert': 'Десерти',
  'Breakfast': 'Закуски',
  'Chicken': 'Пилешки',
  'Pasta': 'Паста',
  'Vegetarian': 'Вегетариански'
};

async function translateText(text) {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: text, langpair: 'en|bg' }
    });
    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Грешка при превод:', error);
    return text;
  }
}

async function fetchAndImportRecipes() {
  try {
    for (const [apiCategory, bgCategory] of Object.entries(CATEGORIES_MAP)) {
      console.log(`\n📂 Обработка на категория: ${bgCategory}`);
      
      const mealsResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${apiCategory}`);
      const meals = mealsResponse.data.meals.slice(0, 10); // 10 рецепти от всяка категория

      for (const meal of meals) {
        console.log(`\n🍽️ Обработка на рецепта: ${meal.strMeal}`);
        
        const detailsResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const recipe = detailsResponse.data.meals[0];

        console.log('Превод на заглавие...');
        const translatedTitle = await translateText(recipe.strMeal);
        
        console.log('Превод на инструкции...');
        const translatedInstructions = await translateText(recipe.strInstructions);
        
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = recipe[`strIngredient${i}`];
          const measure = recipe[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            const translatedIngredient = await translateText(`${measure} ${ingredient}`);
            ingredients.push(translatedIngredient);
          }
        }

        const difficulties = ['лесна', 'средна', 'трудна'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        const formattedRecipe = {
          title: translatedTitle,
          description: (await translateText(recipe.strInstructions.slice(0, 150))) + '...',
          ingredients: ingredients.join('\n'),
          instructions: translatedInstructions,
          cookingTime: Math.floor(Math.random() * 60) + 30,
          difficulty: randomDifficulty,
          servings: Math.floor(Math.random() * 4) + 2,
          imageUrl: recipe.strMealThumb,
          category: bgCategory,
          userId: 'system',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await addDoc(collection(db, 'recipes'), formattedRecipe);
        console.log(`✅ Добавена рецепта: ${formattedRecipe.title}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n✨ Всички рецепти са импортирани успешно!');
  } catch (error) {
    console.error('❌ Грешка при импортиране:', error);
  }
}

fetchAndImportRecipes();