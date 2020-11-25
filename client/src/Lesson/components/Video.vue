<template>
  <section class="video">
    <div id="local-video"></div>

    <div class="remote-streams"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AgoraRTC from 'agora-rtc-sdk';
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
      if (
        val
        && this.localStreams.camera.id
        && this.localStreams.camera.stream
      ) {
        // this.publish();
        this.localStreams.camera.stream.unmuteVideo();
      } else {
        // this.unpublish();
        this.localStreams.camera.stream.muteVideo();
      }
    },
    audioOn(val) {
      console.log(`audioOn: ${val}`);
      if (
        val
        && this.localStreams.camera.id
        && this.localStreams.camera.stream
      ) {
        this.localStreams.camera.stream.unmuteAudio();
      } else {
        this.localStreams.camera.stream.muteAudio();
      }
    },
    async leave(val) {
      if (val) {
        if (this.localStreams.camera.id && this.localStreams.camera.stream) {
          console.log('stopping camera');
          await this.stopCamera();

          this.localStreams.camera.id = '';
          this.localStreams.camera.stream = {};
        }

        await this.client.leave(() => {
          console.log('Client leaving the channel');
        }, (error) => {
          console.log(`[ERROR] Client leave failed: ${error}`);
        });

        this.$router.push('/');
      }
    },
  },
  data() {
    return {
      client: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
      cameraVideoProfile: '480p_4',

      appId: process.env.VUE_APP_AGORA_APP_ID,
      channel: process.env.VUE_APP_VIDEO_CHANNEL,
      token: '',
      uid: '',

      localStreams: {
        camera: { id: '', stream: {} },
      },

      remoteStreams: {},
    };
  },
  async mounted() {
    console.log('MOUNTED');
    this.token = await fetchAccessToken(this.channel, 'publisher', 3600 * 4);

    // LOCAL
    this.client.on('stream-published', () => {
      console.log('Local stream published successfully!');
    });

    this.client.on('stream-unpublished', () => {
      console.log('Local stream unpublished');

      // this.localStreams.camera.id = '';
      // this.localStreams.camera.stream = {};
    });

    this.client.on('mute-audio', (event) => {
      const { uid } = event;
      console.log(`Mute audio: ${uid}`);
    });

    this.client.on('unmute-audio', (event) => {
      const { uid } = event;
      console.log(`Unmute audio: ${uid}`);
    });

    // REMOTE
    this.client.on('stream-added', (event) => {
      const { stream } = event;
      const streamId = stream.getId();

      if (!this.isLocalStream(streamId)) {
        console.log(`Subscribing to remote stream: ${streamId}`);

        this.client.subscribe(stream, (error) => {
          console.log(`[ERROR] Subscribe stream failed: ${error}`);
        });
      }
    });

    this.client.on('stream-removed', (event) => {
      const { stream } = event;
      const streamId = stream.getId();

      if (!this.isLocalStream(streamId)) {
        console.log(`Unsubscribing to remote stream: ${streamId}`);

        delete this.remoteStreams[streamId];

        const elemToRemove = document
          .getElementById(`remote-stream-${streamId}`);
        elemToRemove.parentNode.removeChild(elemToRemove);
      } else {
        console.log('LOCAL STREAM REMOVED!!!');
        const elemToRemove = document
          .getElementById(`local-stream-${streamId}`);
        elemToRemove.parentNode.removeChild(elemToRemove);
      }

      // We unsubscribe in both cases
      this.client.unsubscribe(stream, (error) => {
        console.log(`[ERROR] Unsubscribe stream failed: ${error}`);
      });
    });

    this.client.on('stream-subscribed', async (event) => {
      const remoteStream = event.stream;
      const remoteId = remoteStream.getId();

      this.remoteStreams[remoteId] = remoteStream;
      console.log(`Subscribed to remote stream successfully: ${remoteId}`);

      const userProfile = await getUser(remoteId);

      document.querySelector('.remote-streams')
        .insertAdjacentHTML('beforeend', `
          <div
            id="remote-stream-${remoteId}"
            class="remote-stream"
          >
            <span>${userProfile.name || 'Anonymous User'}</span>
          </div>
        `);

      remoteStream.play(`remote-stream-${remoteId}`, { fit: 'contain' });
    });

    this.client.on('peer-leave', (event) => {
      const { uid, reason } = event;
      console.log(`Remote user left ${uid} with reason ${reason}`);
    });

    this.initClientAndJoinChannel();
  },
  async beforeDestroy() {
    console.log('BEFORE UNMOUNTING');

    if (this.localStreams.camera.id && this.localStreams.camera.stream) {
      console.log('stopping camera');
      await this.stopCamera();
    }

    await this.client.leave(() => {
      console.log('Client leaving the channel');
    }, (error) => {
      console.log(`[ERROR] Client leave failed: ${error}`);
    });
  },
  methods: {
    isLocalStream(streamId) {
      return streamId === this.localStreams.camera.id;
    },
    initClientAndJoinChannel() {
      this.client.init(this.appId, () => {
        console.log('AgoraRTC client initialized');
        this.joinChannel();
      }, (error) => {
        console.log(`[ERROR] Agora RTC client init failed: ${error}`);
      });
    },
    joinChannel() {
      const userId = this.userProfile.uid || null;

      this.client.join(this.token, this.channel, userId, (uid) => {
        console.log(`User ${uid} joined ${this.channel} successfully`);
        this.uid = uid;
        this.createCameraStream();
      }, (error) => {
        console.log(`[ERROR] Join Channel failed: ${error}`);
      });
    },
    createCameraStream() {
      if (this.uid) {
        const localStream = AgoraRTC.createStream({
          streamID: this.uid,
          audio: this.audioOn,
          video: this.videoOn,
          screen: false,
        });

        localStream.setVideoProfile(this.cameraVideoProfile);

        localStream.init(() => {
          console.log('getUserMedia successful!');

          document.getElementById('local-video')
            .insertAdjacentHTML('beforeend', `
              <div
                id="local-stream-${localStream.getId()}"
                class="local-stream"
              >
                <span>${this.userProfile.name || 'Anonymous User'}</span>
              </div>
            `);

          localStream.play(`local-stream-${localStream.getId()}`, {
            fit: 'contain',
          });

          this.client.publish(localStream, (error) => {
            console.log(`[ERROR] Publishing local stream error ${error}`);
          });

          this.localStreams.camera.id = localStream.getId();
          this.localStreams.camera.stream = localStream;

          this.localStreams.camera.stream
            .getVideoTrack()
            .onended = () => {
              this.client
                .unpublish(this.localStreams.camera.stream, (error) => {
                  console.log(`[ERROR] Unpublish stream failed: ${error}`);
                });

              // this.localStreams.camera.id = '';
              // this.localStreams.camera.stream = {};
            };
        }, (error) => {
          console.log(`[ERROR] getScreen failed: ${error}`);

          this.localStreams.camera.id = '';
          this.localStreams.camera.stream = {};
        });
      }
    },
    async stopCamera() {
      this.localStreams.camera.stream.stop();
      this.localStreams.camera.stream.close();

      await this.client.unpublish(this.localStreams.camera.stream, (error) => {
        console.log(`[ERROR] Unpublish stream failed: ${error}`);
      });
    },

    publish() {
      const { id, stream } = this.localStreams.camera;

      stream.play(`local-stream-${id}`, { fit: 'contain' });

      this.client.publish(stream, (error) => {
        console.log(`[ERROR] Publishing local stream error ${error}`);
      });

      stream.getVideoTrack()
        .onended = () => {
          this.client
            .unpublish(stream, (error) => {
              console.log(`[ERROR] Unpublish stream failed: ${error}`);
            });
        };
    },
    unpublish() {
      this.client
        .unpublish(this.localStreams.camera.stream, (error) => {
          console.log(`[ERROR] Unpublish stream failed: ${error}`);
        });
    },
  },
};
</script>

<style lang="scss">
.remote-streams {
  background: var(--primary-text);
  // height: 100%;
  max-width: 100%;

  .remote-stream {
    height: inherit;
    max-width: 100%;

    video {
      position: initial !important;
      width: 100% !important;
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
