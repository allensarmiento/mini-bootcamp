<template>
  <p>
    {{ value.text }}
  </p>
</template>

<script>
export default {
  name: 'TextContent',
  props: {
    value: { type: Object, default: () => ({}) },
  },
};
</script>
