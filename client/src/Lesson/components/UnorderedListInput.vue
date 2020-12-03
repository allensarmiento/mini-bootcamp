<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup v-for="(item, index) in unorderedList" :key="index">
      <BFormInput v-model="unorderedList[index]" />
    </BInputGroup>
    <BButton variant="success" @click="addItem">Add Item</BButton>
    <BButton variant="danger" @click="removeItem">Remove Item</BButton>
  </div>
</template>

<script>
import { BInputGroup, BFormInput, BButton } from 'bootstrap-vue';

export default {
  name: 'UnorderedListInput',
  components: { BInputGroup, BFormInput, BButton },
  props: {
    prepend: { type: String, default: 'Unordered List' },
    input: { type: Object, default: () => ({}) },
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
      unorderedList: [],
    };
  },
  mounted() {
    console.log(this.data);
    this.unorderedList = this.data.unorderedList || [''];
  },
  watch: {
    unorderedList() {
      this.onChange();
    },
  },
  methods: {
    onChange() {
      this.data.unorderedList = this.unorderedList;
      this.$emit('onChange', this.data, this.index);
    },
    addItem() {
      this.unorderedList.push('');
    },
    removeItem() {
      this.unorderedList.pop();
    },
  },
};
</script>

<style lang="scss" scoped></style>
