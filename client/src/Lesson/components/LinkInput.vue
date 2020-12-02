<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormInput v-model="data.link" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormInput } from 'bootstrap-vue';

export default {
  name: 'ImageInput',
  components: { BInputGroup, BFormInput },
  props: {
    prepend: { type: String, default: 'Link' },
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
