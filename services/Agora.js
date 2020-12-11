const { RtcRole, RtcTokenBuilder } = require('agora-access-token');
const { config } = require('../config/config');

class Agora {
  constructor({ channelName, uid, role, expireTime } = {}) {
    this.channelName = channelName;
    this.uid = uid;
    this.role = role;
    this.expireTime = expireTime;
  }

  generateAccessToken() {
    if (!this.channelName) {
      return { error: 'Channel is required' };
    }

    const userId = this.validateUserId(this.uid);
    const userRole = this.getUserRole(this.role);
    const expirationTime = this.parseExpirationTime(this.expireTime);
    const privilegeExpireTime = this.getPrivilegeExpireTime(expirationTime);

    const token = this.buildToken({
      appId: config.agora.appId,
      appCertificate: config.agora.appCertificate,
      channelName: this.channelName,
      userId,
      userRole,
      privilegeExpireTime,
    });

    return { token };
  }

  validateUserId(uid) {
    return uid || 0;
  }

  getUserRole(role) {
    return role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  }

  parseExpirationTime(expireTime) {
    return expireTime ? parseInt(this.expireTime, 10) : 3600;
  }

  getPrivilegeExpireTime(expirationTime) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime + expirationTime;
  }

  buildToken({
    appId,
    appCertificate,
    channelName,
    userId,
    userRole,
    privilegeExpireTime
  }) {
    return RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      userId,
      userRole,
      privilegeExpireTime,
    );
  }
}

module.exports = { Agora };
