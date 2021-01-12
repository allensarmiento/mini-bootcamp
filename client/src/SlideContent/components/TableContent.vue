<template>
  <BTable :items="value.table" striped />
</template>

<script>
import { BTable } from 'bootstrap-vue';

export default {
  name: 'TableContent',
  components: { BTable },
  props: {
    value: { type: Object, default: () => ([]) },
  },
};
</script>
