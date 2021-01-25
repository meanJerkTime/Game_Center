'use strict';
module.exports = (games, socket, roomOwner, roomsOpen, currentUserImg, currentUser ) =>{

  // check whether the room exsit
  if (roomsOpen[roomOwner]){
    // check whether the room has less than 6 people
    if (roomsOpen[roomOwner].numOfPlayers < 6) {
      try {

        socket.join(roomOwner);
        roomsOpen[roomOwner] = {
          ...roomsOpen[roomOwner],
          numOfPlayers: roomsOpen[roomOwner].numOfPlayers + 1,
          currentPlayers: [
            ...roomsOpen[roomOwner].currentPlayers,
            {
              username: currentUser,
              profileImgUrl: currentUserImg,
              socketID: socket.id,
            }
          ]
        }

        games.to(roomOwner).emit('NewJoin', {message: `New player ${currentUser} just joined the room`, roomStatus:roomsOpen[roomOwner]});

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
}
