'use strict';
require('dotenv').config();
const cors = require('cors');

app.use(cors());

const io = require('socket.io')(process.env.PORT, {
  cors: {
    origin:false,
  }
});

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});



