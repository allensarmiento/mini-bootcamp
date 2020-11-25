<template>
  <!-- NOTE: add right below to put sidebar to right -->
  <BSidebar
    v-model="show"
    id="sidebar-right"
    class="sidebar"
    :title="title"
    no-header
    shadow
  >
    <div class="sidebar__container px-3 py-4">
      <h4 class="sidebar__title">{{ title }}</h4>

      <!-- Content -->
      <div class="sidebar__content">
        <p
          v-for="(item, index) in items"
          :key="index"
          :class="itemTypeClass(item.type)"
        >
          {{ item.text }}
        </p>
      </div>

      <!-- Input Container -->
      <div class="input-container">
        <!-- Input -->
        <BFormTextarea
          v-model="answerInput"
          id="textarea"
          class="input-container__input"
          placeholder="Enter something..."
          rows="5"
          max-rows="6"
        >
        </BFormTextarea>

        <!-- Submit -->
        <BButton
          class="input-container__submit"
          @click="submitAnswer"
        >
          Submit
        </BButton>
      </div>
    </div>
  </BSidebar>
</template>

<script>
import {
  BSidebar,
  BFormTextarea,
  BButton,
} from 'bootstrap-vue';

export default {
  name: 'Sidebar',
  components: {
    BSidebar,
    BFormTextarea,
    BButton,
  },
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
    items: { type: Array, default: () => ([]) },
  },
  data() {
    return {
      answerInput: '',
    };
  },
  methods: {
    itemTypeClass(type) {
      let className = '';

      if (type === 'question') {
        className = 'sidebar__content--question';
      } else {
        className = 'sidebar__content--answer';
      }

      return className;
    },
    submitAnswer() {
      // TODO: Test this works
      this.$emit('submitAnswer', this.answerInput);
      this.answerInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  font-size: 2rem;

  &__container {
    display: grid;
    grid-template-rows: [title-start] min-content [title-end
                        content-start] 1fr [content-end
                        input-start] min-content [input-end];
    height: 100%;
  }

  &__title {
    grid-row: title-start / title-end;
    text-align: right;
  }

  &__content {
    grid-row: content-start / content-end;

    text-align: left;
    overflow: auto;

    &--answer {
      color: var(--secondary-text);
      margin-left: 1rem;
    }
  }
}

.input-container {
  grid-row: input-start / input-end;

  display: flex;
  flex-direction: column;

  &__input {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  &__submit {
    margin-bottom: 1rem;
    border: 1px solid var(--primary-color);
    background-color: var(--dark-primary-color);
    color: var(--text);
    font-size: 1.4rem;

    &:hover {
      background-color: var(--accent-color);
    }
  }
}
</style>
