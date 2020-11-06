<template>
  <div class="lesson">
    <h1 class="lesson__title">Lesson 1</h1>

    <b-jumbotron class="lesson-slide" container-fluid>
      <h2 class="lesson-slide__title">
        {{ slides[slideIndex].title }}
      </h2>

      <div class="lesson-slide__content">
        <div v-for="(displayItem, key) in displayItems" :key="key">
          <p v-if="displayItem.type === 'text'">{{ displayItem.text }}</p>
          <div 
            v-if="displayItem.type === 'image'"
            class="lesson-slide__content__image-container"
          >
            <img 
              v-if="displayItem.type === 'image'"
              class="lesson-slide__content__image"
              :src="displayItem.image"
            /> 
          </div>
        </div>
      </div>

      <div class="lesson-slide__controls">
        <b-button 
          class="lesson-slide__controls__item" 
          variant="primary" 
          href="#"
        >
          &larr; Move Back
        </b-button>

        <b-button 
          v-b-toggle.sidebar-right
          class="lesson-slide__controls__item"
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
    </b-jumbotron>

    <b-sidebar 
      id="sidebar-right"
      class="lesson-sidebar" 
      title="Name's Answers" 
      right 
      shadow
    >
      <div class="lesson-sidebar__container px-3 py-4">
        <div class="lesson-sidebar__content">
          <div v-for="(displayItem, key) in displayItems" :key="key">
            <p v-if="displayItem.type === 'text'">{{ displayItem.text }}</p>
          </div>
        </div>

        <div class="lesson-sidebar__input__container">
          <b-form-textarea
            id="textarea"
            class="lesson-sidebar__input"
            v-model="text"
            placeholder="Enter something..."
            rows="5"
            max-rows="6"
          ></b-form-textarea>
          <b-button 
            class="lesson-sidebar__submit"
          >
            Submit
          </b-button>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import lesson from '../mock/lesson_1_slides.json'

export default {
  name: 'Lesson',
  data: function() {
    return {
      slideIndex: 0,
      itemIndex: 0,

      slides: lesson,

      displayItems: []
    }
  },
  mounted: function() {

  },
  methods: {
    moveForward: function() {
      if (this.itemIndex < this.slides[this.slideIndex].items.length) {
        this.displayItems
          .push(this.slides[this.slideIndex].items[this.itemIndex])
        this.itemIndex += 1
      } else {
        if (this.slideIndex < this.slides.length) {
          this.slideIndex += 1
          this.itemIndex = 0
          this.displayItems = []
        }
      }

      if (
        this.itemIndex === this.slides[this.slideIndex].items.length && 
        this.slideIndex === this.slides.length
      ) {
        this.displayItems = ['The end']
        console.log('The end!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .lesson {
    display: grid;
    grid-template-rows: [title-start] 10vh [title-end
                        main-start] 90vh [main-end];

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
    height: 90vh;
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
