<template>
  <section>
    <navbar />

    <div class="lesson">
      <h1 class="lesson__title">Lesson {{ lessonNumber }}</h1>

      <b-jumbotron v-if="slides.length" class="lesson-slide" container-fluid>
        <h2 class="lesson-slide__title">
          {{ slides[slideIndex].title }}
        </h2>

        <div class="lesson-slide__content">
          <div v-for="(displayItem, key) in displayItems" :key="key">
            <!-- Text or Question -->
            <p 
              v-if="displayItem.type === 'text' || 
                displayItem.type === 'question'"
            >
              {{ displayItem.text }}
            </p>

            <!-- Image -->
            <div 
              v-if="displayItem.type === 'image'"
              class="lesson-slide__content__image-container"
            >
              <img 
                v-if="displayItem.type === 'image'"
                class="lesson-slide__content__image"
                :style="displayItem.imageStyles && 
                  displayItem.imageStyles.objectFit 
                    ? displayItem.imageStyles.objectFit 
                    : ''"
                :src="displayItem.image"
              /> 
            </div>

            <!-- Table -->
            <b-table 
              v-if="displayItem.type === 'table'" 
              striped 
              :items="displayItem.table"
            ></b-table>
          </div>
        </div>

        <!-- Admin controls -->
        <div v-if="userProfile.role === 'admin'" class="lesson-slide__controls">
          <b-button 
            class="lesson-slide__controls__item" 
            variant="primary" 
            @click="moveBackward"
          >
            &larr; Move Back
          </b-button>

          <b-button 
            class="lesson-slide__controls__item"
            @click="toggleSidebar"
          >
            Toggle Sidebar
          </b-button>

          <b-button 
            class="lesson-slide__controls__item" 
            variant="primary" 
            @click="moveForward"
          >
            Move Forward &rarr;
          </b-button>
        </div>

        <div v-else class="less-slide__controls"></div>
      </b-jumbotron>

      <b-sidebar 
        v-if="slides.length"
        id="sidebar-right"
        class="lesson-sidebar" 
        :title="`${userProfile.name}'s Answers`"
        right
        shadow
      >
        <div class="lesson-sidebar__container px-3 py-4">
          <div class="lesson-sidebar__content">
            <div v-for="(sidebarItem, key) in sidebarItems" :key="key">
              <p 
                :class="sidebarItem.type === 'question' 
                  ? 'lesson-sidebar__content__question' 
                  : 'lesson-sidebar__content__answer'"
              >
                {{ sidebarItem.text }}
              </p>
            </div>
          </div>

          <div class="lesson-sidebar__input__container">
            <b-form-textarea
              id="textarea"
              class="lesson-sidebar__input"
              v-model="answerInput"
              placeholder="Enter something..."
              rows="5"
              max-rows="6"
            ></b-form-textarea>
            <b-button 
              class="lesson-sidebar__submit"
              @click="submitAnswer"
            >
              Submit
            </b-button>
          </div>
        </div>
      </b-sidebar>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
// import { addLesson } from '../utilities/firebase'
import { getLesson, submitAnswer } from '../utilities/firebase'
// import lesson from '../mock/lesson_2_slides.json'
import io from 'socket.io-client'
import Navbar from './Navbar.vue'

const ENDPOINT = process.env.NODE_ENV === 'production'
  ? 'https://mini-bootcamp.herokuapp.com/' : 'http://localhost:5000/'

