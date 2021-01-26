'use strict';
require('dotenv').config();
require('cors');

const io = require('socket.io')(process.env.PORT, {
  cors: {
    origin:'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials:true,
  }
});

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});
