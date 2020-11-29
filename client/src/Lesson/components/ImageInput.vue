<template>
  <div class="image-input">
    <BInputGroup :prepend="prepend">
      <BFormInput
        v-model="value"
        class="image-input__value"
        @keyup="onChange"
      />
    </BInputGroup>
    <BInputGroup prepend="Object Fit">
      <BFormInput v-model="value" class="image-input__value" />
    </BInputGroup>
  </div>
</template>

<script>
import { BInputGroup, BFormInput } from 'bootstrap-vue';

export default {
  name: 'ImageInput',
  components: { BInputGroup, BFormInput },
  props: {
    prepend: { type: String, default: 'Image' },
    input: { type: String, default: '' },
  },
  data() {
    return {
      value: this.input,
    };
  },
  methods: {
    onChange() {
      this.$emit('onChange', this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-input {

  &__value {
    font-size: 1.4rem;
  }
}
</style>
