<template>
  <section class="video">
    <AgoraVideo v-if="useAgora" />
  </section>
</template>

<script>
import AgoraVideo from '../components/AgoraVideo.vue';
import { VIDEO_PROVIDER } from '../../constants/constants';

export default {
  name: 'Video',
  components: {
    AgoraVideo,
  },
  computed: {
    useAgora() {
      return VIDEO_PROVIDER === 'agora';
    },
    useVonage() {
      return VIDEO_PROVIDER === 'vonage';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
