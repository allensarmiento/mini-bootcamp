<template>
  <div>
    <div class="table-input">
      <BContainer class="table" :style="`width: ${16 * columns.length}rem`" fluid>
        <BRow class="table__header">
          <BCol class="table__label">Header</BCol>
          <BCol
            v-for="(column, index) in columns"
            :key="index"
            class="table__header__item"
          >
            <BFormInput v-model="columns[index]" />
          </BCol>
        </BRow>

        <BRow
          v-for="(row, rowIdx) in rows"
          :key="`row-${rowIdx}`"
          class="table__data"
        >
          <BCol class="table__label">Row {{ rowIdx }}</BCol>
          <BCol
            v-for="(col, colIdx) in columns"
            :key="`col-${colIdx}`"
            class="table__data__item"
          >
            <BFormInput v-model="rows[rowIdx][colIdx]" />
          </BCol>
        </BRow>
      </BContainer>
    </div>

    <div class="table__buttons">
      <BButton variant="success" @click="addColumn">Add Column</BButton>
      <BButton variant="warning" @click="removeColumn">Remove Column</BButton>

      <BButton variant="success" @click="addRow">Add Row</BButton>
      <BButton variant="warning" @click="removeRow">Remove Row</BButton>
    </div>
  </div>
</template>

<script>
import {
  // BInputGroup,
  BFormInput,
  BButton,
  BContainer,
  BRow,
  BCol,
} from 'bootstrap-vue';

export default {
  name: 'TableInput',
  components: {
    // BInputGroup,
    BFormInput,
    BButton,
    BContainer,
    BRow,
    BCol,
  },
  props: {
    prepend: { type: String, default: 'Table' },
    input: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      data: { ...this.input },

      columns: [],
      rows: [],
    };
  },
  mounted() {
    console.log(this.data);
    this.columns = this.getColumnHeaders();
    this.rows = this.getRows();
  },
  methods: {
    getColumnHeaders() {
      const headers = [];
      if ('table' in this.data) {
        Object.keys(this.data.table[0]).forEach((header) => {
          headers.push(header);
        });
      }
      return headers;
    },
    getRows() {
      const rows = [];
      if ('table' in this.data) {
        this.data.table.forEach((table) => {
          const newRow = [];
          this.columns.forEach((column) => {
            newRow.push(table[column]);
          });
          rows.push(newRow);
        });
      }
      return rows;
    },
    addColumn() {
      this.columns.push('');
    },
    removeColumn() {
      if (this.columns.length) {
        this.columns.pop();
      }
    },
    addRow() {
      this.rows.push([]);
    },
    removeRow() {
      if (this.rows.length) {
        this.rows.pop();
      }
    },
    onChanged() {
      console.log('Changing');
      const table = [];
      this.rows.forEach((row) => {
        const newRow = {};
        this.columns.forEach((column, colIdx) => {
          newRow[column] = row[colIdx];
        });
        table.push(newRow);
      });
      this.data.table = table;
      this.$emit('onChange', this.data.table);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-input {
  margin: 2rem 0;
  overflow: auto;
}

.table {

  &__header {

    &__item {
      padding: 0;
    }
  }

  &__label {
    flex-grow: .25;
  }

  &__data {

    &__item {
      padding: 0;
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>
