'use strict';
require('dotenv').config();

const io = require('socket.io')(process.env.PORT);

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});
