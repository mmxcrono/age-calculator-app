<script setup lang="ts">
import IconArrow from '@/assets/icon-arrow.svg?raw';
import NumberInput from '@/components/NumberInput.vue';
import { Ref, ref } from 'vue';
import { ErrorMessages } from '@/enums/ErrorMessages';
import { getDateString } from '@/util/getDateString';
import { checkValidDate } from '@/util/checkValidDate';
import { DAY_MS, MONTH_MS, YEAR_MS } from '@/constants/dateConstants';

const { FieldRequired, InvalidDay, InvalidMonth, InvalidYear, MustBeInPast } = ErrorMessages;

const dayError = ref<string | undefined>();
const dayValue = ref<number | undefined>();
const daysAgo = ref<number | undefined>();

const monthError = ref<string | undefined>();
const monthValue = ref<number | undefined>();
const monthsAgo = ref<number | undefined>();

const yearError = ref<string | undefined>();
const yearValue = ref<number | undefined>();
const yearsAgo = ref<number | undefined>();

const animate = ref<boolean>(false);

const onInputChange = (
  value: number,
  min: number,
  max: number | undefined,
  valueRef: Ref<number | undefined>,
  errorRef: Ref<string | undefined>,
  invalidMessage: string,
  aboveMaxMessage?: string,
) => {
  if (!value && value !== 0) {
    errorRef.value = FieldRequired;
  } else if (isNaN(value) || value < min) {
    errorRef.value = invalidMessage;
  } else if (max && value > max) {
    errorRef.value = aboveMaxMessage ?? invalidMessage;
  } else {
    errorRef.value = undefined;
    valueRef.value = value;
  }
};

const onDayChange = (value: number) => {
  onInputChange(value, 1, 31, dayValue, dayError, InvalidDay);
};

const onMonthChange = (value: number) => {
  onInputChange(value, 1, 12, monthValue, monthError, InvalidMonth);
};

const onYearChange = (value: number) => {
  onInputChange(value, 1, new Date().getFullYear(), yearValue, yearError, InvalidYear, MustBeInPast);
};

const validateDateFields = (): boolean => {
  if (dayValue.value && monthValue.value && yearValue.value) {
    const { day, month, year } = checkValidDate(dayValue.value, monthValue.value, yearValue.value);

    dayError.value = day;
    monthError.value = month;
    yearError.value = year;

    return !day && !month && !year;
  }

  return false;
};

const resetAgo = () => {
  daysAgo.value = undefined;
  monthsAgo.value = undefined;
  yearsAgo.value = undefined;
};

const animateAgo = () => {
  if (!animate.value) {
    animate.value = true;

    const timer = setTimeout(() => {
      animate.value = false;
      clearTimeout(timer);
    }, 1000);
  }
};

const onSubmit = (ev: Event) => {
  ev.preventDefault();

  if (!validateDateFields()) {
    return;
  }

  animateAgo();

  const dateString = getDateString(dayValue.value, monthValue.value, yearValue.value);

  // This case should not happen given conditions for disabling the submit button
  if (!dateString) {
    resetAgo();
    return;
  }

  const now = new Date();
  const localDate = new Date();

  localDate.setFullYear(yearValue.value!);
  localDate.setMonth(monthValue.value! - 1);
  localDate.setDate(dayValue.value!);

  let diff = now.getTime() - localDate.getTime();

  const years = Math.floor(diff / YEAR_MS);
  const months = Math.floor((diff % YEAR_MS) / MONTH_MS);
  const days = Math.floor(((diff % YEAR_MS) % MONTH_MS) / DAY_MS);

  yearsAgo.value = years;
  monthsAgo.value = months;
  daysAgo.value = days;
};
</script>

<template>
  <main>
    <form class="age-calculator" @submit="onSubmit">
      <section class="age-calculator__inputs">
        <NumberInput label="DAY" placeholder="DD" :maxValue="31" @change="onDayChange" :error-message="dayError" />
        <NumberInput
          label="MONTH"
          placeholder="MM"
          :maxValue="12"
          @change="onMonthChange"
          :error-message="monthError"
        />
        <NumberInput label="YEAR" placeholder="YYYY" @change="onYearChange" :error-message="yearError" />
      </section>
      <section class="age-calculator__actions">
        <article class="horizontal-bar"></article>
        <button class="age-calculator__submit" type="submit" :disabled="!!dayError || !!monthError || !!yearError">
          <div class="icon-container" v-html="IconArrow"></div>
        </button>
      </section>
      <section class="age-calculator__output">
        <p>
          <span :class="{ 'ago-value': true, 'ago-value--animate': animate }">{{ yearsAgo ?? '--' }}</span> years
        </p>
        <p>
          <span :class="{ 'ago-value': true, 'ago-value--animate': animate }">{{ monthsAgo ?? '--' }}</span> months
        </p>
        <p>
          <span :class="{ 'ago-value': true, 'ago-value--animate': animate }">{{ daysAgo ?? '--' }}</span> days
        </p>
      </section>
    </form>
  </main>
</template>

<style scoped lang="scss">
@import '@/scss/mixins';

main {
  @include flexParentCentering();
}

.age-calculator {
  --br-large: 80pt;
  --pad: 1.5em;
  --width: clamp(350px, 50%, 400px);

  background-color: var(--clr-white);
  border-radius: 20pt 20pt var(--br-large) 20pt;
  padding: var(--pad);
  width: var(--width);

  display: flex;
  flex-direction: column;

  @include respond-from(large) {
    --br-large: 140pt;
    --pad: 4em;
    --width: 860px;
    --width: clamp(860px, 80%, 1000px);
  }

  &__inputs {
    --gap: 1em;
    --margin: 1em;
    --justify: space-around;

    justify-content: var(--justify);
    margin-block: var(--margin);
    gap: var(--gap);

    display: flex;
    flex-direction: row;

    @include respond-from(large) {
      --gap: 2em;
      --justify: start;
      --margin: 2em;
    }
  }

  &__actions {
    position: relative;
  }

  &__submit {
    --right: calc(50% - 3.4em);

    right: var(--right);

    position: absolute;
    top: 0;
    padding: 0;
    background-color: unset;
    border: unset;
    cursor: pointer;

    @include respond-from(large) {
      --right: 0;
    }
  }

  &__output {
    font-size: var(--fs-700);
    font-weight: var(--fw-bold);

    font-style: italic;
    line-height: 1.2;

    @include respond-from(large) {
      font-size: var(--fs-800);
    }
  }
}

.icon-container {
  --clr-fill: var(--clr-primary);
  --transform: scale(0.7);

  background-color: var(--clr-fill);
  transform: var(--transform);

  padding: 1.8em;

  @include circle-shape();

  @include respond-from(large) {
    --transform: unset;
  }

  &:hover {
    --clr-fill: var(--clr-off-black);
  }
}

.horizontal-bar {
  background-color: var(--clr-light-grey);

  margin-block: 3em;
  height: 2px;
}

.ago-value {
  --color: var(--clr-primary);
  --transform: unset;
  --transition: color linear 0.5s;

  color: var(--color);
  transition: var(--transition);
  transform: var(--transform);

  display: inline-block;

  &--animate {
    --color: var(--clr-warn);
    --transition: all linear 0.5s;
    --transform: rotate(360deg);
  }
}
</style>
