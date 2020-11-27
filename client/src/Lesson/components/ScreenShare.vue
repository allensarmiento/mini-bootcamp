<template>
  <section class="screen-share">
    <div class="remote-screen-streams"></div>

    <section class="screen-share__controls">
      <ControlsButton v-if="!screenShareActive" @click="createScreenStream">
        Share Screen
      </ControlsButton>
      <ControlsButton v-else @click="stopScreenShare">
        Stop Share Screen
      </ControlsButton>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk';
import ControlsButton from './ControlsButton.vue';
import { fetchAccessToken } from '../data/video';
import { getUser } from '../../utilities/firebaseRTD';

export default {
  name: 'ScreenShare',
  components: { ControlsButton },
  data() {
    return {
      screenClient: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
      screenVideoProfile: '720p_2',

      appId: process.env.VUE_APP_AGORA_APP_ID,
      channel: process.env.VUE_APP_SCREEN_CHANNEL,
      token: '',
      uid: '',

      localStreams: {
        screen: { id: '', stream: {} },
      },

      remoteStreams: {},

      screenShareActive: false,
    };
  },
  computed: {
    ...mapState(['userProfile']),
    noCurrentStreams() {
      console.log(`Current streams: ${Object.keys(this.remoteStreams).length}`);
      return Object.keys(this.remoteStreams).length === 0;
    },
  },
  async mounted() {
    console.log('MOUNTED');
    this.token = await fetchAccessToken(this.channel, 'publisher', 3600 * 4);

    // LOCAL
    this.screenClient.on('stream-published', () => {
      console.log('Local screen stream published successfully!');
    });

    this.screenClient.on('stream-unpublished', () => {
      console.log('Local stream unpublished');

      this.localStreams.screen.id = '';
      this.localStreams.screen.stream = {};

      this.screenShareActive = false;
    });

    // REMOTE
    this.screenClient.on('stream-added', (event) => {
      const { stream } = event;
      const streamId = stream.getId();

      if (!this.isLocalStream(streamId)) {
        console.log(`Subscribing to remote screen stream: ${streamId}`);

        this.screenClient.subscribe(stream, (error) => {
          console.log(`[ERROR] Subscribe stream failed: ${error}`);
        });

        stream.on('stopScreenSharing', () => {
          console.log('STOPPING SCREEN SHARING');

          if (this.isLocalStream(streamId)) {
            this.screenClient.unpublish(stream, (error) => {
              console.log(`[ERROR] Unpublish screen stream failed: ${error}`);
            });
          }
        });
      }
    });

    this.screenClient.on('stream-removed', (event) => {
      const { stream } = event;
      const streamId = stream.getId();

      if (!this.isLocalStream(streamId)) {
        console.log(`Unsubscribing to remote screen stream: ${streamId}`);

        delete this.remoteStreams[streamId];

        const elemToRemove = document
          .getElementById(`remote-screen-stream-${streamId}`);
        elemToRemove.parentNode.removeChild(elemToRemove);
      } else {
        console.log('LOCAL STREAM REMOVED!!!');

        this.screenClient.unsubscribe(stream, (error) => {
          console.log(`[ERROR] Unsubscribe stream failed: ${error}`);
        });
      }
    });

    this.screenClient.on('stream-subscribed', async (event) => {
      const remoteStream = event.stream;
      const remoteId = remoteStream.getId();

      this.remoteStreams[remoteId] = remoteStream;
      console.log(`Subscribed to remote stream successfully: ${remoteId}`);

      const userProfile = await getUser(remoteId);

      document.querySelector('.remote-screen-streams')
        .insertAdjacentHTML('beforeend', `
          <div
            id="remote-screen-stream-${remoteId}"
            class="remote-screen-stream"
          >
            <span class="remote-screen-stream__user>
              ${userProfile.name || 'Anonymous User'}
            </span>
          </div>
        `);

      remoteStream.play(`remote-screen-stream-${remoteId}`, {
        fit: 'contain',
      });
    });

    this.screenClient.on('peer-leave', (event) => {
      const { uid, reason } = event;
      console.log(`Remote user left ${uid} with reason ${reason}`);
    });

    this.initClientAndJoinChannel();
  },
  beforeDestroy() {
    console.log('BEFORE UNMOUNTING');

    if (this.localStreams.screen.id && this.localStreams.screen.stream) {
      this.stopScreenShare();
    }

    this.screenClient.leave(() => {
      console.log('Client leaving the channel');
    }, (error) => {
      console.log(`[ERROR] Client leave failed: ${error}`);
    });
  },
  methods: {
    isLocalStream(streamId) {
      return streamId === this.localStreams.screen.id;
    },
    initClientAndJoinChannel() {
      this.screenClient.init(this.appId, () => {
        console.log('AgoraRTC screen client initialized');
        this.joinChannel();
      }, (error) => {
        console.log(`[ERROR] AgoraRTC screen client init failed: ${error}`);
      });
    },
    joinChannel() {
      const userId = this.userProfile.uid || null;

      this.screenClient.join(this.token, this.channel, userId, (uid) => {
        console.log(`User ${uid} joined ${this.channel} successfully`);
        this.uid = uid;
      }, (error) => {
        console.log(`[ERROR] Join channel failed: ${error}`);
      });
    },
    createScreenStream() {
      if (this.uid) {
        let localStream;
        const sUsrAg = navigator.userAgent;
        if (sUsrAg.indexOf('Firefox') > -1) {
          console.log('User using Firefox');
          localStream = AgoraRTC.createStream({
            streamID: this.uid,
            audio: false,
            video: false,
            screen: true,
            screenAudio: false,
            mediaSource: 'screen',
          });
        } else if (sUsrAg.indexOf('Chrome')) {
          console.log('User using Chrome');
          localStream = AgoraRTC.createStream({
            streamID: this.uid,
            audio: false,
            video: false,
            screen: true,
            screenAudio: false,
          });
        }

        localStream.setScreenProfile(this.screenVideoProfile);

        localStream.init(() => {
          console.log('getScreen successful!');

          this.screenClient.publish(localStream, (error) => {
            console.log(`[ERROR] Publish screen stream error: ${error}`);
          });

          this.localStreams.screen.id = localStream.getId();
          this.localStreams.screen.stream = localStream;

          this.screenShareActive = true;

          this.localStreams.screen.stream
            .getVideoTrack()
            .onended = () => {
              this.screenClient
                .unpublish(this.localStreams.screen.stream, (error) => {
                  console.log(`[ERROR] Unpublish stream failed: ${error}`);
                });

              this.localStreams.screen.id = '';
              this.localStreams.screen.stream = {};
              this.screenShareActive = false;
            };
        }, (error) => {
          console.log(`[ERROR] getScreen failed: ${error}`);

          this.localStreams.screen.id = '';
          this.localStreams.screen.stream = {};
          this.screenShareActive = false;
        });
      }
    },
    stopScreenShare() {
      // this.localStreams.screen.stream.getVideoTrack().stop();
      this.localStreams.screen.stream.stop();
      this.localStreams.screen.stream.close();

      this.screenClient.unpublish(this.localStreams.screen.stream, (error) => {
        console.log(`[ERROR] Unpublish stream failed: ${error}`);
      });

      this.screenShareActive = false;
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
