<template>
  <section class="agora-video">
    <div id="local-video"></div>

    <div class="remote-streams"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { fetchAgoraAccessToken } from '../../data/firebase/video';
import { getUserProfile } from '../../data/firebase/user';
import { AGORA_CONFIG } from '../../constants/constants';

export default {
  name: 'AgoraVideo',
  props: {
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
    leave: { type: Boolean, default: false },
  },
  data() {
    return {
      rtc: {
        client: null,
        localAudioTrack: null,
        localVideoTrack: null,
      },
      cameraVideoProfile: '240p_1',

      appId: AGORA_CONFIG.appId,
      channel: AGORA_CONFIG.videoChannel,
      token: '',
      uid: '',
    };
  },
  watch: {
    videoOn(value) {
      if (this.rtc.client && this.rtc.localVideoTrack) {
        this.rtc.localVideoTrack.setEnabled(value);
      }
    },
    audioOn(value) {
      if (this.rtc.client && this.rtc.localAudioTrack) {
        this.rtc.localAudioTrack.setEnabled(value);
      }
    },
    async leave(value) {
      if (value) {
        await this.leaveCall();
        this.$router.push('/');
      }
    },
  },
  computed: {
    ...mapState(['userProfile']),
  },
  async mounted() {
    this.token = await fetchAgoraAccessToken(
      this.channel,
      'publisher',
      3600 * 4,
    );

    await this.createClient();
    await this.joinChannel();
    this.$emit('videoInitialized');
  },
  async beforeDestroy() {
    await this.leaveCall();
  },
  methods: {
    async createClient() {
      this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });

      this.rtc.client.on('user-joined', async (user) => {
        const userProfile = await getUserProfile(user.uid.toString());
        const elementId = `remote-stream-${user.uid.toString()}`;
        const name = userProfile.name || 'Anonymous User';

        document.querySelector('.remote-streams')
          .insertAdjacentHTML('beforeend', `
            <div id="${elementId}" class="remote-stream">
              <span>${name}</span>
            </div>
          `);
      });

      this.rtc.client.on('user-published', async (user, mediaType) => {
        await this.rtc.client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const elementId = `remote-stream-${user.uid.toString()}`;
          remoteVideoTrack.play(elementId);
        }

        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });

      // this.rtc.client.on('user-unpublished', (user, mediaType) => {});

      // this.rtc.client.on('user-left', (user, reason) => {
      this.rtc.client.on('user-left', (user) => {
        const elementId = `remote-stream-${user.uid.toString()}`;
        const playerContainer = document.getElementById(elementId);

        if (playerContainer) playerContainer.remove();
        else console.error('Tried removing an unavailable player container.');
      });
    },
    async joinChannel() {
      const userId = this.userProfile.uid || null;

      try {
        const uid = await this.rtc.client
          .join(this.appId, this.channel, this.token, userId);

        this.uid = uid;
        await this.createTracks();
      } catch (error) {
        console.error(`Join channel failed ${error}`);
      }
    },
    async createTracks() {
      if (this.uid) {
        this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: this.cameraVideoProfile,
          optimizationMode: 'motion',
        });

        await this.rtc.client
          .publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);

        const elementId = `local-stream-${this.uid}`;
        const name = this.userProfile.name || 'Anonymous User';

        document.getElementById('local-video')
          .insertAdjacentHTML('beforeend', `
            <div id="${elementId}" class="local-stream">
              <span>${name}</span>
            </div>
          `);

        this.rtc.localVideoTrack.play(elementId);
      }
    },
    async leaveCall() {
      try {
        this.rtc.localAudioTrack.close();
        this.rtc.localVideoTrack.close();

        await this.rtc.client
          .unpublish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      } catch (error) {
        console.error(`Error closing tracks ${error}`);
      }

      this.rtc.client.remoteUsers.forEach((user) => {
        const elementId = `remote-stream-${user.uid.toString()}`;
        const playerContainer = document.getElementById(elementId);

        if (playerContainer) playerContainer.remove();
        else console.error('Tried removing an unavailable player container.');
      });

      await this.rtc.client.leave();
    },
  },
};
</script>

<style lang="scss">
#local-video {
  max-width: 100%;

  .local-stream {
    height: inherit;
    max-width: 100%;

    video {
      position: initial !important;
      width: 100% !important;
    }
  }
}

.remote-streams {
  max-width: 100%;
  background-color: var(--text-dark);

  .remote-stream {
    height: inherit;
    min-height: 22rem;
    max-width: 100%;

    video {
      position: initial !important;
      min-height: inherit !important;
      width: 100% !important;
    }
  }
}
</style>
