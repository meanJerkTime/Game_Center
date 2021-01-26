'use strict';
module.exports = (games, gameState,roomsIngame ) =>{
  // figureout who's just take action from gameState
  let currentPlayer = gameState.whosTurn;

  let players = roomsIngame[gameState.roomId].currentPlayers.map ((player)=>player.username);
  let nextPlayerIndex = players.indexOf(currentPlayer) + 1 < players.length ? players.indexOf(currentPlayer) + 1 : 0;
  gameState.whosTurn = players[nextPlayerIndex];

  games.to(gameState.roomId).emit('UpdateLocalGameState', gameState);
  console.log('next player index', nextPlayerIndex);

};
