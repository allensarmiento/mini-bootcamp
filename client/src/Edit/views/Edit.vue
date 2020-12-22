<template>
  <div class="container">
    <section class="edit">
      <h1 class="edit__title">Edit Lesson {{ lessonNumber }}</h1>
      <BButton>JSON Text Import</BButton>

      <div class="edit__slide">
        <BJumbotron v-for="(slide, index) in slides" :key="index">
          <template #header>{{ slide.title }}</template>

          <BFormCheckbox
            v-model="slide.showReview"
            :value="true"
            :unchecked-value="false"
          >
            Show in Review
          </BFormCheckbox>

          <hr class="my-4" />

          <div class="edit__slide__content">
            <SlideContent
              v-for="(slideItem, index) in slide.items"
              :key="index"
              :type="slideItem.type"
              :value="slideItem"
            />
          </div>
        </BJumbotron>
      </div>
    </section>

    <section class="text">
      <BFormTextarea
        v-model="textData"
        class="text__input"
        placeholder="Enter something..."
        wrap="off"
      />
      <BButton variant="success" class="save">Save Changes</BButton>
    </section>

  </div>
</template>

<script>
import {
  BButton,
  BJumbotron,
  BFormCheckbox,
  BFormTextarea,
} from 'bootstrap-vue';
import SlideContent from '../../SlideContent/views/Content.vue';
import { getLesson } from '../../data/firebase/edit';

export default {
  name: 'Edit',
  components: {
    BButton,
    BJumbotron,
    BFormCheckbox,
    BFormTextarea,
    SlideContent,
  },
  data() {
    return {
      slides: [],
      textData: '',
      errorMessage: '',
    };
  },
  watch: {
    slides(value) {
      this.textData = JSON.stringify(value, undefined, 2);
    },
    textData(value) {
      try {
        this.slides = JSON.parse(value);
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error;
      }
    },
  },
  computed: {
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
  },
  async mounted() {
    this.slides = await getLesson(this.lessonNumber);
    this.textData = JSON.stringify(this.slides, undefined, 2);
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: [slides-start] 1fr [slides-end
                          text-start] 20vw [text-end];
}

.edit {
  grid-column: slides-start / slides-end;

  &__slide {
    padding: 4rem;
    font-size: 2rem;

    &__content {
      text-align: left;
    }
  }
}

.text {
  grid-column: text-start / text-end;

  &__input {
    position: fixed;
    height: 90vh;
    width: 25%;
    padding: 1rem 1.2rem;
    font-size: 1.2rem;
    outline: none;
    resize: none;
  }
}

.save {
  margin-bottom: 1rem;
  position: fixed;
  bottom: 0;
  width: 25%;
}
</style>
