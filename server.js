const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const AgoraRoutes = require('./routes/agora');
const VonageRoutes = require('./routes/vonage');

const { config } = require('./config/config');
const { ENVIRONMENT } = require('./constants/constants');

const app = express();
const server = require('http').Server(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (config.environment === ENVIRONMENT.production) {
  app.use(cors({
    origin: config.origin,
    optionsSuccessStatus: 200,
  }));
} else {
  app.use(cors());
}

app.use('/agora', AgoraRoutes);
app.use('/vonage', VonageRoutes);

app.use(express.static(path.join(__dirname, 'client/dist')));

if (config.environment === ENVIRONMENT.production) {
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
  });
}

server.listen(config.port, () => console.log('Server up and running'));

// ========== SOCKET IO ===========
const io = require('socket.io')(server, {});

const SOCKET_LIST = {};
let canJoin = false;

io.sockets.on('connection', (socket) => {
  socket.id = generateSocketId();

  SOCKET_LIST[socket.id] = socket;

  socket.on('userConnected', () => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('canJoin', canJoin);
    }
  });

  socket.on('canJoin', (value) => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      canJoin = value;
      socket.emit('canJoin', value);
    }
  });

  socket.on('adminLeft', () => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('adminLeft');
    }
  });

  socket.on('screenshare', (value) => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('screenShareActive', value);
    }
  });

  socket.on('toggle', (value) => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('toggleSidebar', value);
    }
  });

  socket.on('lesson', (indexes) => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('lessonState', indexes);
    }
  });

  socket.on('sidebar', (options) => {
    for (let id in SOCKET_LIST) {
      const socket = SOCKET_LIST[id];
      socket.emit('sidebarState', options);
    }
  });
});

function generateSocketId() {
  const id = Math.random();
  while (id in SOCKET_LIST) {
    id = Math.random();
  }
  return id;
}
