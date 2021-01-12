<template>
  <AgoraScreenShare v-if="useAgora" />
</template>

<script>
import AgoraScreenShare from '../components/AgoraScreenShare.vue';
import { SCREEN_PROVIDER } from '../../constants/constants';

export default {
  name: 'ScreenShare',
  components: { AgoraScreenShare },
  computed: {
    useAgora() {
      console.log('Screen provider');
      console.log(SCREEN_PROVIDER);
      return SCREEN_PROVIDER === 'agora';
    },
    useVonage() {
      return SCREEN_PROVIDER === 'vonage';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
