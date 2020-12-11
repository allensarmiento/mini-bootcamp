<template>
  <p>
    {{ value.text }}
  </p>
</template>

<script>
export default {
  name: 'QuestionContent',
  props: {
    value: { type: Object, default: () => ({}) },
  },
};
</script>
