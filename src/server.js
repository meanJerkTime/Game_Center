'use strict';
require('dotenv').config();

// customer event will start with capital letter, camel case style. Build in event will stay with lower case

module.exports = async (io) => {

  let roomsOpen = {};
  let roomsIngame = {};

  // namespace for games
  const games = io.of('/games');

  games.on('connection', (socket)=>{

    // get the current socket user info
    // const [currentUser,currentUserImg ] = socket.handshake.query.user.split('---');
    const currentUserImg = "";
    const currentUser = socket.handshake.query.user;

    // send this user the open room info
    games.to(socket.id).emit('RoomList', roomsOpen);


    socket.on('CreateRoom', (roomOwner)=>{
      const createGameHandler = require('./handler/createRoom.js');
      createGameHandler(games, socket, roomOwner, roomsOpen, currentUserImg );
    });


    socket.on('Join', (roomOwner)=>{
      const join = require('./handler/join.js');
      join(games, socket, roomOwner, roomsOpen, currentUserImg, currentUser);
    });


    socket.on('LeaveRoom', (roomOwner)=>{
      const leaveRoom = require('./handler/leaveRoom.js');
      leaveRoom(games, socket, roomOwner, roomsOpen, currentUserImg, currentUser );
    });

    //before user left, update the room info
    socket.on('disconnecting', ()=>{
      const disconnecting = require('./handler/disconnecting.js');
      disconnecting(games, socket, roomsOpen, currentUserImg, currentUser);
    });


    socket.on('InitGame', async (payload)=>{
      const initGame = require('./handler/initGame.js');
      initGame(games, payload, roomsOpen, roomsIngame);
    });


    socket.on('nextTurn', (gameState)=>{
      const nextTurn = require('./handler/nextTurn.js');
      nextTurn(games, gameState,roomsIngame );
    });

    socket.on('updateState', (gameState)=>{
      games.to(gameState.roomId).emit('UpdateLocalGameState', gameState);
    });
    

    socket.on('GameOver', (payload)=>{
      const winner = payload.winner;
      const roomOwner = payload.roomOwner;

      games.emit('Winner', winner);

      // get rid of game state
      delete roomsIngame[roomOwner].gameState;

      // move the room from in game to open
      roomsOpen[roomOwner] = {...roomsIngame[roomOwner], inGame: false};

      // get rid of game room in roomsIngame
      delete roomsIngame[roomOwner];

    });
  });
};
