<script setup>
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated();
</script>

<template>
  <div class="home-page">
    <!-- Hero секция -->
    <section class="hero-section">
      <h1 class="hero-title">Добре дошли в света на вкусните рецепти</h1>
      <p class="hero-subtitle">
        Открийте, създайте и споделете любимите си кулинарни творения
      </p>
      <div class="cta-buttons">
        <router-link
          v-if="!isAuthenticated"
          to="/auth/register"
          class="cta-button primary"
        >
          Регистрирайте се сега
        </router-link>
        <router-link v-else to="/recipes" class="cta-button primary">
          Разгледайте рецепти
        </router-link>
      </div>
    </section>

    <!-- Характеристики на приложението -->
    <section class="features-section">
      <h2 class="section-title">Защо да използвате нашето приложение?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📖</div>
          <h3>Богата колекция</h3>
          <p>Открийте стотици изпитани рецепти от цял свят</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✏️</div>
          <h3>Създайте и споделете</h3>
          <p>Споделете вашите любими рецепти с общността</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Лесно търсене</h3>
          <p>Намерете точно това, което търсите</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💾</div>
          <h3>Запазете любимите</h3>
          <p>Съхранявайте любимите си рецепти на едно място</p>
        </div>
      </div>
    </section>

    <!-- Как работи секция -->
    <section class="how-it-works">
      <h2 class="section-title">Как работи?</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Регистрирайте се</h3>
          <p>Създайте безплатен акаунт за достъп до всички функции</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Разгледайте рецепти</h3>
          <p>Открийте разнообразие от вкусни рецепти</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Споделете своите</h3>
          <p>Добавете вашите любими рецепти</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: #4caf50;
  color: white;
}

.cta-button.primary:hover {
  background-color: #45a049;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.features-section {
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
}

.how-it-works {
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.step {
  text-align: center;
  padding: 2rem;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.step p {
  color: #666;
}
</style>
