<template>
  <div>
    <h1>Review Lesson {{ lessonNumber }}</h1>

    <!-- Slide Content -->
    <div class="review-slide">
      <BJumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>
          {{ slide.title }}
        </template>

        <hr class="my-4" />

        <div class="review-slide__content">
          <div v-for="(item, index) in slide.items" :key="index">
            <Content
              :type="item.type"
              :value="item.type !== 'image'
                ? item[slideValue(item.type)]
                : item"
            />
          </div>
        </div>
      </BJumbotron>
    </div>
  </div>
</template>

<script>
import {
  BJumbotron,
} from 'bootstrap-vue';
import Content from '../components/Content.vue';
import { getReviewLesson } from '../data/lessonRTD';
import { getSlideValue } from '../utilities/slide';

export default {
  name: 'Review',
  components: {
    BJumbotron,
    Content,
  },
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
  methods: {
    slideValue(type) {
      return getSlideValue(type);
    },
  },
};
</script>

<style lang="scss" scoped>
.review-slide {
  padding: 4rem;
  font-size: 2rem;

  &__content {
    text-align: left;
  }
}
</style>
