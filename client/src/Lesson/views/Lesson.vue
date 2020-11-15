<template>
  <section class="lesson">
    <h1 class="lesson__title">Lesson {{ lessonNumber }}</h1>

    <Slide
      v-if="slides.length"
      :title="slides[slideIndex].title"
      :displayItems="displayItems"
      :isAdmin="userProfile.role === 'admin'"
      :showSidebar="showSidebar"
      @slideBackward="slideBackward"
      @toggleSidebar="toggleSidebar"
      @slideForward="slideForward"
    />

    <Sidebar
      :show="showSidebar"
      :title="`${userProfile.name}'s Answers`"
      :items="sidebarItems"
      @submitAnswer="submitAnswer"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import io from 'socket.io-client';
import Slide from '../components/Slide.vue';
import Sidebar from '../components/Sidebar.vue';
import { getLesson, submitAnswer } from '../data/lesson';

const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000/';

export default {
  name: 'Lesson',
  components: {
    Slide,
    Sidebar,
  },
  data() {
    return {
      socket: null,

      showSidebar: false,

      slides: [],
      slideIndex: 0,
      itemIndex: 0,

      displayItems: [],

      sidebarItems: [],

      currentQuestion: '',
    };
  },
  computed: {
    ...mapState(['userProfile']),
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
  },
  async mounted() {
    this.initializeSocket();

    this.slides = await getLesson(this.lessonNumber);
  },
  methods: {
    initializeSocket() {
      this.socket = io(ENDPOINT);

      this.socket.on('connect', () => console.log('connected'));

      this.socket.on('toggleSidebar', (value) => {
        this.showSidebar = value;
      });

      this.socket.on('lessonState', (indexes) => {
        const { slideIndex, itemIndex, displayItems } = indexes;

        this.slideIndex = slideIndex;
        this.itemIndex = itemIndex;
        this.displayItems = displayItems;

        // Refs aren't reactive, so it has to be done manually.
        setTimeout(() => {
          const lessonContainer = document.querySelector('.slide__content');
          if (lessonContainer) {
            console.log(
              `Top: ${lessonContainer.scrollTop},\
              Height: ${lessonContainer.scrollHeight}`,
            );
            lessonContainer.scrollTop = lessonContainer.scrollHeight;
          }
        }, 50);
      });

      this.socket.on('sidebarState', (options) => {
        const { currentQuestion } = options;
        this.sidebarItems.push({ type: 'question', text: currentQuestion });
        this.currentQuestion = currentQuestion;
      });
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      this.socket.emit('toggle', this.showSidebar);
    },
    slideBackward() {
      if (this.itemIndex === 0) {
        if (this.slideIndex === 0) {
          console.log('This is the very beginning.');
        } else {
          this.slideIndex -= 1;
          this.displayItems = this.slides[this.slideIndex].items;
          this.itemIndex = this.slides[this.slideIndex].items.length;
        }
      } else {
        this.itemIndex -= 1;
        this.displayItems.pop();
      }

      this.socket.emit('lesson', {
        slideIndex: this.slideIndex,
        itemIndex: this.itemIndex,
        displayItems: this.displayItems,
      });
    },
    slideForward() {
      if (this.itemIndex === this.slides[this.slideIndex].items.length) {
        if (this.slideIndex === this.slides.length - 1) {
          console.log('This is the end.');
        } else {
          this.slideIndex += 1;
          this.displayItems = [];
          this.itemIndex = 0;
        }
      } else {
        this.displayItems
          .push(this.slides[this.slideIndex].items[this.itemIndex]);

        if (
          this.slides[this.slideIndex].items[this.itemIndex].type === 'question'
        ) {
          this.currentQuestion = this.slides[this.slideIndex]
            .items[this.itemIndex].text;

          this.socket.emit('sidebar', {
            currentQuestion: this.currentQuestion,
          });
        }

        this.itemIndex += 1;
      }

      this.socket.emit('lesson', {
        slideIndex: this.slideIndex,
        itemIndex: this.itemIndex,
        displayItems: this.displayItems,
      });
    },
    async submitAnswer(answer) {
      if (answer) {
        this.sidebarItems.push({ text: answer });
        await submitAnswer({
          lessonNumber: this.lessonNumber,
          name: this.userProfile.name,
          question: this.currentQuestion,
          answer,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .slide {
  grid-row: main-start / main-end;
}
</style>
