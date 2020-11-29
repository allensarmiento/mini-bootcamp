<template>
  <div class="dashboard">
    <router-link
      :to="`/lesson/${lessons.length}`"
      tag="button"
      :class="['dashboard__btn', joinRoomDisabled
        ? ''
        : 'dashboard__btn--active']"
      :disabled="joinRoomDisabled"
    >
      Join Room
    </router-link>

    <div class="dashboard__main-container">
      <!-- <div class="dashboard__lesson-container">
        <h2>Lessons</h2>
        <section class="dashboard__lessons">
          <LessonLink
            v-for="lessonNumber in lessons"
            :key="lessonNumber" class="dashboard__lessons"
            :to="`/lesson/${lessonNumber}`"
            :variant="lessonNumber !== lessons.length
              ? 'secondary' : 'success'"
            :text="`Lesson ${lessonNumber}`"
          />
        </section>
      </div> -->

      <!-- Review Lessons -->
      <div class="dashboard__lesson-container">
        <h2>Review Lessons</h2>
        <section class="dashboard__lessons">
          <LessonLink
            v-for="lessonNumber in reviewLessons"
            :key="lessonNumber" class="dashboard__lessons"
            :to="`/lesson/${lessonNumber}/review`"
            :variant="lessonNumber !== lessons.length
              ? 'secondary' : 'success'"
            :text="`Review Lesson ${lessonNumber}`"
          />
        </section>
      </div>
    </div>

    <hr v-if="userProfile.role === 'admin'" />

    <!-- Edit Lessons -->
    <h2 v-if="userProfile.role === 'admin'" class="mt-5">Edit Lessons</h2>
    <section
      v-if="userProfile.role === 'admin'"
      class="dashboard__edit-lessons"
    >
      <LessonLink
        v-for="lessonNumber in lessons"
        :key="lessonNumber" class="dashboard__lessons"
        :to="`/lesson/${lessonNumber}/edit`"
        :variant="lessonNumber !== lessons.length
          ? 'secondary' : 'success'"
        :text="`Edit Lesson ${lessonNumber}`"
      />
    </section>

    <BButton v-if="userProfile.role === 'admin'" variant="primary" @click="addNewLesson">
      Add New Lesson
    </BButton>

    <hr v-if="userProfile.role === 'admin'" />

    <!-- Signup -->
    <SignupForm v-if="userProfile.role === 'admin'" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import io from 'socket.io-client';
import { BButton } from 'bootstrap-vue';
import LessonLink from '../components/LessonLink.vue';
import SignupForm from '../components/SignupForm.vue';
import { getLessons, addNewLesson, canJoin } from '../data/lessons';

const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000/';

export default {
  name: 'Dashboard',
  components: { BButton, LessonLink, SignupForm },
  data() {
    return {
      lessons: [],
      reviewLessons: [],

      socket: null,
      canJoin: false,
    };
  },
  computed: {
    ...mapState(['userProfile']),
    joinRoomDisabled() {
      let disabled = true;

      if (this.userProfile.role === 'admin') {
        disabled = false;
      } else if (this.canJoin) {
        disabled = false;
      }

      return disabled;
    },
  },
  async mounted() {
    const data = await getLessons();

    for (let i = 0; i < data.length; i += 1) {
      this.lessons.push(i + 1);
      this.reviewLessons.push(i + 1);
    }

    this.initializeSocket();
    this.canJoin = await canJoin();
  },
  methods: {
    initializeSocket() {
      this.socket = io(ENDPOINT);

      this.socket.on('connect', () => {
        console.log('connected dashboard');
      });

      this.socket.on('canJoin', (value) => {
        this.canJoin = value;
        console.log(this.canJoin);
      });
    },
    async addNewLesson() {
      const newLessonNumber = this.lessons.length + 1;
      await addNewLesson(newLessonNumber);

      const data = await getLessons();
      this.lessons = [];
      this.reviewLessons = [];

      for (let i = 0; i < data.length; i += 1) {
        this.lessons.push(i + 1);
        this.reviewLessons.push(i + 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes pulsate {
  0% {
    transform: scale(1);
    box-shadow: none;
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 1rem 4rem, rgba(0, 0, 0, .25);
  }

  100% {
    transform: scale(1);
    box-shadow: none;
  }
}

.dashboard {
  padding: 4rem;
  font-size: 1.6rem;

  &__btn {
    padding: 1rem 2rem;
    margin-bottom: 8rem;
    background: var(--light-primary-color);
    border: none;
    border-radius: .4rem;
    color: var(--text);
    font-size: 1.8rem;

    &--active {
      background: var(--dark-primary-color);
      animation: pulsate 1s infinite;
    }
  }

  &__main-container {
    display: flex;
  }

  &__lesson-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  &__lessons, &__edit-lessons {
    padding: 2rem 0;
  }
}
</style>
