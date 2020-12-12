<template>
  <div class="dashboard">
    <BInputGroup
      v-if="userProfile.role === 'admin'"
      prepend="Lesson"
      class="dashboard__lesson mb-5"
    >
      <BFormInput v-model="lessonNumber" />
    </BInputGroup>

    <router-link
      :to="`/lesson/${lessonNumber}`"
      :class="['dashboard__btn', joinRoomClass]"
      :disabled="joinRoomDisabled"
      tag="button"
    >
      Join Room
    </router-link>

    <main class="dashboard__main-container">
      <div class="dashboard__lesson-container">
        <h2 class="dashboard__lesson__title">Review Lessons</h2>
        <section class="dashboard__lessons">
          <LessonLink
            v-for="lessonNumber in reviewLessons"
            :key="lessonNumber"
            :to="`lesson/${lessonNumber}/review`"
            class="dashboard__lessons"
            :variant="lessonNumber !== lessons.length ? 'secondary' : 'success'"
          >
            Review Lesson {{ lessonNumber }}
          </LessonLink>
        </section>
      </div>
    </main>

    <!-- ADMIN -->
    <hr v-if="isAdmin" />

    <h2 v-if="isAdmin" class="mt-5">Edit Lessons</h2>

    <section v-if="isAdmin" class="dashboard__edit__lessons">
      <LessonLink
        v-for="lessonNumber in lessons"
        :key="lessonNumber"
        :to="`/lesson/${lessonNumber}/edit`"
        class="dashboard__lessons"
        :variant="lessonNumber !== lessons.length ? 'secondary' : 'success'"
      >
        Edit Lessson {{ lessonNumber }}
      </LessonLink>
    </section>

    <BButton
      v-if="isAdmin"
      class="dashboard__lessons__new"
      variant="primary"
      @click="addNewLesson"
    >
      Add New Lesson
    </BButton>

    <hr v-if="isAdmin" />

    <Signup v-if="isAdmin" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import io from 'socket.io-client';
import { BInputGroup, BFormInput, BButton } from 'bootstrap-vue';
import LessonLink from '../components/LessonLink.vue';
import Signup from '../../Auth/views/Signup.vue';
import {
  getLessons,
  canJoinLesson,
  createNewLesson,
} from '../../data/firebase/lesson';
import { ENDPOINT } from '../../constants/constants';

export default {
  name: 'Dashboard',
  components: {
    BInputGroup,
    BFormInput,
    BButton,
    LessonLink,
    Signup,
  },
  data() {
    return {
      lessons: [],
      reviewLessons: [],

      lessonNumber: 1,
      canJoinRoom: false,

      socket: null,
    };
  },
  computed: {
    ...mapState(['userProfile']),
    isAdmin() {
      return this.userProfile.role === 'admin';
    },
    joinRoomDisabled() {
      let disabled = true;

      if (this.userProfile.role === 'admin') disabled = false;
      else if (this.canJoinRoom) disabled = false;

      return disabled;
    },
    joinRoomClass() {
      return this.joinRoomDisabled ? '' : 'dashboard__btn--active';
    },
  },
  async mounted() {
    const lessonData = await getLessons();
    lessonData.forEach((lesson, index) => {
      this.lessons.push(index + 1);
      this.reviewLessons.push(index + 1);
    });

    this.lessonNumber = this.lessons.length;

    this.initializeSocket();
    this.canJoinRoom = await canJoinLesson();
  },
  methods: {
    initializeSocket() {
      this.socket = io(ENDPOINT);

      this.socket.on('connect', () => {});

      this.socket.on('canJoin', (value) => {
        console.log(`Can join ${value}`);
        if (this.userProfile.role !== 'admin') this.canJoinRoom = value;
      });
    },
    async addNewLesson() {
      const newLessonNumber = this.lessons.length + 1;
      await createNewLesson(newLessonNumber);

      const lessonsData = await getLessons();
      this.lessons = [];
      this.reviewLessons = [];

      lessonsData.forEach((lesson, index) => {
        this.lessons.push(index + 1);
        this.reviewLessons.push(index + 1);
      });
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
  text-align: center;

  &__lesson {
    width: 50%;
    margin: auto;
  }

  &__btn {
    padding: 1rem 2rem;
    margin-bottom: 8rem;
    background: var(--light-primary-color);
    border: none;
    border-radius: .4rem;
    color: var(--text-light);
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

  &__lessons, &__edit__lessons {
    padding: 2rem 0;
  }

  &__lessons {
    &__new {
      font-size: 1.8rem;
    }
  }
}
</style>
