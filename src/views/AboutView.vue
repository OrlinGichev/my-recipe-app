<template>
  <div class="view-content">
    <h1 class="view-title">За нас</h1>

    <div class="about-content">
      <section class="about-section">
        <h2>Нашата история</h2>
        <p>
          "Моите Рецепти" е създадено от страстни любители на кулинарията с
          мисията да направи готвенето достъпно и вдъхновяващо за всеки. Нашето
          приложение е повече от сборник с рецепти - то е общност от хора, които
          споделят любовта си към хубавата храна.
        </p>
      </section>

      <section class="about-section">
        <h2>Нашата мисия</h2>
        <p>
          Вярваме, че готвенето е изкуство, което свързва хората и създава
          незабравими моменти. Стремим се да предоставим платформа, където както
          начинаещи, така и опитни готвачи могат да споделят своите кулинарни
          творения и да черпят вдъхновение един от друг.
        </p>
      </section>

      <section class="about-section">
        <h2>Какво предлагаме</h2>
        <ul>
          <li>Богата колекция от изпитани рецепти</li>
          <li>Възможност за споделяне на собствени рецепти</li>
          <li>Подробни инструкции и съвети</li>
          <li>Лесна организация на любими рецепти</li>
          <li>Активна общност от кулинарни ентусиасти</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Присъединете се към нас</h2>
        <p>
          Независимо дали сте начинаещ или опитен готвач, нашата платформа е
          място, където можете да откриете нови рецепти, да споделите своите
          кулинарни приключения и да се свържете с други ентусиасти. Заедно
          създаваме общност, в която всеки може да развие своите кулинарни
          умения и да сподели страстта си към готвенето.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.view-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-title {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #333;
  text-align: center;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section h2 {
  color: #4caf50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.about-section p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
}

.about-section ul {
  list-style-type: none;
  padding: 0;
}

.about-section li {
  padding: 0.5rem 0;
  color: #555;
  position: relative;
  padding-left: 1.5rem;
}

.about-section li::before {
  content: "•";
  color: #4caf50;
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>
