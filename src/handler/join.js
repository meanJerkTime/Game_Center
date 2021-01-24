'use strict';
module.exports = (games, socket, username, roomsOpen, currentUserImg, currentUser ) =>{

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