export default {
  name: 'Lesson',
  components: { Navbar },
  data: function() {
    return {
      lessonNumber: null,

      slideIndex: 0,
      itemIndex: 0,

      slides: [],

      displayItems: [],

      sidebarItems: [],

      currentQuestion: '',
      answerInput: '',

      socket: null,

      showSidebar: false
    }
  },
  computed: mapState(['userProfile']),
  mounted: async function() {
    // await addLesson('2', lesson)
    this.lessonNumber = this.$route.params.lessonNumber
    this.slides = await getLesson(this.$route.params.lessonNumber)

    this.socket = io(ENDPOINT)
    this.socket.on('connect', () => void console.log('connected'))
    this.socket.on('toggleSidebar', (value) => void this.setShowSidebar(value))
    this.socket.on('lessonState', (indexes) => {
      this.setSlideIndex(indexes.slideIndex)
      this.setItemIndex(indexes.itemIndex)
      this.setDisplayItems(indexes.displayItems)
      
      // Refs aren't reactive, so it has to be done manually.
      const lessonContainer = document.querySelector('.lesson-slide__content')
      if (lessonContainer) {
        lessonContainer.scrollTop = lessonContainer.scrollHeight
      }
    })
    this.socket.on('sidebarState', options => {
      this.setCurrentQuestion(options.currentQuestion)
    })
  },
  watch: {
    showSidebar: function(value) {
      if (value) {
        document.getElementById('sidebar-right').style.display = 'block'
        document
          .getElementById('sidebar-right')
          .setAttribute('aria-hidden', 'false')
      } else {
        document.getElementById('sidebar-right').style.display = 'none'
        document
          .getElementById('sidebar-right')
          .setAttribute('aria-hidden', 'true')
      }
    }
  },
  methods: {
    toggleSidebar: function() {
      this.showSidebar = !this.showSidebar
      this.socket.emit('toggle', this.showSidebar)
    },

    setShowSidebar: function(value) {
      this.showSidebar = value
    },
    setSlideIndex: function(value) {
      this.slideIndex = value
    },
    setItemIndex: function(value) {
      this.itemIndex = value
    },
    setDisplayItems: function(value) {
      this.displayItems = value
    },
    setCurrentQuestion: function(value) {
      // NOTE: Can't seem to update the sidebar items
      this.sidebarItems.push({ type: 'question',  text: value })
      this.currentQuestion = value
    },

    moveBackward: function() {
      if (this.itemIndex === 0) {
        if (this.slideIndex === 0) {
          console.log('This is the very beginning')
        } else {
          this.slideIndex -= 1
          this.displayItems = this.slides[this.slideIndex].items
          this.itemIndex = this.slides[this.slideIndex].items.length 
        }
      } else {
        this.itemIndex -= 1
        this.displayItems.pop()
      }

      console.log(`Item: ${this.itemIndex}, Slide: ${this.slideIndex}`)
      this.socket.emit('lesson', { 
        slideIndex: this.slideIndex,
        itemIndex: this.itemIndex,
        displayItems: this.displayItems
      })
    },
    moveForward: function() {
      if (this.itemIndex === this.slides[this.slideIndex].items.length) {
        if (this.slideIndex === this.slides.length - 1) {
          console.log('This is the end');
        } else {
          this.slideIndex += 1
          this.displayItems = []
          this.itemIndex = 0
        }
      } else {
        this.displayItems
          .push(this.slides[this.slideIndex].items[this.itemIndex])

        console.log(this.slides[this.slideIndex].items[this.itemIndex].type)
        if (
          this.slides[this.slideIndex].items[this.itemIndex].type === 'question'
        ) {
          this.currentQuestion = 
            this.slides[this.slideIndex].items[this.itemIndex].text
          
          this.socket.emit('sidebar', {
            currentQuestion: this.currentQuestion,
          })
        }
        this.itemIndex += 1
      }

      console.log(`Item: ${this.itemIndex}, Slide: ${this.slideIndex}`)
      this.socket.emit('lesson', { 
        slideIndex: this.slideIndex,
        itemIndex: this.itemIndex,
        displayItems: this.displayItems,
      })
    },

    submitAnswer: async function() {
      if (this.answerInput) {
        this.sidebarItems.push({ text: this.answerInput })
        await submitAnswer('1', this.userProfile.name, this.currentQuestion, this.answerInput)
        this.answerInput = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .lesson {
    display: grid;
    grid-template-rows: [title-start] 10vh [title-end
                        main-start] 85vh [main-end];

    &__title {
      grid-row: title-start / title-end;

      display: flex;
      align-items: center;
      justify-content: center;

      height: 10vh;
      background-color: var(--primary-color);
      color: var(--text);
      font-size: 5rem;
    }
  }

  .lesson-slide {
    grid-row: main-start / main-end;

    display: grid;
    grid-template-rows: [title-start] min-content [title-end
                        main-start] 1fr [main-end
                        controls-start] min-content [controls-end];

    padding: 0;
    height: 85vh;
    background-color: var(--light-primary-color);
    color: var(--primary-text);

    &__title {
      grid-row: title-start / title-end;
      padding: 1rem 2rem;
      font-size: 3.6rem;
      text-align: left;
      color: currentColor;
    }

    &__content {
      grid-row: main-start / main-end;
      padding: 1rem 4rem;
      font-size: 2.6rem;
      text-align: left;
      color: currentColor;
      overflow: auto;

      &__image-container {
        width: 50rem;
        height: 30rem;
        border-radius: .4rem;
        overflow: hidden;
      }

      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-position: center bottom;
      }
    }

    &__controls {
      grid-row: controls-start / controls-end;

      display: flex;
      justify-content: space-between;

      padding: 2rem 4rem;

      background: var(--primary-color);

      &__item {
        padding: .8rem 1.2rem;
        border: 1px solid var(--dark-primary-color);
        background-color: var(--dark-primary-color);
        font-size: 2rem;

        &:hover {
          background-color: var(--accent-color);
        }
      }
    }
  }

  .lesson-sidebar {
    font-size: 2rem; 

    &__container {
      display: grid;
      grid-template-rows: [content-start] 1fr [content-end
                          input-start] min-content [input-end];

      height: 100%;
    }

    &__content {
      text-align: left;
      overflow: auto;

      &__answer {
        color: var(--secondary-text);
        margin-left: 1rem;
      }
    }

    &__input__container {
      display: flex;
      flex-direction: column;
    }

    &__input {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    &__submit {
      margin-bottom: 3rem;
      border: 1px solid var(--primary-color);
      background-color: var(--dark-primary-color);
      color: var(--text);
      font-size: 1.4rem;

      &:hover {
        background-color: var(--accent-color);
      }
    }
  }
</style>
