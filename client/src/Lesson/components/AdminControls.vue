<template>
  <div class="controls">
    <BButton
      class="controls__item"
      variant="primary"
      @click="moveBackward"
    >
      &larr; Move Back
    </BButton>

    <BButton
      aria-controls="sidebar-right"
      :aria-expanded="expanded"
      class="controls__item"
      variant="primary"
      @click="toggle"
    >
      Toggle Sidebar
    </BButton>

    <BButton
      class="controls__item"
      variant="primary"
      @click="moveForward"
    >
      Move Forward &rarr;
    </BButton>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  name: 'AdminControls',
  components: { BButton },
  props: {
    expanded: { type: String, default: 'false' },
  },
  methods: {
    moveBackward() {
      this.$emit('slideBackward');
    },
    toggle() {
      this.$emit('toggleSidebar');
    },
    moveForward() {
      this.$emit('slideForward');
    },
  },
};
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: space-between;

  padding: 2rem 4rem;

  background: var(--primary-color);

  &__item {
    padding: .8rem 1.2rem;
    border: 1px solid var(--dark-primary-color);
    background-color: var(--dark-primary-color);
    font-size: 2rem;

    &:hover {
      background-color: var(--accent-color);
    }
  }
}
</style>
