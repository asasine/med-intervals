<script setup lang="ts">
import IntervalsForm from "./components/IntervalsForm.vue";
import IntervalsList from "./components/IntervalsList.vue";
import { DateTime, Duration } from "luxon";
import { ref } from "vue";
import { refDebounced } from "@vueuse/core";

const footer_links = [
  { icon: "mdi-github", href: "https://github.com/asasine/med-interval" },
];

// TODO: debounce these refs before sending them to IntervalsList
const start = ref<DateTime>(DateTime.now().startOf("minute"));
const debouncedStart = refDebounced(start, 300);
const interval = ref<Duration>(Duration.fromObject({ hours: 8 }));
const debouncedInterval = refDebounced(interval, 300);
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Med Intervals</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <IntervalsForm v-model:start="start" v-model:interval="interval" />
        <v-divider></v-divider>
        <IntervalsList :start="debouncedStart" :interval="debouncedInterval" />
      </v-container>
    </v-main>

    <v-footer app class="bg-purple-lighten-2 d-flex justify-space-between">
      <div>{{ new Date().getFullYear() }} - Adam Sasine</div>

      <div>
        <v-btn
          v-for="{ icon, href } in footer_links"
          :key="href"
          :icon="icon"
          :href="href"
          variant="text"
          target="_blank"
        ></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<!-- <template>
  <main>
    <h1>Med Intervals</h1>
    <div>
        <div>
            <label for="start">Start:</label>
            <input
                id="start"
                type="datetime-local"
                name="interval-start"
                step="300"
                required />
            <button onclick="setStartToNow()">Now</button>
        </div>

        <input type="submit" value="Go" />
    </div>
    <div id="intervals">
        <ol>
            <li>2021-01-01 12:00</li>
            <li>2021-01-01 12:00</li>
        </ol>
    </div>
  </main>
  <footer>
    <div class="footer-name">
        Adam Sasine
    </div>
    <div class="footer-links">
        <a href="https://github.com/asasine">
            <i class="fa-brands fa-github"></i>
        </a>
        <a href="https://github.com/asasine/med-interval">
            <i class="fa-solid fa-code"></i>
        </a>
    </div>
  </footer>
</template> -->
