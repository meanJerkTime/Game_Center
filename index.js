'use strict';
require('dotenv').config();
const express = require('express'),
  app = express(),
  server = require('http').createServer(app);
// io = require('socket.io').listen(server),

const io = require('socket.io')(server, {
  cors: {
    origin:false,
    // methods: ['GET', 'POST'],
    // handlePreflightRequest: (req, res) => {
    //   res.writeHead(200, {
    //     'Access-Control-Allow-Origin': '*',
    //     // "Access-Control-Allow-Methods": "GET,POST",
    //     // "Access-Control-Allow-Headers": "my-custom-header",
    //     'Access-Control-Allow-Credentials': true,
    //   });
    //   res.end();
    // },
  },
});

require('./src/server.js')(io);

//global operations
io.on('connection', (socket) => {

  console.log('Welcome Game Center', socket.id);

});

server.listen(process.env.PORT);


