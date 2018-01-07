const log = require('./log');

let data;

function setData (myData){
    data = myData;
}
const distanceUtils = require('../utils/distanceUtils');
function sendToAll(request){
  let message = JSON.stringify(request);
  log(request.type, message, true, 'to all');
	for (let key in data.accounts){
        if (data.accounts[key].webSocket!==null)data.accounts[key].webSocket.send(message);
    }
}
function sendToClient(accountId, request){
  let message = JSON.stringify(request);
  log(request.type, message, true, accountId);
    if (data.accounts[accountId].webSocket!==null) data.accounts[accountId].webSocket.send(message);
	//client.send(JSON.stringify(request));
}
function sendAllExcept(request, accountId){
  let message = JSON.stringify(request);
  log(request.type, message, true, 'allExcept-'+accountId);
    for (let key in data.accounts){
        if (data.accounts[key].webSocket!==null&&key!=accountId){
            data.accounts[key].webSocket.send(message);
        }
    }
}
function sendByViewDistance(characters, request, column, row){
  let message = JSON.stringify(request);
  log(request.type, message, true, 'byView');
    for (let key in characters){
        if (characters[key].isOnline&&data.accounts[characters[key].accountId].webSocket!==null){
            let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
            if (distance<=characters[key].viewDistance){
                data.accounts[characters[key].accountId].webSocket.send(message);
            }
        }
    }
}
function sendByViewDistanceExcept(characters, request, column, row, accountId){
  let message = JSON.stringify(request);
  log(request.type, message, true, 'byViewExcept-'+accountId);
    for (let key in characters){
        if (characters[key].isOnline&&data.accounts[characters[key].accountId].webSocket!==null&&characters[key].accountId!=accountId){
            let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
            if (distance<=characters[key].viewDistance){
                data.accounts[characters[key].accountId].webSocket.send(message);
            }
        }
    }
}

exports.sendToAll = sendToAll;
exports.sendToClient = sendToClient;
exports.sendAllExcept = sendAllExcept;
exports.sendByViewDistance = sendByViewDistance;
exports.sendByViewDistanceExcept = sendByViewDistanceExcept;
exports.setData = setData;