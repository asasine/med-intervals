<script setup lang="ts">
import { DateTime, Duration } from "luxon";
import { computed, ref } from "vue";
import { useNow } from "@/composables/now";

interface Props {
  start: DateTime;
  interval: Duration;
}

interface Item {
  title: string;
  subtitle: string;
}

const { now } = useNow("minute");
const props = defineProps<Props>();
function toItem(date: DateTime): Item {
  const subtitle = date.toRelative({
    base: now.value,
    unit: ["years", "months", "days", "hours", "minutes"],
  }) as string;

  return {
    title: date.toLocaleString(DateTime.DATETIME_SHORT),
    subtitle: subtitle,
  };
}

const length = ref(10);
const items = computed<Item[]>(() =>
  Array.from({ length: length.value }, (_, i) =>
    toItem(
      props.start.plus(
        Duration.fromObject({ hours: i * props.interval.hours }),
      ),
    ),
  ),
);

type InfiniteScrollSide = "start" | "end" | "both";
type InfiniteScrollStatus = "ok" | "error" | "empty" | "loading";
interface InfiniteScrollLoadOptions {
  side: InfiniteScrollSide;
  done: (status: InfiniteScrollStatus) => void;
}

function load({ side, done }: InfiniteScrollLoadOptions) {
  if (side === "end") {
    length.value += 10;
  }

  done("ok");
}
</script>

<template>
  <v-infinite-scroll @load="load">
    <v-list lines="one">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :title="item.title"
        :subtitle="item.subtitle"
      >
      </v-list-item>
    </v-list>
  </v-infinite-scroll>
</template>
