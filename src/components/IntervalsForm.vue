<script setup lang="ts">
import { DateTime, Duration } from "luxon";

interface Props {
  start: DateTime;
  interval: Duration;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:start": [value: DateTime];
  "update:interval": [value: Duration];
}>();

function emitStart(value: string) {
  emit("update:start", DateTime.fromISO(value));
}

function emitInterval(value: string | number | Duration) {
  if (typeof value === "string") {
    value = parseInt(value);
  }

  if (typeof value === "number") {
    value = Duration.fromObject({ hours: value });
  }

  emit("update:interval", value);
}

function stepInterval(hours: number) {
  emitInterval(props.interval.plus({ hours }));
}
</script>

<template>
  <v-form>
    <v-text-field
      type="datetime-local"
      label="Start"
      hint="Start of the interval"
      step="300"
      :model-value="props.start.toFormat('yyyy-MM-dd\'T\'HH:mm')"
      @update:model-value="emitStart"
      required
    />

    <v-text-field
      type="number"
      min="1"
      max="24"
      suffix="hours"
      hint="Hours between each interval"
      @focus="$event.target.select()"
      :model-value="props.interval.hours"
      @update:model-value="emitInterval"
      required
    />

    <v-slider
      min="1"
      max="24"
      :step="1"
      persistent-hint
      :model-value="props.interval.hours"
      @update:model-value="emitInterval"
      required
    >
      <template v-slot:prepend>
        <v-btn
          size="small"
          variant="text"
          icon="mdi-minus"
          @click.prevent="stepInterval(-1)"
        ></v-btn>
      </template>

      <template v-slot:append>
        <div class="d-flex">
          <v-btn
            size="small"
            variant="text"
            icon="mdi-plus"
            @click.prevent="stepInterval(1)"
          ></v-btn>
        </div>
      </template>
    </v-slider>
  </v-form>
</template>
