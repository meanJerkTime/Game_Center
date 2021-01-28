'use strict';
const axios = require('axios');

module.exports = async (games, payload, roomsOpen, roomsIngame)=>{
  const roomOwner = payload.roomOwner;
  const players = payload.players;

  // get the cards from server
  const doorCardsData = await axios.get(process.env.DOOR_CARD_URL);
  const doorCards = doorCardsData.data;
  // const doorCards = [99,88,77,66,55,44,33,22,11];

  const treasureCardsData = await axios.get(process.env.TREASURE_CARD_URL);
  const treasureCards = treasureCardsData.data;
  // const treasureCards = [1,2,3,4,5,6,7,8,9,0,11,22,33,44,55];

  // do the logic to seperate cards and update the game state.

  function cardRandomizer (cards, qty){
    const selectedCards = [];
    // select qty cards
    for (let i = 0; i<qty; i++){
      let pickedCardIndex = Math.floor(Math.random() * cards.length);
      // add the cards to output
      selectedCards.push(cards[pickedCardIndex]);
      // delete it from origional array
      cards.splice(pickedCardIndex,1);
    }
    return selectedCards;
  }

  const gameState = {
    roomId: roomOwner,
    doorCardDeck: doorCards,
    doorCardDiscards:[],
    treasureCardDiscards:[],
    whosTurn: roomOwner,
  };

  players.forEach((player)=>{
    let selectedCard = cardRandomizer(treasureCards, 2);

    gameState[player.username] = {
      userName: player.username,
      level: 1,
      combatStrength:0,
      cardsInHand: selectedCard,
      cardsEquipped: {
        headGear: null,
        footGear: null,
        armor:null,
        weapon: [],
      },
    };
  });
  // add whatever left in treasure card deck to the game state
  gameState['treasureCardDeck'] = treasureCards;

  // move current game from open room list to in game room list

  roomsIngame[roomOwner] = {...roomsOpen[roomOwner]};

  delete roomsOpen[roomOwner];

  // attach gameState to each game room
  roomsIngame[roomOwner] = {
    ...roomsIngame[roomOwner],
    inGame: true,
    gameState,
  };

  // send out Initial Cards
  games.to(roomOwner).emit('InitialCards', gameState);

};
