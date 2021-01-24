'use strict';
module.exports = (games, socket, username, roomsOpen, currentUserImg ) =>{
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
}
