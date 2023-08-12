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

const INVALID_DATE = 'Must be a valid date';
const FIELD_REQUIRED = 'This field is required';
const MUST_BE_IN_PAST = 'Must be in the past';

const DAY_MS = 24 * 60 * 60 * 1000;
const YEAR_MS = DAY_MS * 365.2425;
const MONTH_MS = YEAR_MS / 12;

const onDayChange = (value: number) => {
  if (!value) {
    dayError.value = FIELD_REQUIRED;
  } else if (isNaN(value) || value > 31 || value < 1) {
    dayError.value = 'Must be a valid day';
  } else {
    dayError.value = undefined;
    dayValue.value = value;
  }
  checkValidDate();
};

const onMonthChange = (value: number) => {
  if (!value) {
    monthError.value = FIELD_REQUIRED;
  } else if (isNaN(value) || value > 12 || value < 1) {
    monthError.value = 'Must be a valid month';
  } else {
    monthError.value = undefined;
    monthValue.value = value;
  }
  checkValidDate();
};

const onYearChange = (value: number) => {
  if (isNaN(value)) {
    yearError.value = 'Must be a valid year';
  } else if (value > new Date().getFullYear()) {
    yearError.value = MUST_BE_IN_PAST;
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
      yearError.value = INVALID_DATE;
    } else if (localDate.getTime() > Date.now()) {
      if (yearValue.value > currentYear) {
        yearError.value = MUST_BE_IN_PAST;
      } else if (monthValue.value > currentMonth) {
        monthError.value = MUST_BE_IN_PAST;
      } else {
        dayError.value = MUST_BE_IN_PAST;
      }
    } else if (dayError.value === INVALID_DATE) {
      dayError.value = undefined;
    }
  }
};

const getDateString = () => {
  if (dayValue.value && monthValue.value && yearValue.value) {
    const month = monthValue.value.toString().padStart(2, '0');
    const year = yearValue.value.toString().padStart(4, '0');
    const day = dayValue.value.toString().padStart(2, '0');
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.age-calculator {
  display: flex;
  flex-direction: column;
  background-color: var(--clr-white);
  border-radius: 20pt 20pt 80pt 20pt;
  padding: 1.5em;

  @include respond-from(large) {
    width: 860px;
    padding: 4em;
    border-radius: 20pt 20pt 140pt 20pt;
  }

  &__inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-block: 1em;
    gap: 1em;

    @include respond-from(large) {
      gap: 2em;
      justify-content: start;
      margin-block: 2em;
    }
  }

  &__actions {
    position: relative;
  }

  &__submit {
    padding: 0;
    background-color: unset;
    border: unset;
    position: absolute;
    top: 0;
    left: calc(50% - 42px);
    cursor: pointer;

    @include respond-from(large) {
      right: 0;
      left: unset;
    }
  }

  &__output {
    font-size: var(--fs-700);
    font-style: italic;
    font-weight: var(--fw-bold);
    line-height: 1.2;

    @include respond-from(large) {
      font-size: var(--fs-800);
    }
  }
}

.icon-container {
  --clr-fill: var(--clr-primary);
  background-color: var(--clr-fill);
  border-radius: 50%;
  transform: scale(0.7);
  padding: 1.8em;

  @include respond-from(large) {
    transform: unset;
  }

  &:hover {
    --clr-fill: var(--clr-off-black);
  }
}

.horizontal-bar {
  margin-block: 3em;
  height: 2px;
  background-color: var(--clr-light-grey);

  @include respond-from(large) {
    transform: unset;
  }
}

.ago-value {
  display: inline-block;
  color: var(--clr-primary);
  transition: color linear 0.5s;

  &--animate {
    transform: rotate(360deg);
    color: var(--clr-warn);
    transition: all linear 0.5s;
  }
}
</style>
