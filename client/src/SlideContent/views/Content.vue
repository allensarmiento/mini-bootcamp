<template>
  <TextContent v-if="isText" :value="value" />
  <QuestionContent v-else-if="isQuestion" :value="value" />
  <LinkContent v-else-if="isLink" :href="value.link" :value="value" />
  <ImageContent v-else-if="isImage" :value="value" />
  <TableContent v-else-if="isTable" :value="value" />
  <UnorderedListContent v-else-if="isUnorderedList" :value="value" />
  <OrderedListContent v-else-if="isOrderedList" :value="value" />
</template>

<script>
import TextContent from '../components/TextContent.vue';
import QuestionContent from '../components/QuestionContent.vue';
import LinkContent from '../components/LinkContent.vue';
import ImageContent from '../components/ImageContent.vue';
import TableContent from '../components/TableContent.vue';
import UnorderedListContent from '../components/UnorderedListContent.vue';
import OrderedListContent from '../components/OrderedListContent.vue';

export default {
  name: 'SlideContent',
  components: {
    TextContent,
    QuestionContent,
    LinkContent,
    ImageContent,
    TableContent,
    UnorderedListContent,
    OrderedListContent,
  },
  props: {
    type: { type: String, default: 'text' },
    value: { type: [Object, Array], default: () => ({ text: '' }) },
  },
  computed: {
    isText() {
      return this.type === 'text';
    },
    isQuestion() {
      return this.type === 'question';
    },
    isLink() {
      return this.type === 'link';
    },
    isImage() {
      return this.type === 'image';
    },
    isTable() {
      return this.type === 'table';
    },
    isUnorderedList() {
      return this.type === 'unordered-list';
    },
    isOrderedList() {
      return this.type === 'ordered-list';
    },
  },
};
</script>
