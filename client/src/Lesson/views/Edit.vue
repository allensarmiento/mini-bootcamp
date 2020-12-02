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

    <BModal v-model="showModal" id="modal-center" centered title="Edit Slide">
      <BInputGroup prepend="Number" class="mt-3">
        <BFormInput v-model="editSlide.number" />
      </BInputGroup>

      <BInputGroup prepend="Title" class="mt-3">
        <BFormInput v-model="editSlide.title" />
      </BInputGroup>

      <div
        class="edit__item"
        v-for="(item, index) in editSlide.items"
        :key="index"
      >
        <h4 class="mt-3">Item {{ index }}</h4>

        <div class="my-2">
          <h5>Type</h5>
          <BInputGroup>
            <BFormSelect v-model="item.type" :options="typeOptions" />
          </BInputGroup>
        </div>

        <div class="my-2">
          <TextInput
            v-if="item.type === 'text'"
            :input="item"
            :index="index"
            @onChange="editSlideValueChanged"
          />
          <QuestionInput
            v-if="item.type === 'question'"
            :input="item"
            :index="index"
            @onChange="editSlideValueChanged"
          />
          <LinkInput
            v-if="item.type === 'link'"
            :input="item"
            :index="index"
            @onChange="editSlideValueChanged"
          />
          <ImageInput
            v-if="item.type === 'image'"
            :input="item"
            :index="index"
            @onChange="editSlideValueChanged"
          />
          <TableInput
            v-if="item.type === 'table'"
            :input="item"
            :index="index"
            @onChange="editSlideValueChanged"
          />
        </div>

        <BButton variant="danger" @click="removeItemFromSlide(index)">
          Remove
        </BButton>
      </div>

      <hr />

      <h4>Add New Item</h4>

      <BFormGroup class="edit__item__new">
        <h5>Type</h5>
        <BInputGroup>
          <BFormSelect v-model="newSlide.type" :options="typeOptions" />
        </BInputGroup>

        <TextInput
          v-if="newSlide.type === 'text'"
          :input="newSlide"
          @onChange="newSlideValueChanged"
        />
        <QuestionInput
          v-else-if="newSlide.type === 'question'"
          :input="newSlide"
          @onChange="newSlideValueChanged"
        />
        <LinkInput
          v-else-if="newSlide.type === 'link'"
          :input="newSlide"
          @onChange="newSlideValueChanged"
        />
        <ImageInput
          v-else-if="newSlide.type === 'image'"
          :input="newSlide"
          @onChange="newSlideValueChanged"
        />
      </BFormGroup>
    </BModal>
  </section>
</template>

<script>
import {
  BButton,
  BModal,
  BInputGroup,
  BFormInput,
  BFormSelect,
} from 'bootstrap-vue';
import EditSlideContent from '../components/EditSlideContent.vue';
import TextInput from '../components/TextInput.vue';
import QuestionInput from '../components/QuestionInput.vue';
import LinkInput from '../components/LinkInput.vue';
import ImageInput from '../components/ImageInput.vue';
import TableInput from '../components/TableInput.vue';
import { getLesson, deleteSlide } from '../data/lessonRTD';

export default {
  name: 'Edit',
  components: {
    BButton,
    BModal,
    BInputGroup,
    BFormInput,
    BFormSelect,
    EditSlideContent,
    TextInput,
    QuestionInput,
    LinkInput,
    ImageInput,
    TableInput,
  },
  data() {
    return {
      slides: [],

      editSlide: {},
      showModal: false,

      newSlide: {
        type: 'text',
        value: '',
      },
      typeOptions: [
        { value: 'text', text: 'Text' },
        { value: 'question', text: 'Question' },
        { value: 'link', text: 'Link' },
        { value: 'image', text: 'Image' },
        { value: 'table', text: 'Table' },
      ],
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
    editSlideValueChanged(value, itemIdx) {
      this.editSlide.items[itemIdx] = value;
    },
    newSlideValueChanged(value) {
      this.newSlide = value;
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

  &__item {
    margin: 1rem 0;
    padding: .4rem .8rem;
    background: var(--light-primary-color);
    border-radius: .4rem;

    &__new {
      margin: 1rem 0;
      padding: .4rem .8rem;
      background: var(--light-primary-color);
      border-radius: .4rem;
    }
  }
}
</style>
