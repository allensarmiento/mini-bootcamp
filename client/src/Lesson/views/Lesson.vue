<template>
  <section class="lesson">
    <h1 class="lesson__title">Lesson {{ lessonNumber }}</h1>

    <Slide
      :screenShareActive="screenShareActive"
      :title="slideTitle"
      :slideItems="slideItems"
    />

    <VideoCall
      @screenShareClicked="screenShareClicked"
      @slideBackward="slideBackward"
      @toggleSidebar="toggleSidebar"
      @slideForward="slideForward"
    />

    <Sidebar
      :show="showSidebar"
      :title="`${userProfile.name}'s Answers`"
      :lessonNumber="lessonNumber"
      :currentQuestion="currentQuestion"
      :items="sidebarItems"
      @answerSubmitted="answerSubmitted"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import io from 'socket.io-client';
import VideoCall from '../../VideoCall/views/Video.vue';
import Slide from '../../Slide/views/Slide.vue';
import Sidebar from '../../Sidebar/views/Sidebar.vue';
import { updateJoin, getLesson } from '../../data/firebase/lesson';
import { ENDPOINT } from '../../constants/constants';

export default {
  name: 'Lesson',
  components: {
    Slide,
    VideoCall,
    Sidebar,
  },
  data() {
    return {
      socket: null,
      screenShareActive: false,

      slides: [],
      slideIndex: 0,
      itemIndex: 0,

      slideItems: [],

      showSidebar: false,
      sidebarItems: [],
      currentQuestion: '',
    };
  },
  computed: {
    ...mapState(['userProfile']),
    lessonNumber() {
      return this.$route.params.lessonNumber;
    },
    slideTitle() {
      return this.slides[this.slideIndex] && this.slides[this.slideIndex].title
        ? this.slides[this.slideIndex].title
        : '';
    },
  },
  async mounted() {
    if (this.userProfile.role === 'admin') await updateJoin(true);

    this.initializeSocket();

    this.slides = await getLesson(this.lessonNumber);
  },
  async beforeDestroy() {
    if (this.userProfile.role === 'admin') {
      this.socket.emit('canJoin', false);
      await updateJoin(false);
    }
  },
  methods: {
    initializeSocket() {
      this.socket = io(ENDPOINT);

      this.socket.on('connect', () => {
        if (this.userProfile.role === 'admin') {
          this.socket.emit('canJoin', true);
        }
      });

      this.socket.on('canJoin', (value) => {
        if (this.userProfile.role !== 'admin') {
          if (!value && this.$router.history.current.path !== '/') {
            this.$router.push('/');
          }
        }
      });

      this.socket.on('screenShareActive', (value) => {
        this.screenShareActive = value;
      });

      this.socket.on('toggleSidebar', (value) => {
        this.showSidebar = value;
      });

      this.socket.on('lessonState', (indexes) => {
        const { slideIndex, itemIndex, slideItems } = indexes;

        this.slideIndex = slideIndex;
        this.itemIndex = itemIndex;
        this.slideItems = slideItems;

        // Note: refs aren't reactive, so it has to be done manually.
        setTimeout(() => {
          const lessonContainer = document.querySelector('.slide-content');

          if (lessonContainer) {
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
    screenShareClicked() {
      this.screenShareActive = !this.screenShareActive;
      this.socket.emit('screenshare', this.screenShareActive);
    },
    slideBackward() {
      if (this.itemIndex === 0) {
        if (this.slideIndex === 0) {
          console.log('This is the very beginning');
        } else {
          this.slideIndex -= 1;

          const updatedItems = [...this.slides[this.slideIndex].items];
          this.slideItems = updatedItems;
          this.itemIndex = updatedItems.length;
        }
      }
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      this.socket.emit('toggle', this.showSidebar);
    },
    slideForward() {
      const itemsLength = this.slides[this.slideIndex].items.length;

      if (this.itemIndex === itemsLength) {
        if (this.slideIndex === this.slides.length - 1) {
          console.log('This is the end');
        } else {
          this.slideIndex += 1;
          this.slideItems = [];
          this.itemIndex = 0;
        }
      } else {
        const newItem = this.slides[this.slideIndex].items[this.itemIndex];
        this.slideItems.push(newItem);

        console.log(newItem.type);
        if (newItem.type === 'question') {
          this.currentQuestion = newItem.text;

          this.socket
            .emit('sidebar', { currentQuestion: this.currentQuestion });
        }

        this.itemIndex += 1;
      }

      this.socket.emit('lesson', {
        slideIndex: this.slideIndex,
        itemIndex: this.itemIndex,
        slideItems: this.slideItems,
      });
    },
    answerSubmitted(answer) {
      this.sidebarItems.push({ text: answer });
    },
  },
};
</script>

<style lang="scss" scoped>
.lesson {
  display: grid;
  grid-template-rows: [title-start] min-content [title-end
                      main-start] 1fr [main-end];
  grid-template-columns: [main-start] 1fr [main-end
                         video-start] 28vw [video-end];

  &__title {
    grid-row: title-start / title-end;
    grid-column: main-start / video-end;
  }
}

v::deep .slide {
  grid-row: main-start / main-end;
  grid-column: main-start / main-end;
}

v::deep .video {
  grid-row: main-start / main-end;
}

.controls {
  grid-row: controls-start / controls-end;
  background: var(--primary-color);
}
</style>
