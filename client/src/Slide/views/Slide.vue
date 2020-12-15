<template>
  <BJumbotron
    v-if="screenShareActive"
    :class="[
      'slide',
      screenShareActive ? 'screenshare' : '',
      isSplit ? 'screenshare__split' : '',
    ]"
    container-fluid
  >
    <button class="split-button" @click="toggleSplit">
      {{ isSplit ? 'No Split' : 'Split' }}
    </button>

    <ScreenShare
      :class="[
        'screenshare__screen',
        isSplit ? 'screenshare__screen--split' : ''
      ]"
    />
    <h2 :class="['slide__title', isSplit ? 'slide__title--split' : '']">
      {{ title }}
    </h2>
    <div :class="['slide__content', isSplit ? 'slide__content--split': '']">
      <SlideContent
        v-for="(slideItem, index) in slideItems"
        :key="index"
        :type="slideItem.type"
        :value="slideItem"
      />
    </div>
  </BJumbotron>

  <BJumbotron v-else class="slide" container-fluid>
    <h2 class="slide__title">{{ title }}</h2>
    <div v-if="slideItems.length" class="slide__content">
      <SlideContent
        v-for="(slideItem, index) in slideItems"
        :key="index"
        :type="slideItem.type"
        :value="slideItem"
      />
    </div>
  </BJumbotron>
</template>

<script>
import { BJumbotron } from 'bootstrap-vue';
import ScreenShare from '../../ScreenShare/views/ScreenShare.vue';
import SlideContent from '../../SlideContent/views/Content.vue';

export default {
  name: 'Slide',
  components: { BJumbotron, ScreenShare, SlideContent },
  props: {
    screenShareActive: { type: Boolean, default: false },
    title: { type: String, default: '' },
    slideItems: { type: Array, default: () => ([]) },
  },
  data() {
    return {
      isSplit: false,
    };
  },
  methods: {
    toggleSplit() {
      this.isSplit = !this.isSplit;
    },
  },
};
</script>

<style lang="scss" scoped>
.slide {
  display: grid;
  grid-template-rows: [split-start] min-content [split-end
                      title-start] min-content [title-end
                      slide-start] 1fr [slide-end];
  grid-template-columns: [left-start] 1fr [left-end
                         right-start] 1fr [right-end];
  padding: 0;
  height: 92vh;
  background-color: var(--light-primary-color);
  color: var(--text-dark);
  overflow: auto;

  &__title {
    grid-row: title-start / title-end;
    grid-column: left-start / right-end;
    padding: 1rem 2rem;
    color: currentColor;
    font-size: 3.6rem;
    text-align: left;

    &--split {
      grid-column: right-start / right-end;
    }
  }

  &__content {
    grid-row: slide-start / slide-end;
    grid-column: left-start / right-end;
    padding: 1rem 4rem;
    min-height: 82vh;
    color: currentColor;
    font-size: 2.6rem;
    text-align: left;
    overflow: auto;
    scroll-behavior: smooth;

    &--split {
      grid-column: right-start / right-end;
    }
  }
}

.split-button {
  grid-row: split-start / split-end;
  grid-column: left-start / right-end;
}

.screenshare {
  grid-template-rows: [split-start] min-content [split-end
                      screen-start] 1fr [screen-end
                      title-start] min-content [title-end
                      slide-start] 1fr [slide-end];

  &__split {
    grid-template-rows: [split-start] min-content [split-end
                        title-start] min-content [title-end
                        slide-start] 1fr [slide-end];
  }

  &__screen {
    grid-row: screen-start / screen-end;
    grid-column: left-start / right-end;

    &--split {
      grid-row: title-start / slide-end;
      grid-column: left-start / left-end;
    }
  }
}
</style>
