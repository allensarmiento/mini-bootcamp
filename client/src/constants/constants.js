export const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000/';

export const VIDEO_PROVIDER = process.env.VUE_APP_VIDEO_PROVIDER;
export const SCREEN_PROVIDER = process.env.VUE_APP_SCREEN_PROVIDER;

export const AGORA_CONFIG = {
  appId: process.env.VUE_APP_AGORA_APP_ID,
  videoChannel: process.env.VUE_APP_VIDEO_CHANNEL,
  screenChannel: process.env.VUE_APP_SCREEN_CHANNEL,
};
