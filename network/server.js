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
	//data.fillData();
	
	webSocketServer.on('connection', function(ws) {
        sqlUtils.initDB();
		sqlUtils.insert('inventories', 'size', '24')
			.then( inventoryId=>{
			console.log(inventoryId),
			sqlUtils.insert('characters', 'idInventory, isPlayer, column, row, health, strength', inventoryId+', 1, 10, 10, 3, 1'),
            sqlUtils.closeDB()
				.then( characterId=>{
				console.log(characterId),
				ws.id = characterId,
				data.clients[characterId] = ws,
				console.log("new connection " + ws.id),
				initialize(data.clients, characterId, data.inventories, data.characters, inventoryId, data.items, data.getMap()),


				ws.on('message', function(message){
					messageHandler(message, data.clients, data.characters, characterId, data.inventories, data.getMap(), data.items);
				}),

				ws.on('close', function(){
					closeHandler(data.clients, data.characters, data.inventories, characterId);
				})

			});
		});
    });
}
module.exports = server;