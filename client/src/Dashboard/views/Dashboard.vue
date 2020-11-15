<template>
  <div class="dashboard">
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

    <hr />

    <!-- Review Lessons -->
    <h2 class="mt-5">Review Lessons</h2>
    <section>
      <p>Currently in progress...</p>
    </section>

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
        :text="`Lesson ${lessonNumber}`"
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

export default {
  name: 'Dashboard',
  components: { LessonLink, SignupForm },
  data() {
    return {
      lessons: [1, 2, 3, 4],
    };
  },
  computed: mapState(['userProfile']),
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 4rem;
  font-size: 1.6rem;

  &__lessons, &__edit-lessons {
    padding: 2rem 0;
  }
}
</style>
