'use strict';
require('dotenv').config();
const axios = require('axios');

module.exports = async (io) => {

  let roomsOpen = {};
  let roomsIngame = {};

  // namespace for games
  const games = io.of('/games');

  games.on('connection', (socket)=>{
    console.log('games namespace connected with socket ID : ', socket.id);

    games.to(socket.id).emit('RoomList', roomsOpen)

    socket.on('CreateGame', (username)=>{

      socket.join(username);
      roomsOpen[username]={
        roomOwner: username,
        numOfPlayers: 1,
        inGame: false,
      }
      games.to(username).emit('NewCreation', `New room created by ${username}`)
    })


    socket.on('Join', (username)=>{
      // check whether the room exsit
      if (roomsOpen[username]){
        // check whether the room has less than 6 people
        if (roomsOpen[username].numOfPlayers < 6) {
          try {

            socket.join(username);
            roomsOpen[username] = {
              ...roomsOpen[username],
              numOfPlayers: roomsOpen[username].numOfPlayers + 1,
            }

            games.to(username).emit('NewJoin', `New user just joined the room`);
          }
          catch (err) {
            games.to(socket.id).emit('JoinErr', 'The room is currently unavailable');
          }
        } else {
          games.to(socket.id).emit('JoinErr', 'The room is currently unavailable');
        }
      } else {
        games.to(socket.id).emit('JoinErr', 'The room is currently unavailable');
      }
    })

    socket.on('LeaveRoom', (username)=>{
      try {
        socket.leave(username);
        roomsOpen[username] = {
          ...roomsOpen[username],
          numOfPlayers: roomsOpen[username].numOfPlayers - 1,
        }
        games.to(username).emit('LeftRoom', `A play just left the room`)
      }
      catch (err) {
        console.log(err);
      }
    })

    //before user left, update the room info
    socket.on('disconnecting', ()=>{
      // we are using username as the room name.
      // socket.io stores info in a set, thus we have to access it in this way
      var username = [...socket.rooms.keys()][1];
      if (username) {
        roomsOpen[username] = {
          ...roomsOpen[username],
          numOfPlayers: roomsOpen[username].numOfPlayers - 1,
        }
        if (roomsOpen[username].numOfPlayers <= 0) {
          delete roomsOpen[username];
        } else {
          games.to(username).emit('LeftRoom', `A play just left the room`)
        }
      }
    });
  })

}
