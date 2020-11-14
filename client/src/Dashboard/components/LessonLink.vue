<template>
  <router-link :to="to">
    <BAlert class="lesson-link" show :variant="variant">
      {{ text }}
    </BAlert>
  </router-link>
</template>

<script>
import { BAlert } from 'bootstrap-vue';

export default {
  name: 'LessonLink',
  components: { BAlert },
  props: {
    to: { type: String, default: '/' },
    variant: { type: String, default: 'primary' },
    text: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.lesson-link {
  text-transform: uppercase;
}
</style>
