<template>
  <div class="image-input">
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormInput
        v-model="data.image"
        class="image-input__value"
        @keyup="onChange"
      />
    </BInputGroup>

    <h5>Object Fit</h5>
    <BInputGroup>
      <BFormInput
        v-model="data.imageStyles.objectFit"
        class="image-input__value"
      />
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
    input: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      data: this.input,
    };
  },
  methods: {
    onChange() {
      this.$emit('onChange', this.data);
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
