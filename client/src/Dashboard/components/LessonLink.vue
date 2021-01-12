<template>
  <router-link :to="to">
    <BAlert class="link" :variant="variant" show>
      <slot></slot>
    </BAlert>
  </router-link>
</template>

<script>
import { BAlert } from 'bootstrap-vue';

export default {
  name: 'LessonLink',
  components: { BAlert },
  props: {
    to: { type: String, default: '#' },
    variant: { type: String, default: 'primary' },
  },
};
</script>

<style lang="scss" scoped>
.link {
  text-transform: uppercase;
}
</style>
