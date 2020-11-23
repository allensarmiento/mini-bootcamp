<template>
  <div class="dashboard">
    <div class="dashboard__main-container">
      <div class="dashboard__lesson-container">
        <h2>Lessons</h2>
        <!-- Lessons -->
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
      </div>

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

    <hr v-if="userProfile.role === 'admin'" />

    <!-- Signup -->
    <SignupForm v-if="userProfile.role === 'admin'" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LessonLink from '../components/LessonLink.vue';
import SignupForm from '../components/SignupForm.vue';
import { getLessons } from '../data/lessons';

export default {
  name: 'Dashboard',
  components: { LessonLink, SignupForm },
  data() {
    return {
      lessons: [],
      reviewLessons: [],
    };
  },
  computed: mapState(['userProfile']),
  async mounted() {
    const data = await getLessons();

    for (let i = 0; i < data.length; i += 1) {
      this.lessons.push(i + 1);
      this.reviewLessons.push(i + 1);
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 4rem;
  font-size: 1.6rem;

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
