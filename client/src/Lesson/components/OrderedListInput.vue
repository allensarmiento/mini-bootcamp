<template>
  <div>
    <h5>{{ prepend }}</h5>
    <BInputGroup v-for="(item, index) in orderedList" :key="index">
      <BFormInput v-model="orderedList[index]" />
    </BInputGroup>
    <BButton variant="success" @click="addItem">Add Item</BButton>
    <BButton variant="danger" @click="removeItem">Remove Item</BButton>
  </div>
</template>

<script>
import { BInputGroup, BFormInput, BButton } from 'bootstrap-vue';

export default {
  name: 'OrderedListInput',
  components: { BInputGroup, BFormInput, BButton },
  props: {
    prepend: { type: String, default: 'Ordered List' },
    input: { type: Object, default: () => ({}) },
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
      orderedList: [],
    };
  },
  mounted() {
    this.orderedList = this.data.orderedList || [''];
  },
  watch: {
    orderedList() {
      this.onChange();
    },
  },
  methods: {
    onChange() {
      this.data.orderedList = this.orderedList;
      this.$emit('onChange', this.data, this.index);
    },
    addItem() {
      this.orderedList.push('');
    },
    removeItem() {
      this.orderedList.pop();
    },
  },
};
</script>

<style lang="scss" scoped></style>
