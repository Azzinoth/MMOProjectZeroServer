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
        let hotBarId = data.createInventory(3);
        let armorInventoryId = data.createInventory(2);
        let characterId = data.getId('character');
		sqlUtils.insert('inventories', 'id, size', inventoryId+', 24');
		sqlUtils.insert('characters', 'id, inventoryId, armorInventoryId, hotBarId, activeHotBarCell,  isPlayer, column, row, top, left, level, health, strength, viewDistance', characterId+', '+inventoryId+', '+armorInventoryId+', '+hotBarId+', '+null+', 1, 10, 10, 640, 640, 1, 3, 1, 10');
		ws.id = characterId;
		data.clients[characterId] = ws;
		console.log("new connection " + ws.id);
		initialize(data, characterId, inventoryId, hotBarId, armorInventoryId);
		ws.on('message', function(message){
			messageHandler(data, message, characterId);
		});
		ws.on('close', function(){
			closeHandler(data, characterId);
		})

    });
}
module.exports = server;