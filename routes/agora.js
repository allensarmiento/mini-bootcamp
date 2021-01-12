const express = require('express');
const { Agora } = require('../services/Agora');
const { nocache } = require('../middleware/caching');

const router = express.Router();

router.post('/access-token', nocache, function(req, res) {
  const { channelName, uid, role, expireTime } = req.body;

  const agora = new Agora({ channelName, uid, role, expireTime });
  const result = agora.generateAccessToken();

  if (result.error) return res.status(500).json({ error: result.error });

  return res.json(result);
});

module.exports = router;
