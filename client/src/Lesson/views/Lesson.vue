<template>
  <section class="lesson">
    <h1 class="lesson__title">Lesson {{ lessonNumber }}</h1>

    <BJumbotron class="slide" continer-fluid>
      <div v-if="screenShareActive"><!-- --></div>
      <ScreenShare v-if="screenShareActive" />

      <h2 v-if="!screenShareActive && slides.length" class="slide__title">
        {{ slides[slideIndex].title }}
      </h2>

      <Slide
        v-if="!screenShareActive && slides.length"
        :title="slides[slideIndex].title"
        :displayItems="displayItems"
      />

      <UserControls
        :expanded="`${showSidebar}`"
        :videoOn="videoOn"
        :audioOn="audioOn"
        @toggleVideo="toggleVideo"
        @toggleAudio="toggleAudio"
        @leave="leaveClicked"
        @toggleScreenShare="screenShareClicked"
        @slideBackward="slideBackward"
        @toggleSidebar="toggleSidebar"
        @slideForward="slideForward"
      />
    </BJumbotron>

    <Video
      class="video"
      :videoOn="videoOn"
      :audioOn="audioOn"
      :leave="leave"
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
import { BJumbotron } from 'bootstrap-vue';
import ScreenShare from '../components/ScreenShare.vue';
import Video from '../components/Video.vue';
import Slide from '../components/Slide.vue';
import Sidebar from '../components/Sidebar.vue';
import UserControls from '../components/UserControls.vue';
import { getLesson, submitAnswer } from '../data/lessonRTD';

const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000/';

export default {
  name: 'Lesson',
  components: {
    BJumbotron,
    ScreenShare,
    Video,
    Slide,
    Sidebar,
    UserControls,
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

      screenShareActive: false,
      videoOn: true,
      audioOn: true,
      leave: false,
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
    console.log(this.slides);
  },
  beforeDestroy() {
    console.log('Stopping users from joining');
    if (this.userProfile.role === 'admin') {
      this.socket.emit('canJoin', false);
    }
  },
  methods: {
    toggleVideo() {
      this.videoOn = !this.videoOn;
    },
    toggleAudio() {
      this.audioOn = !this.audioOn;
    },
    leaveClicked() {
      this.leave = true;
    },
    screenShareClicked() {
      this.screenShareActive = !this.screenShareActive;
      this.socket.emit('screenshare', this.screenShareActive);
    },
    initializeSocket() {
      this.socket = io(ENDPOINT);

      this.socket.on('connect', () => {
        console.log('connected lesson');
        if (this.userProfile.role === 'admin') {
          this.socket.emit('canJoin', true);
        }
      });

      this.socket.on('canJoin', (value) => {
        console.log('can join received');
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
.lesson {
  display: grid;
  grid-template-rows: [title-start] min-content [title-end
                      main-start] 1fr [main-end];
  grid-template-columns: [main-start] 1fr [main-end
                         video-start] 30rem [video-end];

  &__title {
    grid-row: title-start / title-end;
    grid-column: main-start / main-end;
  }
}

.slide {
  grid-row: main-start / main-end;
  grid-column: main-start / main-end;

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
}

.video {
  grid-row: main-start / main-end;
  grid-column: video-start / video-end;

  display: flex;
  flex-direction: column;

  &__container {
    width: 94%;
    height: 18rem;

    margin: .8rem;

    background: rgb(60, 60, 60);
    border-radius: 4px;
  }
}

::v-deep .controls {
  grid-row: controls-start / controls-end;
}
</style>
