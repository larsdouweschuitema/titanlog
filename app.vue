<template>
  <div>
    <header class="app-nav-shell">
      <nav class="app-nav">
        <NuxtLink to="/" class="app-nav-link" active-class="app-nav-link-active">
          Events
        </NuxtLink>
        <NuxtLink to="/logboek" class="app-nav-link" active-class="app-nav-link-active">
          Logboek
        </NuxtLink>
      </nav>
    </header>

    <NuxtPage />
  </div>
</template>
