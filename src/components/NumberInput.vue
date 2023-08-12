<script setup lang="ts">
import { ref, watch } from 'vue';

const inputValue = ref('');

const props = defineProps<{
  label: string;
  placeholder: string;
  maxValue?: number;
  errorMessage?: string | undefined;
}>();

const emits = defineEmits<{
  (event: 'change', value: number): void;
}>();

watch(inputValue, (newValue) => {
  emits('change', parseInt(newValue));
});
</script>

<template>
  <div class="day-input">
    <label for="day" class="day-input__label">{{ label }}</label>
    <input
      v-model="inputValue"
      type="number"
      name="day"
      :class="{ 'day-input__input': true, 'day-input__input--has-error': !!props.errorMessage }"
      :placeholder="props.placeholder"
      min="1"
      :max="maxValue"
      required
    />
    <p class="day-input__error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped lang="scss">
@import '@/scss/mixins';
.day-input {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  color: var(--clr-smokey-grey);
  width: 5em;

  @include respond-from(large) {
    width: 10em;
  }

  &__label {
    font-size: var(--fs-200);
    letter-spacing: 0.2ch;

    @include respond-from(large) {
      font-size: var(--fs-300);
    }
  }

  &__input {
    --clr-border: var(--clr-light-grey);
    border-color: var(--clr-border);
    border-style: solid;
    border-width: 1px;
    font-size: var(--fs-400);
    padding: 0.7em;
    border-radius: 8px;
    font-weight: var(--fw-bold);
    outline: none;

    @include respond-from(large) {
      font-size: var(--fs-600);
    }

    &:focus {
      --clr-border: var(--clr-primary);
    }

    &--has-error {
      --clr-border: var(--clr-warn);
    }

    &[type='number'] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__error {
    font-size: var(--fs-300);
    color: var(--clr-warn);
    font-style: italic;
  }
}
</style>
