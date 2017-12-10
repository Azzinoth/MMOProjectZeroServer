const stackUtils = require('../../gameData/inventory/stackUtils');
const Request = require('../Request');
const requestInventory = require('../requestInventory');
const visibleObjects = require('../../gameData/visibleObjects');
const craftItem = require('../../gameData/craft/craftItem');
const FiredAmmo = require('../../gameData/FiredAmmo');
const cellUtils = require('../../gameData/map/cellUtils');
const sender = require('../sender');
const accuracyShot = require('../../gameData/accuracyShot');
const viewDistance = 20;
const width = 48*3;
const height = 48*3;
const {
	SESSION_ID,
    HUMAN_DATA,
	HUMAN_MOVE,
	HUMAN_UPDATE,
	HUMAN_DELETE,
	GATHER,
	MAP_OBJECT,
	ERROR,
	INVENTORY_CHANGE,
	CRAFT,
    ITEMS_LIST,
    PLACE_ON_MAP,
	SYSTEM_MESSAGE,
    SHOT,
	PUT_ON,
	PUT_OFF
} = require('../../constants').messageTypes;

function messageHandler (data, message, personId){
    let clients = data.clients;
    let characters = data.characters;
    let inventories = data.inventories;
    let stacks = data.stacks;
    let cellsMap = data.getMap();
    let items = data.items;
    let mapItems = data.mapItems;
	let json = JSON.parse(message);
	let column;
	let row;
	let request;
    if (json.type!==HUMAN_UPDATE&&json.type!==HUMAN_MOVE) console.log(message);
	switch (json.type){

		case HUMAN_MOVE:{
			column = characters[personId].column;
			row = characters[personId].row;
			let toTop = parseInt(json.request.top);
			let toLeft = parseInt(json.request.left);
			
			let toRow = Math.floor(toTop / 64);
			let toColumn = Math.floor(toLeft / 64);
			if (toColumn!==column||toRow!==row){
	
				if (cellUtils.isMovableCell(cellsMap, row, toRow, column, toColumn)){
					
					characters[personId].top=toTop;
					characters[personId].left=toLeft;
					characters[personId].column=toColumn;
					characters[personId].row=toRow;
                    // request = new Request({type:HUMAN_MOVE, request:characters[personId]});
                    // sender.sendAllExcept(clients, request, personId);
                    visibleObjects.findCharacters(characters, viewDistance, personId);
					let visible = visibleObjects.surroundObjects(characters[personId].column, characters[personId].row, viewDistance, width, height, cellsMap);
					request = new Request({type:MAP_OBJECT, request:visible});
                    sender.sendToClient(personId, request)

				}else{
					request = new Request({type:HUMAN_MOVE, request:characters[personId]});
                    sender.sendToClient(personId, request)
				}
			}else{									
				characters[personId].top=toTop;
				characters[personId].left=toLeft;
                visibleObjects.findCharacters(characters, viewDistance, personId);
                // request = new Request({type:HUMAN_MOVE, request:characters[personId]});
                // sender.sendAllExcept(clients, request, personId);
			}
			
		}
			break;
        case GATHER:{
			
            column = characters[personId].column;
            row = characters[personId].row;
            let toColumn = json.request.column;
            let toRow = json.request.row;
            // let isGather;
			// let changedInventory;
			
            if (cellUtils.isGatheredCell(cellsMap, row, column, toRow, toColumn, mapItems)){
                let mapItemId = cellsMap[toColumn][toRow].objectId;
                let itemId = mapItems[mapItemId].objectId;

				let reqStacks = stackUtils.addStack(inventories[characters[personId].inventoryId], stacks, itemId, 6, items);
				if (reqStacks!=null){
                    cellsMap[toColumn][toRow].objectId=null;
                    cellsMap[toColumn][toRow].movable=true;
					//delete reqStacks.isFull;
                    request = requestInventory (characters[personId].inventoryId, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
					clients[personId].send(JSON.stringify(request));
					
					request = new Request({type:GATHER, request:true});
					clients[personId].send(JSON.stringify(request));		
					request = new Request({type:GATHER, request:cellsMap[toColumn][toRow]});
					for (let key in clients) {
						if (+key!==personId){
							clients[key].send(JSON.stringify(request));
						}
					}
					let tmpArray = [cellsMap[toColumn][toRow]];
					request = new Request({type:MAP_OBJECT, request:tmpArray});
					sender.sendToAll(clients, request);
				}else{
					request = new Request({type:ERROR, request:'001'});
					clients[personId].send(JSON.stringify(request));
				}
			}else{
                request = new Request({type:GATHER, request:false});
                clients[personId].send(JSON.stringify(request));
			}
		}
        	break;
		case HUMAN_UPDATE:{
			request = new Request({type:HUMAN_MOVE, request:characters[personId]});
			clients[personId].send(JSON.stringify(request));
			
		}
		break;
		case INVENTORY_CHANGE:{
			let indexFrom = json.request[0];
			let indexTo = json.request[1];
			let swaps = stackUtils.swapStack (inventories[characters[personId].inventoryId], stacks, indexFrom, indexTo, items);
            if (swaps!==1)request = requestInventory (characters[personId].inventoryId, swaps, Object.getOwnPropertyNames(swaps).length);
			clients[personId].send(JSON.stringify(request));
		}
		break;
		case CRAFT:{
			let craftId = +json.request;
			let craftRecipes = characters[personId].craftRecipesId;

			for(let i=0; i<craftRecipes.length; i++){
				if (craftRecipes[i]===craftId){
					let invent = craftItem(inventories[characters[personId].inventoryId], stacks, data.recipeList[craftRecipes[i]], items);
					if (invent!==1||invent!==2||invent!==3){
					    request = requestInventory (characters[personId].inventoryId, invent, Object.getOwnPropertyNames(invent).length);
					    clients[personId].send(JSON.stringify(request));
                    }
				}
			}

			
		}
		break;
        case PLACE_ON_MAP:{
            let itemId = json.request[0];
            if (items[itemId].type!=='buildingPart') break;
            column = json.request[1][0];
            row = json.request[1][1];
			if (cellUtils.isBuilderCell(cellsMap, column, row)){
				let findStacks = stackUtils.findItems(itemId, 1, inventories[characters[personId].inventoryId], stacks);
				if (findStacks!==null){
					for	(let key in findStacks){
						if (findStacks[key].size>1){
                            findStacks[key].size -=1;
                        }else{
							//stacks[key]=null;
                            findStacks[key].itemId = null;
                            findStacks[key].size = null;
						}
					}
                    cellsMap[column][row].movable = false;
                    cellsMap[column][row].objectId = itemId;
                    let result = [cellsMap[column][row]];
					request = new Request({type:MAP_OBJECT, request:result});
					sender.sendToAll(clients, request);

                    request = requestInventory(characters[personId].inventoryId, findStacks, Object.getOwnPropertyNames(findStacks).length);
                    sender.sendToClient(personId, request);
				}
			}
        }
            break;
        case SHOT: {
            let firedAmmos = data.firedAmmos;
			let indexFiredAmmo;

            for (let i = 0; i<firedAmmos.length; i++){
				if (!firedAmmos[i].active){
                    firedAmmos[i].characterId = personId;
                    firedAmmos[i].speedPerSec = 750;
                    firedAmmos[i].initialX = characters[personId].left-5;
                    firedAmmos[i].initialY = characters[personId].top-32;
                    let accuracyShot1=accuracyShot.getAccuracy(15, firedAmmos[i].initialX, firedAmmos[i].initialY, json.request[0], json.request[1]);
                    firedAmmos[i].finalX = parseInt(accuracyShot1[0]);
                    firedAmmos[i].finalY = parseInt(accuracyShot1[1]);
                    firedAmmos[i].distToFinal = Math.sqrt(Math.pow(firedAmmos[i].initialX - firedAmmos[i].finalX, 2) + Math.pow(firedAmmos[i].initialY - firedAmmos[i].finalY, 2));
                    firedAmmos[i].timeToFinal = firedAmmos[i].distToFinal / firedAmmos[i].speedPerSec * 1000;
                    firedAmmos[i].maxTime = 1000 / firedAmmos[i].speedPerSec * 1000;
                    let time = new Date().getTime();
                    firedAmmos[i].currentTick = time;
                    firedAmmos[i].lastTick = time;
                    firedAmmos[i].timePassed = 0;
                    firedAmmos[i].active = true;
                    indexFiredAmmo = i;
                    break;
				}
				if (i===data.firedAmmos.length-1){
                    let ammo = new FiredAmmo();
                    ammo.characterId = personId;
                    ammo.speedPerSec = 750;
                    ammo.initialX = characters[personId].left-5;
                    ammo.initialY = characters[personId].top-32;
                    let accuracyShot1=accuracyShot.getAccuracy(15, ammo.initialX, ammo.initialY, json.request[0], json.request[1]);
                    ammo.finalX = parseInt(accuracyShot1[0]);
                    ammo.finalY = parseInt(accuracyShot1[1]);
                    ammo.distToFinal = Math.sqrt(Math.pow(ammo.initialX - ammo.finalX, 2) + Math.pow(ammo.initialY - ammo.finalY, 2));
                    ammo.timeToFinal = ammo.distToFinal / ammo.speedPerSec * 1000;
                    ammo.active = true;
                    indexFiredAmmo = data.firedAmmos.length;
                    data.firedAmmos.push(ammo);
                    break;
				}
            }

            sender.sendToAll(clients, new Request({type:SHOT, request:data.firedAmmos[indexFiredAmmo]}));
            break;
        }
	}
}
module.exports = messageHandler;