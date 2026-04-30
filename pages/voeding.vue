<script setup lang="ts">
const meals = [
  {
    title: 'Lunch',
    mealName: 'Pasta Chicken - Regular XXL Nutrition Fitmeals',
    calories: '603 kcal',
    fat: '20 g',
    carbs: '63,3 g',
    protein: '37 g'
  }
] as const
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Voeding</h1>
      <p class="overview-intro">
        Voorbeeldpagina voor maaltijden en macro’s. Voor nu staat hier één lunchmaaltijd op.
      </p>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Voorbeeldschema</p>
          <h2 class="week-title">Lunch</h2>
          <p class="week-range">Eerste voorbeeldmaaltijd voor je voedingsschema.</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="meal in meals"
          :key="meal.mealName"
          class="day-card training-example-card"
        >
          <span class="event-status-chip">{{ meal.title }}</span>
          <h3>{{ meal.mealName }}</h3>

          <div class="metric-row">
            <span class="metric-pill">Energie {{ meal.calories }}</span>
            <span class="metric-pill">Vet {{ meal.fat }}</span>
            <span class="metric-pill">Koolhydraten {{ meal.carbs }}</span>
            <span class="metric-pill">Eiwitten {{ meal.protein }}</span>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
