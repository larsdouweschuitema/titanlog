<script setup lang="ts">
import EventCampView from '~/components/EventCampView.vue'
import { events, getEventById } from '~/data/events'

const route = useRoute()
const event = computed(() => getEventById(route.params.id as string))

if (!event.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Event not found'
  })
}
</script>

<template>
  <div>
    <header class="page-shell event-subnav-shell">
      <div class="event-subnav">
        <NuxtLink to="/" class="event-back-link">← Back to events</NuxtLink>
        <div class="event-switcher">
          <NuxtLink
            v-for="item in events"
            :key="item.id"
            :to="`/events/${item.id}`"
            class="event-switcher-link"
            :class="{ 'event-switcher-link-active': item.id === event?.id }"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <EventCampView v-if="event" :event="event" />
  </div>
</template>
