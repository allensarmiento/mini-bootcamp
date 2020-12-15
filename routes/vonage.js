const express = require('express');
const OpenTok = require('opentok');
const { config } = require('../config/config');

const router = express.Router();

router.post('/credentials', function(req, res) {
  const { apiKey, apiSecret } = config.vonage;

  if (!apiKey || !apiSecret) {
    return res.status(500).send();
  }

  return res.json({ apiKey, apiSecret });
});

router.post('/sessionInfo', function(req, res) {
  const { apiKey, apiSecret } = config.vonage;

  const opentok = new OpenTok(apiKey, apiSecret);

  let sessionId;
  opentok.createSession({}, function(error, session) {
    if (error) {
      res.status(500).send({ error: `Error creating session ${error}` });
    } else {
      sessionId = session.sessionId;
    }
  });

  const token = opentok.generateToken(sessionId);

  return res.json({ sessionId, token });
});

module.exports = router;
