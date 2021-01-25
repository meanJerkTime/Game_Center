'use strict';
module.exports = (games, socket, roomOwner, roomsOpen, currentUserImg, currentUser ) =>{
  try {
    socket.leave(roomOwner);

    roomsOpen[roomOwner] = {
      ...roomsOpen[roomOwner],
      numOfPlayers: roomsOpen[roomOwner].numOfPlayers - 1,
      currentPlayers: roomsOpen[roomOwner].currentPlayers.filter((player)=> player.username != currentUser),
    };
    games.to(roomOwner).emit('LeftRoom', {message: ` ${currentUser} has left the room`,roomStatus:roomsOpen[roomOwner] });
  }
  catch (err) {
    console.log(err);
  }
};
