<script setup lang="ts">
import { ref, watch } from 'vue';

const inputValue = ref('');

defineProps<{
  label: string;
  placeholder: string;
  minValue?: number;
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
  <div class="number-input">
    <label :for="label" class="number-input__label">{{ label }}</label>
    <input
      v-model="inputValue"
      type="number"
      :name="label"
      :class="{ 'number-input__input': true, 'number-input__input--has-error': !!errorMessage }"
      :placeholder="placeholder"
      :min="minValue ?? 1"
      :max="maxValue"
      required
    />
    <p class="number-input__error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped lang="scss">
@import '@/scss/mixins';
.number-input {
  color: var(--clr-smokey-grey);

  display: flex;
  flex-direction: column;
  gap: 0.5em;
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
    font-size: var(--fs-400);
    font-weight: var(--fw-bold);
    background-color: var(--clr-white);

    border-style: solid;
    border-width: 1px;
    padding: 0.7em;
    border-radius: 8px;
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
