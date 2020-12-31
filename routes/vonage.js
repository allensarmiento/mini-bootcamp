const express = require('express');
const OpenTok = require('opentok');
const Redis = require('ioredis');
const { config } = require('../config/config');

const router = express.Router();

const redis = new Redis(
  'redis://localhost:6379',
  { connectTimeout: config.connectRedisTimeout },
);

const connectRedisTimeoutInterval = setInterval(() => {
  throw new Error('Redis connection timed out.');
}, config.connectRedisTimeout);

redis.on('ready', () => {
  console.log('Successfully connected to Redis and DB is ready.');
  clearInterval(connectRedisTimeoutInterval);
});

router.post('/sessionInfo', function(req, res) {
  const { room } = req.body;
  const { apiKey, apiSecret } = config.vonage;

  if (!apiKey || !apiSecret || !room) {
    console.log('Invalid credentials');
    return res.status(500).json({ error: 'Invalid credentials or room name. '});
  }

  const opentok = new OpenTok(apiKey, apiSecret);

  let sessionId;
  let token;

  redis.get(room, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      sessionId = result;

      if (sessionId) {
        console.log('SESSION ID EXISTS', sessionId);

        token = opentok.generateToken(sessionId);
        return res.json({ apiKey, sessionId, token });
      } else {
        console.log('SESSION ID DOES NOT EXIST');
        opentok.createSession({ mediaMode: 'routed' }, (error, session) => {
          if (error) {
            console.log(error);
            return res.status(500)
              .json({ error: `createSession error ${error}`});
          }

          sessionId = session.sessionId;
          redis.set(roomName, sessionId, 'EX', 60 * 60 * 24, (error, reply) => {
            if (error) console.log(error);
            else console.log(reply);
          });

          token = opentok.generateToken(sessionId);
          return res.json({ apiKey, sessionId, token });
        });
      }
    }
  });
});

module.exports = router;
