let data;
function setData (myData){
    data = myData;
}
const distanceUtils = require('../utils/distanceUtils');
function sendToAll(request){
	for (let key in data.accounts){
        if (data.accounts[key].webSocket!==null)data.accounts[key].webSocket.send(JSON.stringify(request));
    }
}
function sendToClient(accountId, request){
    if (data.accounts[accountId].webSocket!==null) data.accounts[accountId].webSocket.send(JSON.stringify(request));
	//client.send(JSON.stringify(request));
}
function sendAllExcept(request, accountId){
    for (let key in data.accounts){
        if (data.accounts[key].webSocket!==null&&key!=accountId){
            data.accounts[key].webSocket.send(JSON.stringify(request));
        }
    }
}
function sendByViewDistance(characters, request, column, row){
    for (let key in characters){
        if (characters[key].isOnline&&data.accounts[characters[key].accountId].webSocket!==null){
            let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
            if (distance<=characters[key].viewDistance){
                data.accounts[characters[key].accountId].webSocket.send(JSON.stringify(request));
            }
        }
    }
}
function sendByViewDistanceExcept(characters, request, column, row, accountId){
    for (let key in characters){
        if (characters[key].isOnline&&data.accounts[characters[key].accountId].webSocket!==null&&characters[key].accountId!=accountId){
            let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
            if (distance<=characters[key].viewDistance){
                data.accounts[characters[key].accountId].webSocket.send(JSON.stringify(request));
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