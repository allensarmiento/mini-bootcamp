<template>
  <a :href="href" target="_blank">
    {{ value.link }}
  </a>
</template>

<script>
export default {
  name: 'LinkContent',
  props: {
    href: { type: String, default: '#' },
    value: { type: Object, default: () => ({}) },
  },
};
</script>
