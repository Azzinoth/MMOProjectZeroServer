//const webSocketServer = require('./config');
const messageHandler = require('./handler/messageHandler');
const closeHandler = require('./handler/closeHandler');
//const data = require ('../gameData/data');
const sqlUtils = require ('../sql/utils');
const initialize = require ('./initialize');
const Request = require('./Request');
const Account = require('../Account');
const WebSocketServer = new require('ws');
const log = require('./log');
const MSG = require('../constants/messageTypes');
const STATUS = require('../constants/systemStatus');

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
                log(json.type, message, false, null);
                switch (json.type){
                    case MSG.AUTORIZATION:{
                        for (let key in data.accounts){
                            if (data.accounts[key].email===json.request[0]&&data.accounts[key].password===json.request[1]){
                                console.log("connected " + json.request[0]);
                                let character = data.accounts[key].getCharacter(data.characters);
                                if (character === null) break;
                                if (character.isOnline) {
                                  break;
                                }
                                ws.id = parseInt(key);
                                data.accounts[key].webSocket = ws;
                                character.isOnline = true;
                                characterId = character.id;
                                initialize(data, data.accounts[key].id);
                                isAutorizated = true;
                                break;
                            }
                        }
                      if (!isAutorizated)ws.send(JSON.stringify(new Request({type:MSG.SYSTEM_STATUS, request:STATUS.LOGIN_FAILED})));
                    }
                    break;
                    case MSG.REGISTRATION:{
                        let isExist = false;
                        for (let key in data.accounts){
                            if (data.accounts[key].email==json.request[0]){
                                ws.send(JSON.stringify(new Request({type:MSG.SYSTEM_STATUS, request:STATUS.LOGIN_EXIST})));
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist){
                            console.log("New registration " + json.request[0]);
                            let accountId = data.getId('account');
                            data.accounts[accountId] = new Account(accountId, json.request[0], json.request[1]);
                            data.createCharacter(accountId, 10, 10);
                            ws.send(JSON.stringify(new Request({type:MSG.SYSTEM_STATUS, request:STATUS.REG_SUCCESS})));
                        }
                    }
                    break;
                  case MSG.ISLOGIN_EXIST:{
                    let isExist = false;
                    for (let key in data.accounts){
                      if (data.accounts[key].email===json.request){
                        ws.send(JSON.stringify(new Request({type:MSG.SYSTEM_STATUS, request:STATUS.LOGIN_NOT_AVAILABLE})));
                        isExist = true;
                        break;
                      }
                    }
                    if (!isExist) ws.send(JSON.stringify(new Request({type:MSG.SYSTEM_STATUS, request:STATUS.LOGIN_AVAILABLE})));
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
module.exports = server;