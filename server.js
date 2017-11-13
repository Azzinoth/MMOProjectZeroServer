const WebSocketServer = require('ws');
const fieldClass = require('./utils/gameWorld/cell.js');
const humanClass = require('./entries/characters/humanClass.js');
const requestClass = require('./utils/requestClass.js');
const resource = require('./utils/Resource.js');

let clients = {};
let humans = {};
let id = -1;

let gameBoardWidth = 2048;
let gameBoardHeight = 2048;
let fieldMatrix=new Array(gameBoardHeight);

for (let i = 0; i < gameBoardHeight; i++) {
	fieldMatrix[i] = new Array(gameBoardWidth);

	for (let j = 0; j < gameBoardWidth; j++){
		fieldMatrix[i][j] = new fieldClass.Field({movable: true, column: i, row: j});
	}
}

MSG_TYPES = {
	SESSION_ID: 'SESSION_ID',
	HUMAN_DATA: 'HUMAN_DATA',
	HUMAN_MOVE: 'HUMAN_MOVE',
	HUMAN_MOVABLE: 'HUMAN_MOVABLE',
	HUMAN_DELETE: 'HUMAN_DELETE',
	GATHER: 'GATHER'
};

var webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {
	id++;
	ws.id = id;
	clients[id] = ws;
	console.log("new connection " + id);
	clients[id].send(JSON.stringify(new requestClass.Request({type:MSG_TYPES.SESSION_ID, request:id})));
	
	humans[id] = new humanClass.Human({id:id, isPlayer:true, column:10, row:10, health:3, strengh:1});
	let request;
	for (var key in clients) {
		if (+key!==id){
			request = new requestClass.Request ({type:MSG_TYPES.HUMAN_DATA, request:humans[id]})
			clients[key].send(JSON.stringify(request));	
		}
	}
	for (var key in humans) {
		request = new requestClass.Request ({type:MSG_TYPES.HUMAN_DATA, request:humans[key]})
		clients[id].send(JSON.stringify(request));		
	}
  
  
	ws.on('message', function(message) {
    var json = JSON.parse(message);
	console.log(message);
	switch (json.type){
		case MSG_TYPES.HUMAN_MOVE:
			let fromColumn = humans[ws.id].column;
			let fromRow = humans[ws.id].row;
			let toColumn = parseInt(json.request.column);
			let toRow = parseInt(json.request.row);
			let isMove;
			if (isMovableCell(fromRow, toRow, fromColumn, toColumn)){
				isMove = new requestClass.Request({type:MSG_TYPES.HUMAN_MOVABLE, request:true});
				clients[ws.id].send(JSON.stringify(isMove));
				humans[ws.id].column=toColumn;
				humans[ws.id].row=toRow;
				isMove = new requestClass.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
				for (var key in clients) {
					if (+key!==ws.id){
						clients[key].send(JSON.stringify(isMove));			
					}
				}
			}else{
				isMove = new requestClass.Request({type:MSG_TYPES.HUMAN_MOVABLE, request:false});
				clients[ws.id].send(JSON.stringify(isMove));
			}
			break;
        case MSG_TYPES.GATHER:
            let fromColumn = humans[ws.id].column;
            let fromRow = humans[ws.id].row;
            let toColumn = json.request.column;
            let toRow = json.request.row;
            let idItem = json.request.idObject;
            let isGather;
            if (isGatheredCell(fromRow, fromColumn, toRow, toColumn, idItem)){
                isGather = new requestClass.Request({type:MSG_TYPES.GATHER, request:true});
                clients[ws.id].send(JSON.stringify(isGather));
                humans[ws.id].column=toColumn;
                humans[ws.id].row=toRow;
                isGather = new requestClass.Request({type:MSG_TYPES.GATHER, request:fieldMatrix[toColumn][toRow]});
                for (var key in clients) {
                    if (+key!==ws.id){
                        clients[key].send(JSON.stringify(isGather));
                    }
                }
			}else{
                isGather = new requestClass.Request({type:MSG_TYPES.GATHER, request:false});
                clients[ws.id].send(JSON.stringify(isGather));
			}
        	break;
	}
});

	ws.on('close', function() {
		console.log('connection closed ' + ws.id);
		delete clients[ws.id];
		let requestDelete = new requestClass.Request({type:MSG_TYPES.HUMAN_DELETE, request:humans[ws.id]});
		for (var key in clients) {
			clients[key].send(JSON.stringify(requestDelete));			
		}
		delete humans[ws.id];
	});
});

function isMovableCell(fromRow, toRow, fromColumn, toColumn){
	if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2){
		return fieldMatrix[toColumn][toRow].movable;
	}else{
		return false;
	}
}

function isGatheredCell(fromRow, fromColumn, toRow, toColumn, idItem){
    if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2&&fieldMatrix[toColumn][toRow].idObject===idItem){
        return fieldMatrix[toColumn][toRow].idObject=null;
    }else{
        return false;
    }
}