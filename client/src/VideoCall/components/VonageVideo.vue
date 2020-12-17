<template>
  <VonageSession
    v-if="hasCredentials"
    :apiKey="apiKey"
    :sessionId="sessionId"
    :token="token"
    :videoOn="videoOn"
    :audioOn="audioOn"
  />
</template>

<script>
import axios from 'axios';
import VonageSession from './VonageSession.vue';
import { ENDPOINT } from '../../constants/constants';

export default {
  name: 'VonageVideo',
  components: { VonageSession },
  props: {
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
  },
  data() {
    return {
      apiKey: '',
      sessionId: '',
      token: '',
    };
  },
  computed: {
    hasCredentials() {
      return this.apiKey && this.sessionId && this.token;
    },
  },
  async mounted() {
    await axios
      .post(`${ENDPOINT}vonage/sessionInfo`, { room: 'video' })
      .then((response) => response.data)
      .then((data) => {
        this.apiKey = data.apiKey;
        this.sessionId = data.sessionId;
        this.token = data.token;
      });
  },
};
</script>

<style lang="scss" scoped>

</style>
