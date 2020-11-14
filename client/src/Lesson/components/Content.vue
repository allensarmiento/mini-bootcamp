<template>
  <p v-if="isText">{{ value }}</p>

  <p v-else-if="isQuestion">{{ value }}</p>

  <div
    v-else-if="isImage"
    class="image-container"
  >
    <img
      class="image-container__image"
      :style="imageStyle"
      :src="value"
    />
  </div>

  <BTable v-else-if="isTable" striped :items="value" />
</template>

<script>
import { BTable } from 'bootstrap-vue';

export default {
  name: 'Content',
  components: { BTable },
  props: {
    type: { type: String, default: 'text' },
    value: { type: [String, Array, Object], default: '' },
  },
  computed: {
    isText() {
      return this.type === 'text';
    },
    isQuestion() {
      return this.type === 'question';
    },
    isImage() {
      return this.type === 'image';
    },
    imageStyle() {
      return this.value.imageStyles && this.value.imageStyles.objectFit
        ? this.value.imageStyles.objectFit
        : '';
    },
    isTable() {
      return this.type === 'table';
    },
  },
};
</script>

<style lang="scss" scoped>
.image-container {
  width: 50rem;
  height: 30rem;
  border-radius: .4rem;
  overflow: hidden;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-position: center bottom;
  }
}
</style>
