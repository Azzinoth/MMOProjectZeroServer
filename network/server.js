//const webSocketServer = require('./config');
const messageHandler = require('./handler/messageHandler');
const closeHandler = require('./handler/closeHandler');
//const data = require ('../gameData/data');
const sqlUtils = require ('../sql/utils');
const initialize = require ('./initialize');
const Request = require('./Request');
const Account = require('../Account');
const WebSocketServer = new require('ws');
const {
    AUTORIZATION,
	REGISTRATION,
    SYSTEM_MESSAGE
} = require('../constants').messageTypes;
const webSocketServer = new WebSocketServer.Server({
	port: 8082
});

function server(data){
	
	webSocketServer.on('connection', function(ws) {
        // let inventoryId = data.createInventory(24);
        // let hotBarId = data.createInventory(3);
        // let armorInventoryId = data.createInventory(2);
        let characterId = null;
        let  isAutorizated = false;
        // sqlUtils.insert('inventories', 'id, size', inventoryId+', 24');
        // sqlUtils.insert('characters', 'id, inventoryId, armorInventoryId, hotBarId, activeHotBarCell,  isPlayer, column, row, top, left, level, health, strength, viewDistance', characterId+', '+inventoryId+', '+armorInventoryId+', '+hotBarId+', '+null+', 1, 10, 10, 640, 640, 1, 3, 1, 10');
        // ws.id = characterId;
        // data.clients[characterId] = ws;
        console.log("new connection");

		ws.on('message', function(message){
            if (isAutorizated){
                messageHandler(data, message, characterId);
            }else{
                let json = JSON.parse(message);
                switch (json.type){
                    case AUTORIZATION:{
                        for (let key in data.accounts){
                            if (data.accounts[key].email===json.request[0]&&data.accounts[key].password===json.request[1]){
                                console.log("connected " + json.request[0]);
                                ws.id = key;
                                data.accounts[key].webSocket = ws;
                                characterId = setCharacterOnline(data, data.accounts[key].id);
                                if (characterId === null) break;
                                initialize(data, data.accounts[key].id);
                                isAutorizated = true;

                                break;
                            }
                        }
                    }
                    break;
                    case REGISTRATION:{
                        let isExist = false;
                        for (let key in data.accounts){
                            if (data.accounts[key].email==json.request[0]){
                                ws.send(JSON.stringify(new Request({type:SYSTEM_MESSAGE, request:'Account already exist'})));
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist){
                            console.log("New registration " + json.request[0]);
                            let accountId = data.getId('account');
                            data.accounts[accountId] = new Account(accountId, json.request[0], json.request[1]);
                            data.createCharacter(accountId, 10, 10);
                        }
                    }
                    break;
                }
            }
		});

		ws.on('close', function(){
			closeHandler(data, ws.id);
		})

    });
}
function setCharacterOnline(data, accountId){
	for (let key in data.characters){
		if (data.characters[key].accountId===accountId){
            data.characters[key].isOnline = true;
            return data.characters[key].id;
		}
	}
    return null;
}
module.exports = server;