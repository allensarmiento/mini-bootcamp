import axios from 'axios';

const ENDPOINT = process.env.NODE_ENV === 'production'
  ? process.env.VUE_APP_ENDPOINT : 'http://localhost:5000';

/* eslint-disable import/prefer-default-export */
export function fetchAccessToken(channelName, role, expireTime) {
  return axios.post(`${ENDPOINT}/access-token`,
    {
      channelName,
      role,
      expireTime,
    })
    .then((response) => response.data)
    .then((data) => data.token);
}
/* eslint-enable import/prefer-default-export */
