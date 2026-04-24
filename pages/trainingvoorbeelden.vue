<script setup lang="ts">
const exampleBlocks = [
  {
    title: 'Na krachttraining',
    duration: '5-6 min finisher',
    label: 'Finisher',
    summary: 'Korte bovenlichaam-finisher na een krachtsessie.',
    structure: '40 sec werk / 20 sec rust · 2 rondes',
    goal: 'Bovenlichaam voller maken: borst, schouders en rug voor een monster look.',
    exercises: [
      'Push-ups',
      'Pull-ups',
      'Lateral raises'
    ]
  },
  {
    title: 'Core blok',
    duration: '10 min core',
    label: 'Core',
    summary: 'Inzetbaar na je training of op losse dagen.',
    structure: '40 sec werk / 20 sec rust · 2 rondes',
    goal: 'Core kracht, zichtbare abs en meer rotatiekracht.',
    exercises: [
      'Hanging leg raises',
      'Russian twists',
      'Plank',
      'Bicycle crunch'
    ]
  }
] as const
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">Titan Training Camp</p>
      <h1>Trainingvoorbeelden</h1>
      <p class="overview-intro">
        Vaste blokken die je snel kunt toevoegen na een sessie of op losse dagen, zonder opnieuw te hoeven nadenken.
      </p>
    </section>

    <section class="week-section">
      <div class="section-header">
        <div>
          <p class="section-kicker">Altijd bruikbaar</p>
          <h2 class="week-title">Snelle extra blokken</h2>
          <p class="week-range">Gebruik deze voorbeelden als finisher, core-blok of losse aanvulling op je week.</p>
        </div>
      </div>

      <div class="day-grid">
        <article
          v-for="block in exampleBlocks"
          :key="block.title"
          class="day-card training-example-card"
        >
          <span class="event-status-chip">{{ block.label }}</span>
          <h3>{{ block.title }}</h3>
          <p class="event-summary">{{ block.summary }}</p>

          <div class="event-chip-row">
            <span class="history-chip">{{ block.duration }}</span>
            <span class="history-chip">{{ block.structure }}</span>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Oefeningen</p>
            <ul class="log-list">
              <li v-for="exercise in block.exercises" :key="exercise">{{ exercise }}</li>
            </ul>
          </div>

          <div class="training-example-section">
            <p class="training-example-title">Doel</p>
            <p class="event-summary">{{ block.goal }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
