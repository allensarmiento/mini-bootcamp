<template>
  <div class="slide">
    <div v-for="(slideItem, index) in slideItems" :key="index">
      <SlideContent
        :type="slide.type"
        :value="slideItem"
      />
    </div>
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
.slide {
  padding: 1rem 4rem;
  color: currentColor;
  font-size: 2.6rem;
  text-align: left;
  overflow: auto;
  scroll-behavior: scroll;
}
</style>
