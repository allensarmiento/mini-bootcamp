<template>
  <div class="table-input">
    <BInputGroup
      v-for="(column, index) in columns"
      :prepend="`Column ${index}`"
      :key="index"
    >
      <BFormInput v-model="columns[index]" />
    </BInputGroup>
    <BButton variant="success" @click="addColumn">Add Column</BButton>

    <div v-for="(row, rowIdx) in rows" :key="`row-${rowIdx}`">
      <h5>Row {{ rowIdx }}</h5>
      <BInputGroup
        v-for="(column, colIdx) in columns"
        :prepend="`Row ${rowIdx} Col ${colIdx}`"
        :key="`col-${colIdx}`"
      >
        <BFormInput v-model="rows[rowIdx][colIdx]" />
      </BInputGroup>
    </div>
    <BButton variant="success" @click="addRow">Add Row</BButton>
  </div>
</template>

<script>
import {
  BInputGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue';

export default {
  name: 'TableInput',
  components: {
    BInputGroup,
    BFormInput,
    BButton,
  },
  props: {
    prepend: { type: String, default: 'Table' },
    input: { type: String, default: '' },
  },
  data() {
    return {
      value: this.input,

      columns: [],
      rows: [],
    };
  },
  methods: {
    addColumn() {
      this.columns.push('New Column');
    },
    addRow() {
      this.rows.push([]);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-input {
  margin: 2rem 0;
}
</style>
