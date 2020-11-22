require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// APP CONFIG
const app = express();
const server = require('http').Server(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'https://mini-bootcamp.herokuapp.com',
    optionsSuccessStatus: 200
  }));
} else {
  app.use(cors());
}

// APP ROUTES
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

function generateAccessToken(req, res) {
  const { channelName, uid, role, expireTime } = req.body;

  if (!channelName) {
    return res.status(500).json({ error: 'channel is required' });
  }

  // validate user id
  const userId = uid || 0;

  // get role
  const userRole = role === 'publisher'
    ? RtcRole.PUBLISHER
    : RtcRole.SUBSCRIBER;
  
  // get the expire time
  const expirationTime = expireTime ? parseInt(expireTime, 10) : 3600;

  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expirationTime;

  // build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    userId,
    userRole,
    privilegeExpireTime,
  );

  // return the token
  return res.json({ token });
}

app.post('/access-token', nocache, generateAccessToken);

// SERVE CLIENT
app.use(express.static(path.join(__dirname, 'client/dist')))

if (process.env.NODE_ENV === 'production') {
  // Handle any requests that don't match
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'))
  })
}

// LISTEN ON PORT
const port = process.env.PORT || 5000
server.listen(port)

// SOCKET IO
const io = require('socket.io')(server, {});

const SOCKET_LIST = {};

io.sockets.on('connection', socket => {
  socket.id = Math.random()
  while (socket.id in SOCKET_LIST) {
    socket.id = Math.random();
  }
  SOCKET_LIST[socket.id] = socket
  console.log('client connected');

  socket.on('screenshare', (value) => {
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i];
      socket.emit('screenShareActive', value);
    }
  });

  socket.on('toggle', function(value) {
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i];
      socket.emit('toggleSidebar', value);
    }
  });

  socket.on('lesson', function(indexes) {
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i];
      socket.emit('lessonState', indexes);
    }
  });

  socket.on('sidebar', function(options) {
    console.log(options);

    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i];
      socket.emit('sidebarState', options);
    }
  });
});
