<template>
  <div class="review">
    <h1 class="review__title">Review lesson {{ lessonNumber }}</h1>

    <div class="review__slide">
      <BJumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>{{ slide.title }}</template>

        <hr class="my-4" />

        <div class="review__slide__content">
          <SlideContent
            v-for="(slideItem, index) in slide.items"
            :key="index"
            :type="slideItem.type"
            :value="slideItem"
          />
        </div>
      </BJumbotron>
    </div>
  </div>
</template>

<script>
import { BJumbotron } from 'bootstrap-vue';
import SlideContent from '../../SlideContent/views/Content.vue';
import { getReviewLesson } from '../../data/firebase/review';

export default {
  name: 'Review',
  components: { BJumbotron, SlideContent },
  data() {
    return {
      slides: [],
    };
  },
  computed: {
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
  },
  async mounted() {
    this.slides = await getReviewLesson(this.lessonNumber);
  },
};
</script>

<style lang="scss" scoped>
.review {
  &__slide {
    padding: 4rem;
    font-size: 2rem;

    &__content {
      text-align: left;
    }
  }
}
</style>
