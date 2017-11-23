//const webSocketServer = require('./config');
const messageHandler = require('./handler/messageHandler');
const closeHandler = require('./handler/closeHandler');
//const data = require ('../gameData/data');
const sqlUtils = require ('../sql/utils');
const initialize = require ('./initializeClient');
const WebSocketServer = new require('ws');

const webSocketServer = new WebSocketServer.Server({
	port: 8081
});

function server(data){
	//data.fillData();
	
	webSocketServer.on('connection', function(ws) {
		sqlUtils.insert('inventories', 'size', '24');
		sqlUtils.insert('characters', 'idInventory, isPlayer, column, row, health, strength', '1, 1, 10, 10, 3, 1');
		let idCharacter = sqlUtils.getId('character');
		let idInventory = sqlUtils.getId('inventory');
		ws.id = idCharacter;
		data.clients[idCharacter] = ws;		
		console.log("new connection " + ws.id);
		initialize(data.clients, idCharacter, data.inventories, data.characters, data.getCraftList(), idInventory, data.items, data.getMap());
		
		
		ws.on('message', function(message){
			messageHandler(message, data.clients, data.characters, idCharacter, data.inventories, data.getMap(), data.items);
		});

		ws.on('close', function(){
			closeHandler(data.clients, data.characters, data.inventories, idCharacter);
		});

	});
}
module.exports = server;