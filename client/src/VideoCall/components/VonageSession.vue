<template>
  <div id="session" @error="errorHandler">
    <VonagePublisher
      :session="session"
      :videoOn="videoOn"
      :audioOn="audioOn"
      @error="errorHandler"
    />

    <VonageSubscriber
      v-for="stream in streams"
      :key="stream.streamId"
      :session="session"
      :stream="stream"
      @error="errorHandler"
    />
  </div>
</template>

<script>
import OT from '@opentok/client';
import VonagePublisher from './VonagePublisher.vue';
import VonageSubscriber from './VonageSubscriber.vue';

export default {
  name: 'VonageSession',
  components: { VonagePublisher, VonageSubscriber },
  props: {
    apiKey: { type: String, default: '' },
    sessionId: { type: String, default: '' },
    token: { type: String, default: '' },
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
  },
  data() {
    return {
      session: null,
      streams: [],
    };
  },
  created() {
    this.session = OT.initSession(this.apiKey, this.sessionId);

    this.session.connect(this.token, (error) => {
      if (error) this.errorHandler(error);
    });

    this.session.on('streamCreated', (event) => {
      this.streams.push(event.stream);
    });

    this.session.on('streamDestroyed', (event) => {
      const streamIdx = this.streams.indexOf(event.stream);
      if (streamIdx > -1) {
        this.streams.splice(streamIdx, 1);
      }
    });
  },
  methods: {
    errorHandler(error) {
      console.log(error);
    },
  },
};
</script>
