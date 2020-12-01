<template>
  <section class="edit">
    <h1 class="edit__title">Edit Lesson {{ lessonNumber }}</h1>

    <BButton
      v-b-modal.modal-center
      class="edit__add-slide"
      @click="addSlideClicked"
    >
      Add Slide
    </BButton>

    <EditSlideContent
      :slides="slides"
      @editSlide="editSlideClicked"
      @deleteSlide="deleteSlideClicked"
    />

    <BModal v-model="show" id="modal-center" centered title="Edit Slide">
      <BInputGroup preprend="Number" class="mt-3">
        <BFormInput v-model="editSlide.number" />
      </BInputGroup>

      <BInputGroup prepend="Title" class="mt-3">
        <BFormInput v-model="editSlide.title" />
      </BInputGroup>

      <div v-for="(item, index) in editSlide.items" :key="index">
        <h4 class="mt-3">Item {{ index }}</h4>

        <div class="my-2">
          <h5>Type</h5>
          <BInputGroup>
            <BFormInput v-model="item.type" />
          </BInputGroup>
        </div>

        <div class="my-2">
          <h5>Text</h5>
          <BInputGroup>
            <BFormTextarea v-model="item.text" />
          </BInputGroup>
        </div>

        <BButton variant="danger" @click="removeItemFromSlide(index)">
          Remove
        </BButton>
      </div>
    </BModal>
  </section>
</template>

<script>
import {
  BButton,
  BModal,
  BInputGroup,
  BFormInput,
  BFormTextarea,
} from 'bootstrap-vue';
import EditSlideContent from '../components/EditSlideContent.vue';
import { getLesson, deleteSlide } from '../data/lessonRTD';

export default {
  name: 'Edit',
  components: {
    BButton,
    BModal,
    BInputGroup,
    BFormInput,
    BFormTextarea,
    EditSlideContent,
  },
  data() {
    return {
      slides: [],

      editSlide: {},
      show: false,
    };
  },
  computed: {
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
  },
  async mounted() {
    this.slides = await getLesson(this.lessonNumber);
  },
  methods: {
    addSlideClicked() {
      this.editSlide = {
        number: this.slides.length,
        title: '',
        items: [],
      };
    },
    editSlideClicked(slide) {
      this.editSlide = {
        number: slide.number,
        title: slide.title || '',
        items: slide.items ? [...slide.items] : [],
        showReview: slide.showReview,
      };
    },
    async deleteSlideClicked(slideNumber) {
      await deleteSlide(this.lessonNumber, slideNumber);
      // TODO: If this is not the last slide, should reorder slides.
      this.slides = await getLesson(this.lessonNumber, slideNumber);
    },
    removeItemFromSlide(index) {
      console.log(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.edit {
  margin-top: 2rem;

  &__title {
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  &__add-slide {
    font-size: 2rem;
  }
}
</style>
