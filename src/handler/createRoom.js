'use strict';
module.exports = (games, socket, roomOwner, roomsOpen, currentUserImg ) =>{
  socket.join(roomOwner);
  // update the roomsOpen list (it's an obj, not array)
  roomsOpen[roomOwner]={
    roomOwner: roomOwner,
    numOfPlayers: 1,
    inGame: false,
    currentPlayers: [
      {
        username: roomOwner,
        profileImgUrl: currentUserImg,
        socketID: socket.id,
      },
    ],
  };
  // sends out updated room open list to everybody
  games.emit('NewRoomCreated', roomsOpen);
};
