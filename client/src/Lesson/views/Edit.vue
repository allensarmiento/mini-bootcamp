<template>
  <div>
    <h1>Edit Lesson {{ lessonNumber }}</h1>

    <!-- Add Slide -->
    <BButton
      v-b-modal.modal-center
      @click="addSlideClicked"
    >
      Add Slide
    </BButton>

    <!-- Slide Content -->
    <div class="edit-slide">
      <BJumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>
          Slide {{ slide.number }}: {{ slide.title }}
        </template>

        <p>Show Review:&nbsp;
          <span style="font-weight: 800;">{{ slide.showReview }}</span>
        </p>

        <hr class="my-4" />

        <div class="edit-slide__content">
          <div v-for="(item, index) in slide.items" :key="index">
            <Content
              :type="item.type"
              :value="item.type !== 'image'
                ? item[slideValue(item.type)]
                : item"
            />
          </div>
        </div>

        <div class="edit-slide__buttons">
          <BButton
            v-b-modal.modal-center
            class="edit-slide__button"
            variant="primary"
            @click="editSlideClicked(slide)"
          >
            Edit
          </BButton>

          <BButton
            class="edit-slide__button"
            variant="warning"
            @click="deleteSlide(slide.number)"
          >
            Delete
          </BButton>
        </div>
      </BJumbotron>
    </div>

    <!-- Modal -->
    <div>
      <BModal v-model="show" id="modal-center" centered title="BootstrapVue">
        <BInputGroup prepend="Number" class="mt-3">
          <BFormInput v-model="editSlide.number" />
        </BInputGroup>

        <BInputGroup prepend="Title" class="mt-3">
          <BFormInput v-model="editSlide.title" />
        </BInputGroup>

        <div v-for="(item, index) in editSlide.items" :key="index">
          <BInputGroup
            v-if="item.type === 'text' || item.type === 'question'"
            :prepend="`Item ${index}`"
            class="mt-3"
          >
            <BFormInput v-model="item.text" />

            <BInputGroupAppend>
              <BButton
                variant="danger"
                @click="removeItemFromSlide(index)"
              >
                Remove
              </BButton>
            </BInputGroupAppend>
          </BInputGroup>

          <b-input-group
            v-if="item.type === 'image'"
            :prepend="`Item ${index}`"
            class="mt-3"
          >
            <b-form-input v-model="item.image"></b-form-input>
            <b-input-group-append>
              <b-button
                variant="danger"
                @click="removeItemFromSlide(index)"
              >
                Remove
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>

        <hr />

        <b-form-group>
          <b-input-group prepend="Type">
            <b-form-select
              v-model="editSlideInputType"
              :options="[
                { value: 'text', text: 'Text' },
                { value: 'question', text: 'Question' },
                { value: 'image', text: 'Image' },
              ]"
            ></b-form-select>
          </b-input-group>
          <b-input-group prepend="Value">
            <b-form-input v-model="editSlideInputValue"></b-form-input>
          </b-input-group>
          <b-button variant="success" @click="addItemToSlide">Add</b-button>
        </b-form-group>

        <b-form-checkbox
          id="checkbox-1"
          v-model="editSlide.showReview"
          name="checkbox-1"
          :value="true"
          :unchecked-value="false"
        >
          Show In Review
        </b-form-checkbox>

        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="dark"
              size="sm"
              @click="show=false"
            >
              Close
            </b-button>
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              @click="saveSlide"
            >
              Save
            </b-button>
          </div>
        </template>
      </BModal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  BJumbotron,
  BButton,
  BModal,
  BInputGroup,
  BInputGroupAppend,
  BFormInput,
} from 'bootstrap-vue';
import Content from '../components/Content.vue';
import { getLesson, updateSlide, deleteSlide } from '../data/lessonRTD';
import { getSlideValue } from '../utilities/slide';

export default {
  name: 'Edit',
  components: {
    BJumbotron,
    BButton,
    BModal,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    Content,
  },
  data() {
    return {
      slides: [],
      editSlide: {},
      editSlideInputType: 'text',
      editSlideInputValue: '',
      show: false,
    };
  },
  computed: {
    ...mapState(['userProfile']),
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
  },
  async mounted() {
    this.slides = await getLesson(this.lessonNumber);
  },
  methods: {
    slideValue(type) {
      return getSlideValue(type);
    },
    addSlideClicked() {
      this.editSlide = {
        number: this.slides.length,
        title: '',
        items: [],
      };
    },
    editSlideClicked(slide) {
      console.log(slide.showReview);
      this.editSlide = {
        number: slide.number,
        title: slide.title || '',
        items: slide.items ? [...slide.items] : [],
        showReview: slide.showReview,
      };
    },
    addItemToSlide() {
      if (
        this.editSlide
        && this.editSlide.items
        && this.editSlideInputType
        && this.editSlideInputValue
      ) {
        const newItem = { type: this.editSlideInputType };

        if (this.editSlideInputType === 'text') {
          newItem.text = this.editSlideInputValue;
        } else if (this.editSlideInputType === 'question') {
          newItem.text = this.editSlideInputValue;
        } else if (this.editSlideInputType === 'image') {
          newItem.image = this.editSlideInputValue;
        }

        this.editSlide.items.push(newItem);
        this.editSlideInputValue = '';
      }
    },
    removeItemFromSlide(index) {
      if (this.editSlide && this.editSlide.items) {
        this.editSlide.items.splice(index, 1);
      }
    },
    async saveSlide() {
      if (this.editSlide && this.editSlide.items) {
        await updateSlide({
          lessonNumber: this.lessonNumber,
          slideNumber: `${this.editSlide.number}`,
          title: this.editSlide.title,
          items: this.editSlide.items,
          showReview: this.editSlide.showReview,
        });

        this.slides = await getLesson(this.lessonNumber);

        this.show = false;
      }
    },
    async deleteSlide(slideNumber) {
      await deleteSlide(this.lessonNumber, slideNumber);
      this.slides = await getLesson(this.lessonNumber);
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-slide {
  padding: 4rem;
  font-size: 2rem;

  &__content {
    text-align: left;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    font-size: 1.6rem;
  }
}
</style>
