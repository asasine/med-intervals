import { DateTime, type DateTimeUnit } from "luxon";
import { ref } from "vue";
import { useSteadyInterval } from "./interval";

/**
 * Composable function that returns the current time and updates it at a given frequency.
 * @param frequency The frequency at which to update the current time.
 * @returns An object containing the current time.
 */
export function useNow(frequency: DateTimeUnit = "second") {
  const now = ref(DateTime.now());
  function update() {
    now.value = DateTime.now();
  }

  useSteadyInterval(update, frequency);
  return {
    now,
  };
}
