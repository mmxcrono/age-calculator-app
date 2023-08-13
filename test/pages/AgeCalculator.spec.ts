import AgeCalculator from '@/pages/AgeCalculator.vue';
import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';

const SUITE = 'AgeCalculator';

describe.concurrent(SUITE, () => {
  it(`${SUITE} - Mount`, ({ expect }) => {
    const wrapper = mount(AgeCalculator);
    expect(wrapper.text()).toContain('years');
  });
});
