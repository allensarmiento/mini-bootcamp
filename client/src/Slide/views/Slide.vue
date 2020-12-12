<template>
  <div class="slide-content">
    <SlideContent
      v-for="(slideItem, index) in slideItems"
      :key="index"
      :type="slideItem.type"
      :value="slideItem"
    />
  </div>
</template>

<script>
import SlideContent from '../../SlideContent/views/Content.vue';

export default {
  name: 'Slide',
  components: { SlideContent },
  props: {
    slideItems: { type: Array, default: () => ([]) },
  },
};
</script>

<style lang="scss" scoped>
.slide-content {
  padding: 1rem 4rem;
  color: currentColor;
  font-size: 2.6rem;
  text-align: left;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
