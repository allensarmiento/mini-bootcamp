<template>
  <div class="container">
    <img
      class="container__image"
      :style="imageStyle"
      :src="imageValue(value.image)"
    />
  </div>
</template>

<script>
export default {
  name: 'ImageContent',
  props: {
    value: { type: Object, default: () => ({}) },
  },
  computed: {
    imageStyle() {
      if (this.value.imageStyles && this.value.imageStyles.objectFit) {
        return this.value.imageStyles.objectFit;
      }
      return '';
    },
  },
  methods: {
    imageValue(image) {
      // Handle local images if necessary.

      const value = image;
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 40rem;
  width: 50rem;
  border-radius: .4rem;
  overflow: hidden;

  &__image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    background-position: center bottom;
  }
}
</style>
