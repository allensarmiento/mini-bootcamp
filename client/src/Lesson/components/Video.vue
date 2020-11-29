<template>
  <section class="video">
    <div id="local-video"></div>

    <div class="remote-streams"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { fetchAccessToken } from '../data/video';
import { getUser } from '../../utilities/firebaseRTD';

export default {
  name: 'Video',
  props: {
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
    leave: { type: Boolean, default: false },
  },
  computed: {
    ...mapState(['userProfile']),
  },
  watch: {
    videoOn(val) {
      console.log(`Video enabled: ${val}`);
      if (this.rtc.client && this.rtc.localVideoTrack) {
        this.rtc.localVideoTrack.setEnabled(val);
      }
    },
    audioOn(val) {
      if (this.rtc.client && this.rtc.localAudioTrack) {
        this.rtc.localAudioTrack.setEnabled(val);
      }
    },
    async leave(val) {
      if (val) {
        await this.leaveCall();
        this.$router.push('/');
      }
    },
  },
  data() {
    return {
      rtc: {
        client: null,
        localAudioTrack: null,
        localVideoTrack: null,
      },
      cameraVideoProfile: '240p_1',

      appId: process.env.VUE_APP_AGORA_APP_ID,
      channel: process.env.VUE_APP_VIDEO_CHANNEL,
      token: '',
      uid: '',
    };
  },
  async mounted() {
    console.log('MOUNTED');
    this.token = await fetchAccessToken(this.channel, 'publisher', 3600 * 4);
    await this.createClient();
    await this.joinChannel();
  },
  async beforeDestroy() {
    await this.leaveCall();
  },
  methods: {
    async createClient() {
      this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });

      // When user joins
      this.rtc.client.on('user-joined', async (user) => {
        const userProfile = await getUser(user.uid.toString());

        document.querySelector('.remote-streams')
          .insertAdjacentHTML('beforeend', `
            <div
              id="remote-stream-${user.uid.toString()}"
              class="remote-stream"
            >
              <span>${userProfile.name || 'Anonymous User'}</span>
            </div>
          `);
      });

      // When user publishes
      this.rtc.client.on('user-published', async (user, mediaType) => {
        await this.rtc.client.subscribe(user, mediaType);
        console.log('subscribe success');

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          remoteVideoTrack.play(`remote-stream-${user.uid.toString()}`);
        }

        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });

      // When user unpublishes something
      this.rtc.client.on('user-unpublished', (user, mediaType) => {
        console.log(`Removing user ${user.uid} media ${mediaType}`);
      });

      // When user leaves
      this.rtc.client.on('user-left', (user, reason) => {
        console.log(`User ${user.uid} left with reason ${reason}`);

        const playerContainer = document
          .getElementById(`remote-stream-${user.uid.toString()}`);
        if (playerContainer) {
          console.log('removing player container');
          playerContainer.remove();
        } else {
          console.log('not removing player container');
        }
      });
    },
    async joinChannel() {
      const userId = this.userProfile.uid || null;
      try {
        const uid = await this.rtc.client
          .join(this.appId, this.channel, this.token, userId);

        console.log(`User ${uid} joined ${this.channel} successfully`);
        this.uid = uid;
        await this.createTracks();
      } catch (error) {
        console.log(`[ERROR] Join Channel failed: ${error}`);
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

        document.getElementById('local-video')
          .insertAdjacentHTML('beforeend', `
            <div
              id="local-stream-${this.uid}"
              class="local-stream"
            >
              <span>${this.userProfile.name || 'Anonymous User'}</span>
            </div>
          `);

        this.rtc.localVideoTrack.play(`local-stream-${this.uid}`);
      }
    },
    async leaveCall() {
      try {
        this.rtc.localAudioTrack.close();
        this.rtc.localVideoTrack.close();
        await this.rtc.client
          .unpublish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      } catch (error) {
        console.log(`[ERROR] Closing tracks: ${error}`);
      }

      this.rtc.client.remoteUsers.forEach((user) => {
        const playerContainer = document
          .getElementById(`remote-stream-${user.uid.toString()}`);
        if (playerContainer) {
          console.log('player container removed');
          playerContainer.remove();
        } else {
          console.log('no player container');
        }
      });

      await this.rtc.client.leave();
    },
  },
};
</script>

<style lang="scss">
.remote-streams {
  background: var(--primary-text);
  max-width: 100%;

  .remote-stream {
    height: inherit;
    max-width: 100%;
    min-height: 22rem;

    video {
      position: initial !important;
      width: 100% !important;
      min-height: inherit !important;
    }
  }
}

#local-video {
  // height: 100%;
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
</style>
