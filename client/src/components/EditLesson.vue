<template>
  <div>
    <h1>Edit Lesson</h1>

    <div style="padding: 4rem;">
      <b-jumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>
          Slide {{ slide.number }}: {{ slide.title }}
        </template>

        <hr class="my-4">

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
                v-if="item.type === 'image'"
                style="width: 100%; height: 100%; object-fit: cover;"
                :style="item.imageStyles && 
                  item.imageStyles.objectFit 
                    ? item.imageStyles.objectFit 
                    : ''"
                :src="item.image"
              /> 
            </div>

            <b-table 
              v-if="item.type === 'table'" 
              striped 
              :items="item.table"
            ></b-table>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <b-button 
            variant="primary" 
            v-b-modal.modal-center 
            @click="editSlideClicked(slide)"
          >
            Edit
          </b-button>
          <b-button variant="warning">Delete</b-button>
        </div>
      </b-jumbotron>
    </div>

    <div>
      <b-modal v-model="show" id="modal-center" centered title="BootstrapVue">
        <b-input-group prepend="Number" class="mt-3">
          <b-form-input v-model="editSlide.number"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Title" class="mt-3">
          <b-form-input v-model="editSlide.title"></b-form-input>
        </b-input-group>
        <div v-for="(item, index) in editSlide.items" :key="index">
          <b-input-group 
            v-if="item.type === 'text' || item.type === 'question'" 
            :prepend="`Item ${index}`" 
            class="mt-3"
          >
            <b-form-input v-model="item.text"></b-form-input>
            <b-input-group-append>
              <b-button 
                variant="danger"
                @click="removeItemFromSlide(index)"
              >
                Remove
              </b-button>
            </b-input-group-append>
          </b-input-group> 

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
      </b-modal>
    </div>

    <h2>Add Slide</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLesson, updateSlide } from '../utilities/firebase'

export default {
  name: 'EditLesson',
  data: function() {
    return {
      lessonNumber: null,
      slides: [],

      show: false,
      editSlide: {},
      editSlideInputType: 'text',
      editSlideInputValue: ''
    }
  },
  computed: mapState(['userProfile']),
  mounted: async function() {
    this.lessonNumber = this.$route.params.lessonNumber
    this.slides = await getLesson(this.$route.params.lessonNumber)
  },
  methods: {
    editSlideClicked(slide) {
      this.editSlide = {
        number: slide.number,
        title: slide.title,
        items: [ ...slide.items ]
      };
    },
    addItemToSlide() {
      if (
        this.editSlide && 
        this.editSlide.items &&
        this.editSlideInputType &&
        this.editSlideInputValue
      ) {
        let newItem = {};
        newItem.type = this.editSlideInputType
        if (this.editSlideInputType === 'text') {
          newItem.text = this.editSlideInputValue
        } else if (this.editSlideInputType === 'image') {
          newItem.image = this.editSlideInputValue
        }
        this.editSlide.items.push(newItem)

        this.editSlideInputValue = ''
      }
    },
    removeItemFromSlide(index) {
      if (this.editSlide && this.editSlide.items) {
        this.editSlide.items.splice(index, 1)
      }
    },
    async saveSlide() {
      if (this.editSlide && this.editSlide.items) {
        await updateSlide(
          this.lessonNumber, 
          `${this.editSlide.number}`, 
          this.editSlide.title, 
          this.editSlide.items
        )
        this.show = false;
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
