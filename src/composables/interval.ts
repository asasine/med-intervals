import { DateTime, Duration, type DateTimeUnit } from "luxon";
import { onMounted, onUnmounted } from "vue";

/**
 * A timer that invokes a callback at regular intervals.
 *
 * This timer is more accurate than the built-in `setInterval` function by accounting for the time it takes to execute
 * the callback and any drift in the engine's timer. It also allows for the first invocation to be rounded to an
 * interval in order to align with the clock.
 */
class SteadyTimer {
  /** The function to be called at regular intervals. */
  private readonly callback: Function;

  /** The duration between invocations of the callback. */
  private readonly interval: Duration;

  /** Whether to round the first invocation to the next occurrence of the interval. */
  private readonly round: DateTimeUnit | null = null;

  /** The ID of the current timer. */
  private id: number | null = null;

  /**
   * Create a new timer.
   * @param callback The function to be called at regular intervals.
   * @param interval The duration between invocations of the callback.
   * @param round Whether to round the first invocation to the next occurrence of the interval.
   */
  constructor(callback: Function, interval: Duration, round?: DateTimeUnit) {
    this.callback = callback;
    this.interval = interval;
    if (round !== undefined) {
      this.round = round;
    }
  }

  /**
   * Start the timer.
   * @param immediate Whether to start the timer immediately or wait for the next occurrence of the interval.
   */
  start(immediate: boolean = false) {
    if (this.id !== null) {
      clearTimeout(this.id);
    }

    // calculate delay until next interval
    const now = DateTime.now();
    let start: DateTime;
    let delay: Duration;
    if (immediate || this.round === null) {
      start = now;
      delay = Duration.fromMillis(0);
    } else {
      // start is the next occurrence of the interval after now
      start = now.startOf(this.round).plus(this.interval);
      delay = start.diff(now);
      console.debug(
        `Delaying first invocation by ${delay.toISO()} from ${now.toISO()}`,
      );
    }

    const callback = () => {
      // calculate next that's aligned with the interval and after now
      const now = DateTime.now();
      let next = start;
      let i = 0;
      for (; next <= now; next = next.plus(this.interval), i++);
      if (i > 1) {
        console.warn(`Timer is behind by ${i} intervals.`);
      }

      this.callback();
      start = next;
      const delay = start.diff(now);
      console.debug(`Next invocation in ${delay.toISO()} at ${start.toISO()}`);
      this.id = setTimeout(callback, delay.milliseconds);
    };

    this.id = setTimeout(callback, delay.milliseconds);
  }

  /** Stop the timer. */
  stop() {
    if (this.id !== null) {
      clearInterval(this.id);
      this.id = null;
    }
  }
}

/**
 * Gets the duration between invocations of a callback at a given frequency.
 * @param frequency The frequency at which to update the current time.
 * @returns The duration between invocations of the callback.
 */
function getInterval(frequency: DateTimeUnit) {
  switch (frequency) {
    case "second":
      return Duration.fromObject({ seconds: 1 });
    case "minute":
      return Duration.fromObject({ minutes: 1 });
    case "hour":
      return Duration.fromObject({ hours: 1 });
    case "day":
      return Duration.fromObject({ days: 1 });
    case "week":
      return Duration.fromObject({ weeks: 1 });

    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}

/**
 * Composable function that invokes a callback at regular intervals.
 * The callback is invoked at the start of the interval and then at regular intervals thereafter.
 * @param callback The function to be called at regular intervals.
 * @param interval The frequency at which to invoke the callback.
 */
export function useSteadyInterval(callback: Function, interval: DateTimeUnit) {
  onMounted(() => {
    const timer = new SteadyTimer(callback, getInterval(interval), interval);
    timer.start();
    onUnmounted(() => timer.stop());
  });
}

/**
 * Composable function that invokes a callback at regular intervals.
 * @param callback The function to be called at regular intervals.
 * @param interval The duration between invocations of the callback.
 * @param immediate Whether to start the timer immediately or wait for one {@link interval}.
 */
export function useInterval(
  callback: Function,
  interval: Duration,
  immediate: boolean = false,
) {
  onMounted(() => {
    const timer = new SteadyTimer(callback, interval);
    timer.start(immediate);
    onUnmounted(() => timer.stop());
  });
}
