const chatData = require('../DB/chatDb');

async function getChat(req ,res){

   const data =  await chatData.find({});
    res.json({
      data: data
    });
    res.redirect('/');
}

module.exports = {chats: getChat};