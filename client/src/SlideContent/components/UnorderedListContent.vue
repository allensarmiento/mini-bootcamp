<template>
  <ul class="list">
    <li v-for="(item, index) in value.unorderedList" :key="index">
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'UnorderedListContent',
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
