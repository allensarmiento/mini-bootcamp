const express = require('express');
const OpenTok = require('opentok');
const { config } = require('../config/config');

const router = express.Router();

router.post('/credentials', function(req, res) {
  const { apiKey } = config.vonage;

  if (!apiKey) {
    return res.status(500).send();
  }

  return res.json({ apiKey });
});

function getSessionId(roomName) {
  // TODO
  return '';
}

function addSessionId() {

}

router.post('/sessionInfo', function(req, res) {
  const { room } = req.body;
  const { apiKey, apiSecret } = config.vonage;
  const opentok = new OpenTok(apiKey, apiSecret);
  const potentialSessionId = getSessionId(room);

  let sessionId, token;

  if (potentialSessionId) {
    sessionId = potentialSessionId;
    token = opentok.generateToken(sessionId);

    return res.json({ apiKey, sessionId, token });
  } else {
    opentok.createSession({ mediaMode: 'routed' },  (error, session) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: `createSession error ${error}` });
      }

      addSessionId(session.sessionId);
      token = opentok.generateToken(session.sessionId);

      return res.json({ apiKey, sessionId, token });
    });
  }
});

module.exports = router;
