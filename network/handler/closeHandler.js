const {
	HUMAN_DELETE
} = require('../../constants').messageTypes;
const Request = require('../Request');
const sender = require('../sender');

function closeHandler(data, accountId){
	console.log('connection closed ' + accountId);
  if (accountId===undefined||isNaN(accountId)){
    return;
  }
  accountId = parseInt(accountId);
	for (let key in data.characters){
	    if (data.characters[key].accountId === accountId){
            let requestDelete = new Request({type:HUMAN_DELETE, request:data.characters[key].id});
            sender.sendByViewDistanceExcept(data.characters, requestDelete, data.characters[key].column, data.characters[key].row, accountId);
            data.characters[key].isOnline=false;
        }
    }



    data.accounts[accountId].webSocket = null;
}
module.exports = closeHandler;