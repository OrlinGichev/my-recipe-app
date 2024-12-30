<template>
  <div class="view-content">
    <h1 class="view-title">Условия за ползване</h1>
    <div class="terms-content">
      <section>
        <h2>1. Общи условия</h2>
        <p>Това са общите условия за ползване на нашето приложение...</p>
      </section>

      <section>
        <h2>2. Поверителност</h2>
        <p>Вашата поверителност е важна за нас...</p>
      </section>

      <section>
        <h2>3. Авторски права</h2>
        <p>Всички права запазени...</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.view-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #333;
}

.terms-content section {
  margin-bottom: 2rem;
}

.terms-content h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #444;
}

.terms-content p {
  line-height: 1.6;
  color: #666;
}
</style>
