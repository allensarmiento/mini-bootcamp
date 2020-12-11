<template>
  <section class="lesson">
    <h1 class="lesson__title">Lesson {{ lessonNumber }}</h1>

    <BJumbotron class="slide" container-fluid>
      <div v-if="screenShareActive"></div>
      <div v-if="screenShareActive">

      </div>

      <h2 v-if="!screenShareActive && slides.length" class="slide__title">
        {{ slides[slideIndex].title }}
      </h2>
      <Slide
        v-if="!screenShareActie && slides.length"
        :title="slides[slideIndex].title"
        :slideItems="slideItems"
      />

      <div class="controls"></div>
    </BJumbotron>
  </section>
</template>

<script>
import { BJumbotron } from 'bootstrap-vue';
import Slide from '../../Slide/views/Slide.vue';

export default {
  name: 'Lesson',
  components: {
    BJumbotron,
    Slide,
  },
};
</script>

<style lang="scss" scoped>

</style>
