import axios from 'axios';
import { ENDPOINT } from '../../constants/constants';

export function fetchAgoraAccessToken(channelName, role, expireTime) {
  return axios.post(`${ENDPOINT}agora/access-token`, {
    channelName,
    role,
    expireTime,
  })
  .then((response) => response.data)
  .then((data) => data.token);
}

export function fetchVonageAccessToken() {}
