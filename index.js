'use strict';
require('dotenv').config();

const io = require('socket.io')(process.env.PORT, {
  cors: {
    origin:'*',
    methods: ['GET', 'POST'],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        // "Access-Control-Allow-Origin": "https://example.com",
        // "Access-Control-Allow-Methods": "GET,POST",
        // "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true
      });
      res.end();
    }
  }
});

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});
