<template>
  <BJumbotron class="slide" container-fluid>
    <h2 class="slide__title">{{ title }}</h2>

    <div class="slide__content">
      <div v-for="(displayItem, index) in displayItems" :key="index">
        <Content
          :type="displayItem.type"
          :value="displayItem.type !== 'image'
                ? displayItem[slideValue(displayItem.type)]
                : displayItem"
        />
      </div>
    </div>

    <AdminControls
      v-if="isAdmin"
      :expanded="`${showSidebar}`"
      @slideBackward="controlBackward"
      @toggleSidebar="controlSidebar"
      @slideForward="controlForward"
    />
    <div v-else><!-- Empty container used for grid --></div>
  </BJumbotron>
</template>

<script>
import { BJumbotron } from 'bootstrap-vue';
import Content from './Content.vue';
import AdminControls from './AdminControls.vue';
import { getSlideValue } from '../utilities/slide';

export default {
  name: 'Slide',
  components: {
    BJumbotron,
    Content,
    AdminControls,
  },
  props: {
    title: { type: String, default: '' },
    displayItems: { type: Array, default: () => ([]) },
    isAdmin: { type: Boolean, default: false },
    showSidebar: { type: Boolean, default: false },
  },
  methods: {
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
