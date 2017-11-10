var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};
var humans = {};
var id = -1;

// WebSocket-сервер на порту 8081
var fieldClass = require('./fieldClass.js');
var humanClass = require('./humanClass.js');
var requestClass = require('./requestClass.js');
let gameBoardWidth = 2048;
let gameBoardHeight = 2048;
var fieldMatrix=new Array(2048);
for (let i = 0; i<gameBoardHeight; i++){
	fieldMatrix[i] = new Array(2048);
	for (let j = 0; j<gameBoardWidth; j++){
		fieldMatrix[i][j] = new fieldClass.Field({movable : true});
	}
}
MSG_TYPES = {
    SESSION_ID : 0,
    HUMAN_DATA : 1,
	HUMAN_MOVE : 2,
	HUMAN_MOVABLE : 3,
	HUMAN_DELETE : 4
   }

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
				humans[ws.id].type = MSG_TYPES.HUMAN_MOVE;
				humans[ws.id].column=toColumn;
				humans[ws.id].row=toRow;
				isMove = new requestClass.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
				for (var key in clients) {
					if (+key!==ws.id){
						clients[key].send(JSON.stringify(isMove));			
					}
				}
			}else{
				isMove = new requestClass.Request({type:MSG_TYPES.HUMAN_MOVABLE, request:true});
				clients[ws.id].send(JSON.stringify(isMove));
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