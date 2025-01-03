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

// Функция за превод на текст
async function translateText(text) {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: 'en|bg'
      }
    });
    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Грешка при превод:', error);
    return text; // връщаме оригиналния текст при грешка
  }
}

async function fetchAndImportRecipes() {
  try {
    console.log('Започва импортирането на рецепти...');
    
    // Вземаме само първите 5 рецепти от категория "Десерти"
    const mealsResponse = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert');
    const meals = mealsResponse.data.meals.slice(0, 5);

    for (const meal of meals) {
      console.log(`\nОбработка на рецепта: ${meal.strMeal}`);
      
      const detailsResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const recipe = detailsResponse.data.meals[0];

      // Превод на основните полета
      console.log('Превод на заглавие...');
      const translatedTitle = await translateText(recipe.strMeal);
      
      console.log('Превод на инструкции...');
      const translatedInstructions = await translateText(recipe.strInstructions);
      
      // Форматиране и превод на съставките
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          const translatedIngredient = await translateText(`${measure} ${ingredient}`);
          ingredients.push(translatedIngredient);
          console.log(`Преведена съставка: ${translatedIngredient}`);
        }
      }

      const difficulties = ['лесна', 'средна', 'трудна'];
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

      const formattedRecipe = {
        title: translatedTitle,
        description: (await translateText(recipe.strInstructions.slice(0, 150))) + '...',
        ingredients: ingredients.join('\n'),
        instructions: translatedInstructions,
        cookingTime: Math.floor(Math.random() * 60) + 30, // 30-90 минути
        difficulty: randomDifficulty,
        servings: Math.floor(Math.random() * 4) + 2, // 2-6 порции
        imageUrl: recipe.strMealThumb,
        userId: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Добавяме рецептата във Firebase
      await addDoc(collection(db, 'recipes'), formattedRecipe);
      console.log(`✓ Добавена рецепта: ${formattedRecipe.title}`);

      // Изчакване между рецептите
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✨ Всички рецепти са импортирани успешно!');
  } catch (error) {
    console.error('Грешка при импортиране на рецептите:', error);
  }
}

// Стартиране на импортирането
fetchAndImportRecipes();