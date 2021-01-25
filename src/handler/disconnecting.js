'use strict';
module.exports =(games, socket, roomsOpen, currentUserImg, currentUser)=>{

  // socket.io stores info in a set, thus we have to access it in this way

  // we are using username as the room name.

  var username = [...socket.rooms.keys()][1];

  if (username && roomsOpen[username]) {

    roomsOpen[username] = {
      ...roomsOpen[username],
      numOfPlayers: roomsOpen[username].numOfPlayers - 1,
      currentPlayers: roomsOpen[username].currentPlayers.filter((player)=> player.username != currentUser),
    }


    if (roomsOpen[username].numOfPlayers <= 0) {
      delete roomsOpen[username];
    } else {
      games.to(username).emit('LeftRoom', {message: ` ${currentUser} has left the room`,roomStatus:roomsOpen[username] })
    }
  }
}

