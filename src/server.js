'use strict';
require('dotenv').config();
const axios = require('axios');

// NOT using it, for demo purpose
const gameState = {
  doorCards: 32,
  treasureCards:40,
  discardCards:0,
  player1: {
    level: 1,
    cardsInHandQty:2,
    cardsInHand:[
      1,2
    ],
    cardsEquiptedQty:2,
    cardsEquipted: [
      3,4
    ],
  },
  player2: {
    level: 1,
    cardsInHandQty:1,
    cardsInHand:[
      5
    ],
    cardsEquiptedQty:3,
    cardsEquipted: [
      6,7,8
    ],
  },
  player3: {
    level: 1,
    cardsInHandQty:3,
    cardsInHand:[
      9,10,11
    ],
    cardsEquiptedQty:1,
    cardsEquipted: [
      12
    ],
  }
};

// customer event will start with capital letter, camel case style. Build in event will stay with lower case

module.exports = async (io) => {

  let roomsOpen = {};
  let roomsIngame = {};

  // namespace for games
  const games = io.of('/games');

  games.on('connection', (socket)=>{

    // get the current socket user info
    const [currentUser,currentUserImg ] = socket.handshake.query.user.split('---');

    // send this user the open room info
    games.to(socket.id).emit('RoomList', roomsOpen);


    socket.on('CreateGame', (username)=>{
      socket.join(username);
      // update the roomsOpen list (it's an obj, not array)
      roomsOpen[username]={
        roomOwner: username,
        numOfPlayers: 1,
        inGame: false,
        currentPlayers: [
          {
            username: username,
            profileImgUrl: currentUserImg,
            socketID: socket.id,
          }
        ]
      }
      // sends out updated room open list to everybody
      games.emit('RoomList', roomsOpen);
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
              currentPlayers: [
                ...roomsOpen[username].currentPlayers,
                {
                  username: currentUser,
                  profileImgUrl: currentUserImg,
                  socketID: socket.id,
                }
              ]
            }

            games.to(username).emit('NewJoin', {username: currentUser, userImg: currentUserImg, message: `New user ${currentUser} just joined the room`});
            console.log(roomsOpen[username].currentPlayers);
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
          currentPlayers: roomsOpen[username].currentPlayers.filter((player)=> player.username != currentUser),
        }
        games.to(username).emit('LeftRoom', {username: currentUser, userImg: currentUserImg, message: ` ${currentUser} has left the room`})
      }
      catch (err) {
        console.log(err);
      }
    })

    //before user left, update the room info
    socket.on('disconnecting', ()=>{
      // socket.io stores info in a set, thus we have to access it in this way

      // we are using username as the room name.
      var username = [...socket.rooms.keys()][1];

      if (username) {
        roomsOpen[username] = {
          ...roomsOpen[username],
          numOfPlayers: roomsOpen[username].numOfPlayers - 1,
          currentPlayers: roomsOpen[username].currentPlayers.filter((player)=> player.username != currentUser),
        }
        console.log(roomsOpen[username].currentPlayers);

        if (roomsOpen[username].numOfPlayers <= 0) {
          delete roomsOpen[username];
        } else {
          games.to(username).emit('LeftRoom', {username: currentUser, userImg: currentUserImg, message: ` ${currentUser} has left the room`})
        }
      }
    });


    socket.on('StartGame', (username)=>{
      // do the logic to seperate cards and update the game state.

      const gameState = {
        doorCards: 30,
        treasureCards:40,
        discardCards:0,
        player1: {
          level: 1,
          cardsInHandQty:4,
          cardsInHand:[
            1,2,3,4
          ]
        },
        player2: {
          level: 1,
          cardsInHandQty:4,
          cardsInHand:[
            5,6,7,8
          ]
        },
        player3: {
          level: 1,
          cardsInHandQty:4,
          cardsInHand:[
            9,10,11,12
          ]
        }
      };

      // send out Initial Cards
      games.to(username).emit("InitialCards", {gameState})
    })



  })

}
