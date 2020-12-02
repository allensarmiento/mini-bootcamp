<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormTextarea v-model="data.text" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormTextarea } from 'bootstrap-vue';

export default {
  name: 'QuestionInput',
  components: { BInputGroup, BFormTextarea },
  props: {
    prepend: { type: String, default: 'Question' },
    input: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      data: { ...this.input },
    };
  },
  methods: {
    onChange() {
      this.$emit('onChange', this.data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
