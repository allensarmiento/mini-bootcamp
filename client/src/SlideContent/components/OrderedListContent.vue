<template>
  <ol class="list">
    <li v-for="(item, index) in value.orderedList" :key="index">
      {{ item }}
    </li>
  </ol>
</template>

<script>
export default {
  name: 'OrderedListContent',
  props: {
    value: { type: Object, default: () => ({}) },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: .8rem 2.4rem;
}
</style>
