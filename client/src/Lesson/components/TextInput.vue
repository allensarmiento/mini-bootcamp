<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormTextarea v-model="text" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormTextarea } from 'bootstrap-vue';

export default {
  name: 'TextInput',
  components: { BInputGroup, BFormTextarea },
  props: {
    prepend: { type: String, default: 'Text' },
    input: { type: Object, default: () => ({}) },
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
      text: '',
    };
  },
  mounted() {
    this.text = this.data.text || '';
  },
  watch: {
    text() {
      this.onChange();
    },
  },
  methods: {
    onChange() {
      this.data.text = this.text;
      this.$emit('onChange', this.data, this.index);
    },
  },
};
</script>

<style lang="scss" scoped></style>
