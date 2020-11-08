const express = require('express');
require('dotenv').config()
const app = express()
const cors = require('cors')
const server = require('http').Server(app)
const path = require('path')

if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'https://mini-bootcamp.herokuapp.com',
    optionsSuccessStatus: 200
  }))
} else {
  app.use(cors())
}

app.use(express.static(path.join(__dirname, 'client/dist')))

if (process.env.NODE_ENV === 'production') {
  // Handle any requests that don't match
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'))
  })
}

const port = process.env.PORT || 5000
server.listen(port)

const io = require('socket.io')(server, {});

const SOCKET_LIST = {}

io.sockets.on('connection', socket => {
  socket.id = Math.random()
  while (socket.id in SOCKET_LIST) {
    socket.id = Math.random()
  }
  SOCKET_LIST[socket.id] = socket
  console.log('client connected')

  socket.on('toggle', function(value) {
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i]
      socket.emit('toggleSidebar', value)
    }
  })

  socket.on('lesson', function(indexes) {
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i]
      socket.emit('lessonState', indexes)
    }
  })

  socket.on('sidebar', function(options) {
    console.log(options)
    for (let i in SOCKET_LIST) {
      const socket = SOCKET_LIST[i]
      socket.emit('sidebarState', options)
    }
  })
})
