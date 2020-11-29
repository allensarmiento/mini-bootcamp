<template>
  <section class="screen-share">
    <div class="remote-screen-streams"></div>

    <section class="screen-share__controls">
      <ControlsButton v-if="!screenShareActive" @click="createTracks">
        <font-awesome-icon icon="chalkboard" />
      </ControlsButton>
      <ControlsButton v-else variant="primary" @click="stopScreenShare">
        <font-awesome-icon icon="chalkboard" />
      </ControlsButton>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk-ng';
import ControlsButton from './ControlsButton.vue';
import { fetchAccessToken } from '../data/video';
import { getUser } from '../../utilities/firebaseRTD';

export default {
  name: 'ScreenShare',
  components: { ControlsButton },
  data() {
    return {
      rtc: {
        client: null,
        localScreenTrack: null,
      },
      screenVideoProfile: '720p_2',

      appId: process.env.VUE_APP_AGORA_APP_ID,
      channel: process.env.VUE_APP_SCREEN_CHANNEL,
      token: '',
      uid: '',

      screenShareActive: false,
    };
  },
  computed: {
    ...mapState(['userProfile']),
  },
  async mounted() {
    console.log('MOUNTED');
    this.token = await fetchAccessToken(this.channel, 'publisher', 3600 * 4);
    await this.createClient();
    await this.joinChannel();
  },
  async beforeDestroy() {
    this.leaveCall();
  },
  methods: {
    async createClient() {
      this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });

      // When user publishes
      this.rtc.client.on('user-published', async (user, mediaType) => {
        await this.rtc.client.subscribe(user, mediaType);
        console.log('subsribe success');

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const userProfile = await getUser(user.uid.toString());

          document.querySelector('.remote-screen-streams')
            .insertAdjacentHTML('beforeend', `
              <div
                id="remote-screen-stream-${user.uid.toString()}"
                class="remote-screen-stream"
              >
                <span class="remote-screen-stream__user>
                  ${userProfile.name || 'Anonymous User'}
                </span>
              </div>
            `);

          remoteVideoTrack.play(`remote-screen-stream-${user.uid.toString()}`, {
            fit: 'contain',
          });
        }

        // if (mediaType === 'audio') {
        //   const remoteAudioTrack = user.audioTrack;
        //   remoteAudioTrack.play();
        // }
      });

      // When user unpublishes
      this.rtc.client.on('user-unpublished', (user) => {
        const playerContainer = document
          .getElementById(`remote-screen-stream-${user.uid.toString()}`);
        if (playerContainer) playerContainer.remove();
      });
    },
    async joinChannel() {
      const userId = this.userProfile.uid || null;
      try {
        const uid = await this.rtc.client
          .join(this.appId, this.channel, this.token, userId);

        console.log(`User ${uid} joined ${this.channel} successfully`);
        this.uid = uid;
      } catch (error) {
        console.log(`[ERROR] Join Channel failed: ${error}`);
      }
    },
    async createTracks() {
      if (this.uid) {
        this.rtc.localScreenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: this.screenVideoProfile,
        });

        await this.rtc.client.publish(this.rtc.localScreenTrack);
        this.screenShareActive = true;
      }
    },
    async stopScreenShare() {
      try {
        this.rtc.localScreenTrack.close();
        await this.rtc.client.unpublish(this.rtc.localScreenTrack);
        this.screenShareActive = false;
      } catch (error) {
        console.log(`[ERROR] Stopping screen share: ${error}`);
      }
    },
    async leaveCall() {
      this.stopScreenShare();
      this.rtc.client.remoteUsers.forEach((user) => {
        const playerContainer = document
          .getElementById(`remote-screen-stream-${user.uid.toString()}`);
        if (playerContainer) playerContainer.remove();
      });
      await this.rtc.client.leave();
    },
  },
};
</script>

<style lang="scss">
.screen-share {
  position: relative;

  &__controls {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.remote-screen-streams {
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);

  height: 82vh;
  // height: 100%;
  max-width: 100%;

  background: var(--primary-text);
  overflow: auto;

  .remote-screen-stream {
    flex: 1;
    width: 100%;

    &__user {
      color: white;
    }

    video {
      position: initial !important;
      width: 100% !important;
    }
  }
}

#local-screenshare {
  height: 20vh;
  max-width: 100%;

  video {
    position: initial !important;
    width: 100% !important;
  }
}
</style>
