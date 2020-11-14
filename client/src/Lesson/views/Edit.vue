<template>
  <div>
    <h1>Edit Lesson {{ lessonNumber }}</h1>

    <div style="padding: 4rem;">
      <BJumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>
          Slide {{ slide.number }}: {{ slide.title }}
        </template>

        <hr class="my-4" />

        <div style="text-align: left;">
          <div v-for="(item, index) in slide.items" :key="index">
            <p v-if="item.type === 'text' || item.type === 'question'">
              {{ item.text }}
            </p>

            <div
              v-if="item.type === 'image'"
              style="width: 50rem; height: 50rem;"
            >
              <img
                style="width: 100%; height: 100%; object-fit: cover;"
                :style="item.imageStyles &&
                  item.imageStyles.objectFit
                    ? item.imageStyles.objectFit
                    : ''"
                :src="item.image"
              />
            </div>

            <BTable
              v-if="item.type === 'table'"
              :items="item.table"
              striped
            />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <BButton
            v-b-modal.modal-center
            variant="primary"
            @click="editSlideClicked(slide)"
          >
            Edit
          </BButton>

          <BButton variant="warning">Delete</BButton>
        </div>
      </BJumbotron>
    </div>

    <div>
      <BModal v-model="show" id="modal-center" centered title="BootstrapVue">
        <BInputGroup prepend="Number" class="mt-3">
          <BFormInput v-model="editSlide.number" />
        </BInputGroup>

        <BInputGroup preprend="Title" class="mt-3">
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
                { value: 'image', text: 'Image' },
              ]"
            ></b-form-select>
          </b-input-group>
          <b-input-group prepend="Value">
            <b-form-input v-model="editSlideInputValue"></b-form-input>
          </b-input-group>
          <b-button variant="success" @click="addItemToSlide">Add</b-button>
        </b-form-group>

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

    <h2>Add Slide</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  BJumbotron,
  BTable,
  BButton,
  BModal,
  BInputGroup,
  BInputGroupAppend,
  BFormInput,
} from 'bootstrap-vue';
import { getLesson, updateSlide } from '../data/lesson';

export default {
  name: 'Edit',
  components: {
    BJumbotron,
    BTable,
    BButton,
    BModal,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
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
    editSlideClicked(slide) {
      this.editSlide = {
        number: slide.number,
        title: slide.title,
        items: [...slide.items],
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
        });

        this.show = false;
      }
    },
  },
};
</script>
