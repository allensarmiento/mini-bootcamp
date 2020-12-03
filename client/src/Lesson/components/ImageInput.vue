<template>
  <div class="image-input">
    <h5>{{ prepend }}</h5>
    <BInputGroup>
      <BFormInput
        v-model="image"
        class="image-input__value"
        @keyup="onChange"
      />
    </BInputGroup>

    <h5>Object Fit</h5>
    <BInputGroup>
      <BFormInput
        v-model="objectFit"
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
    index: { type: Number, default: null },
  },
  data() {
    return {
      data: { ...this.input },
      image: '',
      objectFit: '',
    };
  },
  mounted() {
    if ('imageStyles' in this.data === false) {
      this.data.imageStyles = {
        objectFit: '',
      };
    }

    this.image = this.data.image;
    this.objectFit = this.data.imageStyles.objectFit || '';
  },
  watch: {
    image() {
      this.onChange();
    },
    objectFit() {
      this.onChange();
    },
  },
  methods: {
    onChange() {
      this.data.image = this.image;
      this.data.imageStyles.objectFit = this.objectFit;
      this.$emit('onChange', this.data, this.index);
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
