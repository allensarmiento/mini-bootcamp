<template>
  <div class="content">
    <p
      v-for="(item, index) in items"
      :key="index"
      :class="itemClass(item.type)"
    >
      {{ item.text }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    items: { type: Array, default: () => ([]) },
  },
  methods: {
    itemClass(type) {
      let className = 'sidebar__content';

      if (type === 'question') className += '--question';
      else className += '--answer';

      return className;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  text-align: left;
  overflow: auto;

  &--answer {
    color: var(--text-secondary);
    margin-left: 1rem;
  }
}
</style>
