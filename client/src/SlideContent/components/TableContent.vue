<template>
  <BTable :items="value" striped />
</template>

<script>
import { BTable } from 'bootstrap-vue';

export default {
  name: 'TableContent',
  components: { BTable },
  props: {
    value: { type: Array, default: () => ([]) },
  },
};
</script>
