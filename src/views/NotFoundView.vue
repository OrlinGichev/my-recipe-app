<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Страницата не е намерена</h2>
    <p>Съжаляваме, но страницата, която търсите, не съществува.</p>
    <router-link to="/" class="home-link"> Към началната страница </router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 6rem;
  color: #b91a2f;
  margin: 0;
}

h2 {
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #b91a2f;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #790515;
}
</style>
