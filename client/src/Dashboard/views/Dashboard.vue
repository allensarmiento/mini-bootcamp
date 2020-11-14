<template>
  <div class="dashboard">
    <h2>Lessons</h2>
    <section class="dashboard__lessons">
      <LessonLink to="/lesson/1" variant="secondary" text="Lesson 1" />
      <LessonLink to="/lesson/2" variant="secondary" text="Lesson 2" />
      <LessonLink to="/lesson/3" variant="success" text="Lesson 3" />
    </section>

    <hr />

    <h2 class="mt-5">Review Lessons</h2>
    <section>
      <p>Currently in progress...</p>
    </section>

    <hr v-if="userProfile.role === 'admin'" />

    <h2 v-if="userProfile.role === 'admin'" class="mt-5">Edit Lessons</h2>
    <section
      v-if="userProfile.role === 'admin'"
      class="dashboard__edit-lessons"
    >
      <LessonLink to="/lesson/1/edit" variant="secondary" text="Lesson 1" />
      <LessonLink to="/lesson/2/edit" variant="secondary" text="Lesson 2" />
      <LessonLink to="/lesson/3/edit" variant="success" text="Lesson 3" />
    </section>

    <hr v-if="userProfile.role === 'admin'" />

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
