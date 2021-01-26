'use strict';
require('dotenv').config();

const io = require('socket.io')(process.env.PORT, {
  cors: {
    origin:'localhost:3000',
    methods: ['GET', 'POST']
  }
});

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});
