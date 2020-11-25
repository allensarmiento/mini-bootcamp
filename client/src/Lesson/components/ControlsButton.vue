<template>
  <BButton
    class="controls-button"
    variant="primary"
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

  border: 1px solid var(--dark-primary-color);
  background-color: var(--dark-primary-color);
  font-size: 2rem;

  &:hover {
    background-color: var(--accent-color);
  }
}
</style>
