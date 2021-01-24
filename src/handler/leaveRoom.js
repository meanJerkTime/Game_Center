'use strict';
module.exports = (games, socket, username, roomsOpen, currentUserImg, currentUser ) =>{
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
}
