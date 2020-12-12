<template>
  <BButton
    :class="['controls-button', buttonColor]"
    :variant="variant"
    @click="onClicked"
  >
    <slot></slot>
  </BButton>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  name: 'ControlsButton',
  components: { BButton },
  props: {
    variant: { type: String, default: '' },
    useThemedColor: { type: Boolean, default: false },
  },
  computed: {
    buttonColor() {
      return !this.variant ? 'controls-button--dark' : '';
    },
  },
  methods: {
    onClicked() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.controls-button {
  margin: 0 .4rem;
  padding: .8rem 1.2rem;
  font-size: 2rem;

  &--dark {
    background-color: var(--dark-primary-color);
    border: .1rem solid var(--dark-primary-color);

    &:hover {
      background-color: var(--accent-color);
    }
  }
}
</style>
