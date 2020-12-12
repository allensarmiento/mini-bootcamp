<template>
  <BSidebar
    v-model="show"
    id="sidebar-left"
    class="sidebar"
    :title="title"
    no-header
    shadow
  >
    <div class="sidebar__container px-3 py-4">
      <h4 class="sidebar__title">{{ title }}</h4>
      <Content :items="items" />
      <AnswerInput
        :lessonNumber="lessonNumber"
        :currentQuestion="currentQuestion"
        @answerSubmitted="answerSubmitted"
      />
    </div>
  </BSidebar>
</template>

<script>
import { BSidebar } from 'bootstrap-vue';
import Content from '../components/Content.vue';
import AnswerInput from '../components/AnswerInput.vue';

export default {
  name: 'Sidebar',
  components: {
    BSidebar,
    Content,
    AnswerInput,
  },
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
    lessonNumber: { type: [Number, String], required: true },
    currentQuestion: { type: String, default: '' },
    items: { type: Array, default: () => ([]) },
  },
  methods: {
    answerSubmitted(answer) {
      this.$emit('answerSubmitted', answer);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  font-size: 2rem;

  &__container {
    display: grid;
    grid-template-rows: [title-start] min-content [title-end
                        content-start] 1fr [content-end
                        input-start] min-content [input-end];
    height: 100%;
  }

  &__title {
    grid-row: title-start / title-end;
    text-align: right;
  }
}

v::deep .content {
  grid-row: content-start / content-end;
}

v::deep .input {
  grid-row: input-start / input-end;
}
</style>
