<template>
  <p v-if="isText">{{ value }}</p>

  <p v-else-if="isQuestion">{{ value }}</p>

  <a v-else-if="isLink" :href="value" target="_blank">{{ value }}</a>

  <div
    v-else-if="isImage"
    class="image-container"
  >
    <img
      class="image-container__image"
      :style="imageStyle"
      :src="imageValue(value.image)"
    />
  </div>

  <BTable v-else-if="isTable" striped :items="value" />

  <ul v-else-if="isUnorderedList" style="padding: .8rem 2.4rem;">
    <li v-for="(item, index) in value.unorderedList" :key="index">
      {{ item }}
    </li>
  </ul>

  <ol v-else-if="isOrderedList" style="padding: .8rem 2.4rem;">
    <li v-for="(item, index) in value.orderedList" :key="index">
      {{ item }}
    </li>
  </ol>
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
    isLink() {
      return this.type === 'link';
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
    isUnorderedList() {
      return this.type === 'unordered-list';
    },
    isOrderedList() {
      return this.type === 'ordered-list';
    },
  },
  methods: {
    imageValue(image) {
      let value;

      if (image === 'basic-navbar.png') {
        value = require('../assets/basic-navbar.png'); // eslint-disable-line global-require
      } else if (image === 'album-site.png') {
        value = require('../assets/album-site.png'); // eslint-disable-line global-require
      } else {
        value = image;
      }

      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.image-container {
  width: 50rem;
  // height: 30rem;
  height:  40rem;
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
