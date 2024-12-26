<script setup>
const currentYear = new Date().getFullYear();
</script>
<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-links">
        <router-link to="/about">За нас</router-link>
        <router-link to="/contacts">Контакти</router-link>
        <router-link to="/terms">Условия за ползване</router-link>
      </div>
      <div class="copyright">
        © {{ currentYear }} МоетоПриложение. Всички права запазени.
      </div>
    </div>
  </footer>
</template>
<style scoped>
.footer {
  background-color: #f8f8f8;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer-links {
  margin-bottom: 1rem;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #333;
}

.copyright {
  color: #888;
  font-size: 0.9rem;
}
</style>
