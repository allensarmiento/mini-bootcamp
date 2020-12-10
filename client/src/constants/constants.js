/* eslint-disable import/prefer-default-export */
export const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000/';
/* eslint-enable import/prefer-default-export */
