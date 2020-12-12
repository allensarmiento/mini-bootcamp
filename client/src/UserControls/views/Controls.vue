<template>
  <div :class="['controls', columnClass]">
    <section class="controls__video">
      <ControlsButton
        :variant="videoOn ? 'primary' : ''"
        @click="toggleVideo"
      >
        <font-awesome-icon :icon="videoOn ? 'video' : 'video-slash'" />
      </ControlsButton>

      <ControlsButton
        :variant="audioOn ? 'primary' : ''"
        @click="toggleAudio"
      >
        <font-awesome-icon
          :icon="audioOn ? 'microphone' : 'microphone-slash'"
        />
      </ControlsButton>

      <ControlsButton variant="danger" @click="leave">
        <font-awesome-icon icon="phone" />
      </ControlsButton>
    </section>

    <section v-if="userProfile.role === 'admin'" class="controls__admin">
      <ControlsButton @click="slideBackward">&larr;</ControlsButton>
      <ControlsButton @click="toggleScreenShare">Screen</ControlsButton>
      <ControlsButton @click="toggleSidebar">Sidebar</ControlsButton>
      <ControlsButton @click="slideForward">&rarr;</ControlsButton>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ControlsButton from '../components/ControlsButton.vue';

export default {
  name: 'UserControls',
  components: { ControlsButton },
  props: {
    videoOn: { type: Boolean, default: false },
    audioOn: { type: Boolean, default: false },
    column: { type: Boolean, default: false },
  },
  computed: {
    ...mapState(['userProfile']),
    columnClass() {
      return this.column ? 'controls--column' : '';
    },
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
