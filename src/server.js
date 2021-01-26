'use strict';
require('dotenv').config();
const axios = require('axios');

// customer event will start with capital letter, camel case style. Build in event will stay with lower case

module.exports = async (io) => {

  let roomsOpen = [];
  let roomsIngame = [];

  // namespace for games
  const games = io.of('/games');

  games.on('connection', (socket)=>{

    // get the current socket user info
    const [currentUser,currentUserImg ] = socket.handshake.query.user.split('---');

    // send this user the open room info
    games.to(socket.id).emit('RoomList', roomsOpen);


    socket.on('CreateGame', (username)=>{
      const createGameHandler = require('./handler/createGame.js');
      createGameHandler(games, socket, username, roomsOpen, currentUserImg );
    })


    socket.on('Join', (username)=>{
      const join = require('./handler/join.js');
      join(games, socket, username, roomsOpen, currentUserImg, currentUser);
    })


    socket.on('LeaveRoom', (username)=>{
      const leaveRoom = require('./handler/leaveRoom.js');
      leaveRoom(games, socket, username, roomsOpen, currentUserImg, currentUser );
    })

    //before user left, update the room info
    socket.on('disconnecting', ()=>{
      const disconnecting = require('./handler/disconnecting.js');
      disconnecting(games, socket, roomsOpen, currentUserImg, currentUser);
    });


    socket.on('StartGame', async (payload)=>{
      const startGame = require('./handler/startGame.js');
      startGame(games, payload, roomsOpen, roomsIngame);
    })

  })

}
