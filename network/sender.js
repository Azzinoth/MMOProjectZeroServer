let data;
function setData (myData){
    data = myData;
}
const distanceUtils = require('../utils/distanceUtils');
function sendToAll(request){
	for (let key in data.clients){
        data.clients[key].send(JSON.stringify(request));
    }
}
function sendToClient(id, request){
    data.clients[id].send(JSON.stringify(request));
	//client.send(JSON.stringify(request));
}
function sendAllExcept(request, id){
    for (let key in data.clients){
        if (key!=id){
            data.clients[key].send(JSON.stringify(request));
        }
    }
}
function sendByViewDistance(characters, request, column, row){
    for (let key in characters){
    	let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
    	if (distance<=characters[key].viewDistance){
            data.clients[key].send(JSON.stringify(request));
		}
    }
}
function sendByViewDistanceExcept(characters, request, column, row, exceptionId){
    for (let key in characters){
        if (key!=exceptionId){
            let distance = distanceUtils.distance(characters[key].column,characters[key].row,column,row);
            if (distance<=characters[key].viewDistance){
                data.clients[key].send(JSON.stringify(request));
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