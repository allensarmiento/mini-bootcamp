<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup v-for="(item, index) in data.list" :key="index">
      <BFormInput v-model="item.listItem" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormInput } from 'bootstrap-vue';

export default {
  name: 'ListInput',
  components: { BInputGroup, BFormInput },
  props: {
    prepend: { type: String, default: 'List' },
    input: { type: Object, default: () => ({}) },
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
    };
  },
  methods: {
    onChange() {
      this.$emit('onChange', this.data, this.index);
    },
  },
};
</script>

<style lang="scss" scoped></style>
