'use strict';
require('dotenv').config();
const axios = require('axios');

// Here's the auth middleware
module.exports = async (socket, next) => {
  let token = socket.handshake.query.token;
  let config = {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };

  try{
    const authRes = await axios.post(process.env.CHAT_USER_AUTH_URL, {}, config);

    userMap[authRes.data.user.username] = socket.id;
    socketMap[socket.id] = authRes.data.user.username;
    console.log('user map : ', userMap);
    next();
  }
  catch(err){
    console.log(err.message);
  }
}
// async function chatmid (socket,next){
//   let token = socket.handshake.query.token;
//   let config = {
//     headers: {
//       'Authorization': 'Bearer ' + token,
//     },
//   };

//   try{
//     const authRes = await axios.post(process.env.CHAT_USER_AUTH_URL, {}, config);

//     userMap[authRes.data.user.username] = socket.id;
//     socketMap[socket.id] = authRes.data.user.username;
//     console.log('user map : ', userMap);
//     next();
//   }
//   catch(err){
//     console.log(err.message);
//   }
// }
