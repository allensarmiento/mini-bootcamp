<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client';

export default {
  name: 'VonagePublisher',
  props: {
    session: { type: OT.session },
    options: { type: Object, default: () => ({}) },
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
  },
  data() {
    return {
      publisher: null,
    };
  },
  watch: {
    videoOn(value) {
      this.publisher.publishVideo(value);
    },
    audioOn(value) {
      this.publisher.publishAudio(value);
    },
  },
  mounted() {
    this.publisher = this.createPublisher();
    this.$emit('publisherCreated', this.publisher);

    if (this.session && this.session.isConnected()) this.publish();

    if (this.session) this.session.on('sessionConnected', this.publish);
  },
  methods: {
    createPublisher() {
      const publisher = OT.initPublisher(this.$el, this.options, (error) => {
        if (error) this.$emit('error', error);
        else this.$emit('publisherCompleted');
      });

      return publisher;
    },
    publish() {
      this.session.publish(this.publisher, (error) => {
        if (error) this.$emit('error', error);
        else this.$emit('publisherConnected', this.publisher);
      });
    },
  },
};
</script>
