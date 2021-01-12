<template>
  <div class="input">
    <BFormTextarea
      v-model="answerInput"
      class="input__area"
      placeholder="Enter answer..."
      rows="5"
      max-rows="6"
    />

    <BButton class="input__submit" @click="submitAnswer">
      Submit
    </BButton>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BFormTextarea, BButton } from 'bootstrap-vue';
import { sendAnswer } from '../../data/firebase/lesson';

export default {
  name: 'AnswerInput',
  components: {
    BFormTextarea,
    BButton,
  },
  props: {
    lessonNumber: { type: [Number, String], required: true },
    currentQuestion: { type: String, default: '' },
  },
  computed: {
    ...mapState(['userProfile']),
  },
  data() {
    return {
      answerInput: '',
    };
  },
  methods: {
    async submitAnswer() {
      if (!this.answerInput) return;

      await sendAnswer({
        lessonNumber: this.lessonNumber,
        name: this.userProfile.name,
        question: this.currentQuestion,
        answer: this.answerInput,
      });

      this.$emit('answerSubmitted', this.answerInput);
      this.answerInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: column;

  &__area {
    font-size: 1.8rem;
    flex-direction: column;
  }

  &__submit {
    margin-bottom: 1rem;
    background-color: var(--dark-primary-color);
    border: .1rem solid var(--primary-color);
    color: var(--text-light);
    font-size: 1.4rem;

    &:hover {
      background-color: var(--accent-color);
    }
  }
}
</style>
