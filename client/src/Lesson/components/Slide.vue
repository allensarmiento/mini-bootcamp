<template>
  <div class="slide__content">
    <div v-for="(displayItem, index) in displayItems" :key="index">
      <Content
        :type="displayItem.type"
        :value="contentValue(displayItem)"
      />
    </div>
  </div>
</template>

<script>
import Content from './Content.vue';
import { getSlideValue } from '../utilities/slide';

export default {
  name: 'Slide',
  components: {
    Content,
  },
  props: {
    title: { type: String, default: '' },
    displayItems: { type: Array, default: () => ([]) },
    isAdmin: { type: Boolean, default: false },
    showSidebar: { type: Boolean, default: false },
  },
  methods: {
    contentValue(item) {
      let returnItem = false;

      if (item.type === 'image') {
        returnItem = true;
      } else if (item.type === 'unordered-list') {
        returnItem = true;
      } else if (item.type === 'ordered-list') {
        returnItem = true;
      }

      return returnItem ? item : item[this.slideValue(item.type)];
    },
    slideValue(type) {
      return getSlideValue(type);
    },
    controlBackward() {
      this.$emit('slideBackward');
    },
    controlSidebar() {
      this.$emit('toggleSidebar');
    },
    controlForward() {
      this.$emit('slideForward');
    },
  },
};
</script>

<style lang="scss" scoped>
.slide {
  display: grid;
  grid-template-rows: [title-start] min-content [title-end
                      main-start] 1fr [main-end
                      controls-start] min-content [controls-end];

  padding: 0;
  height: 90vh;
  background-color: var(--light-primary-color);
  color: var(--primary-text);

  &__title {
    grid-row: title-start / title-end;
    padding: 1rem 2rem;
    font-size: 3.6rem;
    text-align: left;
    color: currentColor;
  }

  &__content {
    grid-row: main-start / main-end;
    padding: 1rem 4rem;
    font-size: 2.6rem;
    text-align: left;
    color: currentColor;
    overflow: auto;
    scroll-behavior: smooth;
  }
}

::v-deep .controls {
  grid-row: controls-start / controls-end;
}
</style>
