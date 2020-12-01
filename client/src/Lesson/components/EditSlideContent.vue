<template>
  <section class="content">
    <BJumbotron
      class="jumbotron"
      v-for="(slide, index) in slides"
      :key="index"
    >
      <h2 class="jumbotron__header">
        Slide {{ slide.number }}: {{ slide.title }}
      </h2>

      <p class="jumbotron__review">
        Show Review: &nbsp;
        <span class="jumbotron__review--value">{{ slide.showReview }}</span>
      </p>

      <hr class="my-4" />

      <section class="content__slide">
        <div v-for="(item, index) in slide.items" :key="index">
          <Content :type="item.type" :value="contentValue(item)" />
        </div>
      </section>

      <section class="content__slide__buttons">
        <BButton
          v-b-modal.modal-center
          class="content__slide__button"
          variant="primary"
          @click="editSlideClicked(slide)"
        >
          Edit
        </BButton>

        <BButton
          class="content__slide__button"
          variant="warning"
          @click="deleteSlideClicked(slide.number)"
        >
          Delete
        </BButton>
      </section>
    </BJumbotron>
  </section>
</template>

<script>
import { BJumbotron, BButton } from 'bootstrap-vue';
import Content from './Content.vue';
import { getSlideValue } from '../utilities/slide';

export default {
  name: 'EditSlideContent',
  components: {
    BJumbotron,
    BButton,
    Content,
  },
  props: {
    slides: { type: Array, default: () => ([]) },
  },
  methods: {
    contentValue(item) {
      return item.type !== 'image' ? item[this.slideValue(item.type)] : item;
    },
    slideValue(type) {
      return getSlideValue(type);
    },
    editSlideClicked(slide) {
      this.$emit('editSlide', slide);
    },
    deleteSlideClicked(number) {
      this.$emit('deleteSlide', number);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 4rem;
  font-size: 2rem;

  &__slide {
    &__buttons {
      display: flex;
      justify-content: space-between;
    }

    &__button {
      font-size: 1.6rem;
    }
  }
}

.jumbotron {
  text-align: left;

  &__header {
    font-size: 3.4rem;
  }

  &__review {
    &--value {
      font-weight: 800;
    }
  }
}
</style>
