import { ErrorMessages } from '@/enums/ErrorMessages';
import AgeCalculator from '@/pages/AgeCalculator.vue';
import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';

const SUITE = 'AgeCalculator';

describe.concurrent(SUITE, () => {
  it(`${SUITE} - Mount`, async ({ expect }) => {
    const wrapper = mount(AgeCalculator);

    expect(wrapper.text()).toContain('DAYMONTHYEAR');
  });

  it(`${SUITE} - Day Input`, async ({ expect }) => {
    const wrapper = mount(AgeCalculator);
    const button = wrapper.find('button');

    const textInput = wrapper.find('input[name="DAY"]');

    await textInput.setValue('32');
    await button.trigger('click');

    expect(wrapper.text()).toContain(ErrorMessages.InvalidDay);

    await textInput.setValue('');
    await button.trigger('click');

    expect(wrapper.text()).toContain(ErrorMessages.FieldRequired);
  });

  it(`${SUITE} - Month Input`, async ({ expect }) => {
    const wrapper = mount(AgeCalculator);
    const button = wrapper.find('button');

    const textInput = wrapper.find('input[name="MONTH"]');

    await textInput.setValue('13');

    expect(wrapper.text()).toContain(ErrorMessages.InvalidMonth);

    await textInput.setValue('');
    await button.trigger('click');

    expect(wrapper.text()).toContain(ErrorMessages.FieldRequired);

    await textInput.setValue('12');
    await button.trigger('click');

    expect(wrapper.text()).not.toContain(ErrorMessages.FieldRequired);
    expect(wrapper.text()).not.toContain(ErrorMessages.InvalidMonth);
  });

  it(`${SUITE} - Year Input`, async ({ expect }) => {
    const wrapper = mount(AgeCalculator);
    const button = wrapper.find('button');

    const textInput = wrapper.find('input[name="YEAR"]');

    await textInput.setValue('0');
    await button.trigger('click');

    expect(wrapper.text()).toContain(ErrorMessages.InvalidYear);

    await textInput.setValue('');
    await button.trigger('click');

    expect(wrapper.text()).toContain(ErrorMessages.FieldRequired);

    await textInput.setValue('2999');
    await button.trigger('click');
    expect(wrapper.text()).toContain(ErrorMessages.MustBeInPast);

    await textInput.setValue('2023');
    await button.trigger('click');

    expect(wrapper.text()).not.toContain(ErrorMessages.FieldRequired);
    expect(wrapper.text()).not.toContain(ErrorMessages.InvalidYear);
    expect(wrapper.text()).not.toContain(ErrorMessages.MustBeInPast);
  });
});
