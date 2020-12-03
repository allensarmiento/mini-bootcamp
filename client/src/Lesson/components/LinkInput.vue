<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormInput v-model="link" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormInput } from 'bootstrap-vue';

export default {
  name: 'LinkInput',
  components: { BInputGroup, BFormInput },
  props: {
    prepend: { type: String, default: 'Link' },
    input: { type: Object, default: () => ({}) },
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
      link: '',
    };
  },
  mounted() {
    this.link = this.data.link || '';
  },
  watch: {
    link() {
      this.onChange();
    },
  },
  methods: {
    onChange() {
      this.data.link = this.link;
      this.$emit('onChange', this.data, this.index);
    },
  },
};
</script>

<style lang="scss" scoped></style>
