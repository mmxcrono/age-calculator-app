<script setup lang="ts">
import IconArrow from '@/assets/icon-arrow.svg?raw';
import NumberInput from '@/components/NumberInput.vue';
import { ref } from 'vue';
import { isValidDate } from '@/util/isValidDate';

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

enum ErrorMessages {
  InvalidDate = 'Must be a valid date',
  InvalidDay = 'Must be a valid day',
  InvalidMonth = 'Must be a valid month',
  InvalidYear = 'Must be a valid year',
  FieldRequired = 'This field is required',
  MustBeInPast = 'Must be in the past',
}

const PAD = '0';
const DAY_MS = 86400000;
const YEAR_MS = DAY_MS * 365.2425;
const MONTH_MS = YEAR_MS / 12;

const onDayChange = (value: number) => {
  if (!value) {
    dayError.value = ErrorMessages.FieldRequired;
  } else if (isNaN(value) || value > 31 || value < 1) {
    dayError.value = ErrorMessages.InvalidDay;
  } else {
    dayError.value = undefined;
    dayValue.value = value;
  }
  checkValidDate();
};

const onMonthChange = (value: number) => {
  if (!value) {
    monthError.value = ErrorMessages.FieldRequired;
  } else if (isNaN(value) || value > 12 || value < 1) {
    monthError.value = ErrorMessages.InvalidMonth;
  } else {
    monthError.value = undefined;
    monthValue.value = value;
  }
  checkValidDate();
};

const onYearChange = (value: number) => {
  if (isNaN(value)) {
    yearError.value = ErrorMessages.InvalidYear;
  } else if (value > new Date().getFullYear()) {
    yearError.value = ErrorMessages.MustBeInPast;
  } else {
    yearError.value = undefined;
    yearValue.value = value;
  }
  checkValidDate();
};

const checkValidDate = () => {
  if (dayValue.value && monthValue.value && yearValue.value) {
    const dateString = getDateString();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const localDate = new Date();

    localDate.setFullYear(yearValue.value);
    localDate.setMonth(monthValue.value - 1);
    localDate.setDate(dayValue.value);

    if (!isValidDate(dateString)) {
      yearError.value = ErrorMessages.InvalidDate;
    } else if (localDate.getTime() > Date.now()) {
      if (yearValue.value > currentYear) {
        yearError.value = ErrorMessages.MustBeInPast;
      } else if (monthValue.value > currentMonth) {
        monthError.value = ErrorMessages.MustBeInPast;
      } else {
        dayError.value = ErrorMessages.MustBeInPast;
      }
    } else if (dayError.value === ErrorMessages.InvalidDate) {
      dayError.value = undefined;
    }
  }
};

const getDateString = () => {
  if (dayValue.value && monthValue.value && yearValue.value) {
    const month = monthValue.value.toString().padStart(2, PAD);
    const year = yearValue.value.toString().padStart(4, PAD);
    const day = dayValue.value.toString().padStart(2, PAD);
    const dateString = `${year}-${month}-${day}`;

    return dateString;
  }

  return '';
};

const onSubmit = (ev: Event) => {
  ev.preventDefault();

  if (!animate.value) {
    animate.value = true;

    const timer = setTimeout(() => {
      animate.value = false;
      clearTimeout(timer);
    }, 1000);
  }

  const dateString = getDateString();

  let diff = Date.now() - Date.parse(dateString);

  if (diff / YEAR_MS > 0) {
    const years = Math.floor(diff / YEAR_MS);
    yearsAgo.value = years;

    diff -= years * YEAR_MS;
  }

  if (diff / MONTH_MS > 0) {
    const months = Math.floor(diff / MONTH_MS);
    monthsAgo.value = months;

    diff -= months * MONTH_MS;
  }

  if (diff / DAY_MS > 0) {
    const days = Math.floor(diff / DAY_MS);
    daysAgo.value = days;
  }
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
