<template>
  <section class="screen-share">
    <div class="remote-screen-streams"></div>

    <div class="screen-share__controls">
      <ControlsButton v-if="!screenShareActive" @click="createTracks">
        <font-awesome-icon icon="chalkboard" />
      </ControlsButton>
      <ControlsButton v-else variant="primary" @click="stopScreenShare">
        <font-awesome-icon icon="chalkboard" />
      </ControlsButton>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk-ng';
import ControlsButton from '../../UserControls/components/ControlsButton.vue';
import { fetchAgoraAccessToken } from '../../data/firebase/video';
import { getUserProfile } from '../../data/firebase/user';
import { AGORA_CONFIG } from '../../constants/constants';

export default {
  name: 'AgoraScreenShare',
  components: { ControlsButton },
  data() {
    return {
      rtc: {
        client: null,
        localScreenTrack: null,
      },
      screenVideoProfile: '720p_2',

      appId: AGORA_CONFIG.appId,
      channel: AGORA_CONFIG.screenChannel,
      token: '',
      uid: '',

      screenShareActive: false,
    };
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
  },
  async beforeDestroy() {
    await this.leaveCall();
  },
  methods: {
    async createClient() {
      this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });

      this.rtc.client.on('user-published', async (user, mediaType) => {
        await this.rtc.client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const userProfile = await getUserProfile(user.uid.toString());
          const elementId = `remote-screen-stream-${user.uid.toString()}`;
          const name = userProfile.name || 'Anonymous User';

          document.querySelector('.remote-screen-streams')
            .insertAdjacentHTML('beforeend', `
              <div id="${elementId}" class="remote-screen-stream">
                <span class="remote-screen-stream__user">
                  ${name}
                </span>
              </div>
            `);

          remoteVideoTrack.play(elementId, { fit: 'contain' });
        }
      });

      this.rtc.client.on('user-unpublished', (user) => {
        const elementId = `remote-screen-stream-${user.uid.toString()}`;
        const playerContainer = document.getElementById(elementId);

        if (playerContainer) playerContainer.remove();
      });
    },
    async joinChannel() {
      const userId = this.userProfile.uid || null;

      try {
        const uid = await this.rtc.client
          .join(this.appId, this.channel, this.token, userId);

        this.uid = uid;
      } catch (error) {
        console.error(`Error joining channel ${error}`);
      }
    },
    async createTracks() {
      console.log('Create tracks clicked');
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
        console.error(`Error stopping screen share ${error}`);
      }
    },
    async leaveCall() {
      this.stopScreenShare();

      this.rtc.client.remoteUsers.forEach((user) => {
        const elementId = `remote-screen-stream-${user.uid.toString()}`;
        const playerContainer = document.getElementById(elementId);

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
  min-height: 50vh;
  height: 100%;
  max-width: 100%;
  background: var(--text-dark);
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
</style>
