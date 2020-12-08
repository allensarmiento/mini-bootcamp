<template>
  <div :class="['controls', column ? 'controls--column' : '']">
    <section class="controls__video">
      <ControlsButton
        @click="toggleVideo"
        :variant="videoOn ? 'primary' : ''"
      >
        <font-awesome-icon
          :icon="videoOn ? 'video' : 'video-slash'"
        />
      </ControlsButton>

      <ControlsButton
        @click="toggleAudio"
        :variant="audioOn ? 'primary' : ''"
      >
        <font-awesome-icon
          :icon="audioOn ? 'microphone' : 'microphone-slash'"
        />
      </ControlsButton>

      <ControlsButton @click="leave" variant="danger">
        <font-awesome-icon icon="phone" />
      </ControlsButton>

      <!-- <ControlsButton>
        Screen
      </ControlsButton> -->
    </section>

    <section v-if="userProfile.role === 'admin'" class="controls__admin">
      <ControlsButton @click="slideBackward">
        &larr;
      </ControlsButton>

      <ControlsButton @click="toggleScreenShare">
        Screen
      </ControlsButton>

      <ControlsButton @click="toggleSidebar">
        Sidebar
      </ControlsButton>

      <ControlsButton @click="slideForward">
        &rarr;
      </ControlsButton>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ControlsButton from './ControlsButton.vue';

export default {
  name: 'UserControls',
  components: { ControlsButton },
  props: {
    expanded: { type: String, default: 'false' },
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
    column: { type: Boolean, default: false },
  },
  computed: {
    ...mapState(['userProfile']),
  },
  methods: {
    toggleVideo() {
      this.$emit('toggleVideo');
    },
    toggleAudio() {
      this.$emit('toggleAudio');
    },
    leave() {
      this.$emit('leave');
    },
    toggleScreenShare() {
      this.$emit('toggleScreenShare');
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
.controls {
  display: flex;
  justify-content: space-between;

  padding: 2rem 4rem;
  background: var(--primary-color);

  &--column {
    flex-direction: column;
    align-items: center;
    padding: .4rem .8rem;

    & > :not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  &__video {
    display: flex;
    overflow: auto;
  }

  &__admin {
    display: flex;
    overflow: auto;
  }
}
</style>
