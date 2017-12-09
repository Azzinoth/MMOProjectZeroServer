//const webSocketServer = require('./config');
const messageHandler = require('./handler/messageHandler');
const closeHandler = require('./handler/closeHandler');
//const data = require ('../gameData/data');
const sqlUtils = require ('../sql/utils');
const initialize = require ('./initializeClient');
const WebSocketServer = new require('ws');

const webSocketServer = new WebSocketServer.Server({
	port: 8082
});

function server(data){
	
	webSocketServer.on('connection', function(ws) {
        let inventoryId = data.createInventory(24);
        let characterId = data.getId('character');
		sqlUtils.insert('inventories', 'id, size', inventoryId+', 24');
		sqlUtils.insert('characters', 'id, inventoryId, isPlayer, column, row, health, strength', characterId+', '+inventoryId+', 1, 10, 10, 3, 1');
		ws.id = characterId,
		data.clients[characterId] = ws,
		console.log("new connection " + ws.id),
		initialize(data, characterId, inventoryId);
		ws.on('message', function(message){
			messageHandler(data, message, characterId);
		});
		ws.on('close', function(){
			closeHandler(data, characterId);
		})

    });
}
module.exports = server;