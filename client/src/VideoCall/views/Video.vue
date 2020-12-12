<template>
  <section class="video">
    <AgoraVideo
      v-if="useAgora"
      :videoOn="videoOn"
      :audioOn="audioOn"
      :leave="leave"
      @videoInitialized="isVideoInitialized"
    />
    <VonageVideo
      v-else-if="useVonage"
    />

    <UserControls
      v-if="videoInitialized"
      :videoOn="videoOn"
      :audioOn="audioOn"
      @toggleVideo="toggleVideo"
      @toggleAudio="toggleAudio"
      @leave="leaveClicked"
      @toggleScreenShare="screenShareClicked"
      @slideBackward="slideBackward"
      @toggleSidebar="toggleSidebar"
      @slideForward="slideForward"
      column
    />
  </section>
</template>

<script>
import AgoraVideo from '../components/AgoraVideo.vue';
import VonageVideo from '../components/VonageVideo.vue';
import UserControls from '../../UserControls/views/Controls.vue';
import { VIDEO_PROVIDER } from '../../constants/constants';

export default {
  name: 'VideoCall',
  components: {
    AgoraVideo,
    VonageVideo,
    UserControls,
  },
  data() {
    return {
      videoInitialized: false,
      videoOn: true,
      audioOn: true,
      leave: false,
    };
  },
  computed: {
    useAgora() {
      return VIDEO_PROVIDER === 'agora';
    },
    useVonage() {
      return VIDEO_PROVIDER === 'vonage';
    },
  },
  methods: {
    isVideoInitialized() {
      this.videoInitialized = true;
    },
    toggleVideo() {
      this.videoOn = !this.videoOn;
    },
    toggleAudio() {
      this.audioOn = !this.audioOn;
    },
    leaveClicked() {
      this.leave = true;
    },
    screenShareClicked() {
      this.$emit('screenShareClicked');
    },
    slideBackward() {
      this.$emit('slideBackward');
    },
    toggleSidebar() {
      this.$emit('toggleSidebar');
    },
    slideForward() {
      this.$emit('slideForward');
    },
  },
};
</script>

<style lang="scss" scoped>
.video {
  display: flex;
  flex-direction: column;
}
</style>
