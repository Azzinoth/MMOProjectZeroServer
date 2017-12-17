const stackUtils = require('../../gameData/inventory/stackUtils');
const Request = require('../Request');
const visibleObjects = require('../../gameData/visibleObjects');
const craftItem = require('../../gameData/craft/craftItem');
const Weapon = require('../../gameData/item/unique/Weapon');
const cellUtils = require('../../gameData/map/cellUtils');
const sender = require('../sender');
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
    NPC_MOVE,
	HOT_BAR_CHANGE,
    HOT_BAR_CELL_ACTIVATE,
    NPC_DATA,
    RELOAD_WEAPON
} = require('../../constants').messageTypes;

function messageHandler (data, message, personId){
    let clients = data.clients;
    let characters = data.characters;
    let inventories = data.inventories;
    let stacks = data.stacks;
    let cellsMap = data.getMap();
    let items = data.items;
    // let items = data.items;
    // let commonItems = data.commonItems;
    let animals = data.animals;
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
                    sender.sendToClient(personId, request);
                    let surrAnimals = visibleObjects.surroundAnimals(characters[personId].column, characters[personId].row, viewDistance, animals);
                    request = new Request({type:NPC_DATA, request:surrAnimals});
                    sender.sendToClient(personId, request);

				}else{
					request = new Request({type:HUMAN_MOVE, request:characters[personId]});
                    sender.sendToClient(personId, request)
				}
			}else{									
				characters[personId].top=toTop;
				characters[personId].left=toLeft;
                //visibleObjects.findCharacters(characters, viewDistance, personId);
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
                let typeId = mapItems[mapItemId].objectId;

				let reqStacks = stackUtils.addStack(inventories[characters[personId].inventoryId], stacks, typeId, 6);
				if (reqStacks!=null){
                    cellsMap[toColumn][toRow].objectId=null;
                    cellsMap[toColumn][toRow].movable=true;
					//delete reqStacks.isFull;
                    // request = requestInventory (characters[personId].inventoryId, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
                    request = new Request({type:INVENTORY_CHANGE, request:reqStacks});
                    sender.sendToClient(personId, request);
					
					request = new Request({type:GATHER, request:true});
                    sender.sendToClient(personId, request);
					request = new Request({type:GATHER, request:cellsMap[toColumn][toRow]});
                    sender.sendAllExcept(clients, request, personId);
					let tmpArray = [cellsMap[toColumn][toRow]];
					request = new Request({type:MAP_OBJECT, request:tmpArray});
					sender.sendToAll(clients, request);
				}else{
					request = new Request({type:ERROR, request:'001'});
                    sender.sendToClient(personId, request);
				}
			}else{
                request = new Request({type:GATHER, request:false});
                sender.sendToClient(personId, request);
			}
		}
        	break;
		case HUMAN_UPDATE:{
			request = new Request({type:HUMAN_MOVE, request:characters[personId]});
            sender.sendToClient(personId, request);
			
		}
		break;
		case INVENTORY_CHANGE:{
			let indexFrom = json.request[0];
			let indexTo = json.request[1];

            if (stacks[indexFrom].inventoryId!==characters[personId].inventoryId&&stacks[indexFrom].inventoryId!==characters[personId].hotBarId) break;
            if (indexTo!==-1&&stacks[indexTo].inventoryId!==characters[personId].inventoryId&&stacks[indexTo].inventoryId!==characters[personId].hotBarId) break;

            let item = stacks[indexFrom].item;
            if (item===null)break;
            let toInventory = null;
            if (indexTo!==-1) toInventory = inventories[stacks[indexTo].inventoryId];

			let swaps = stackUtils.swapStack (inventories[stacks[indexFrom].inventoryId], toInventory, stacks, indexFrom, indexTo);

            if (swaps!==1){
            	request = new Request({type:INVENTORY_CHANGE, request:swaps});
                sender.sendToClient(personId, request);
            }
		}
		break;
		case CRAFT:{
			let craftId = +json.request;
			let craftRecipes = characters[personId].craftRecipesId;

			for(let i=0; i<craftRecipes.length; i++){
				if (craftRecipes[i]===craftId){
					let invent = craftItem(inventories[characters[personId].inventoryId], stacks, data.recipeList[craftRecipes[i]], items);
					if (invent!==1&&invent!==2&&invent!==3){
                        request = new Request({type:INVENTORY_CHANGE, request:invent});
                        sender.sendToClient(personId, request);
                    }
				}
			}

			
		}
		break;
        case PLACE_ON_MAP:{
            let stackId = json.request[0];

            column = json.request[1][0];
            row = json.request[1][1];
            let inventoryId = stacks[stackId].inventoryId;
            if (stacks[stackId].item===null||(characters[personId].inventoryId!==inventoryId&&characters[personId].hotBarId!==inventoryId)) break;
            if (stacks[stackId].item.typeName!=='buildingPart') break;
			let typeId = stacks[stackId].item.typeId;
            if (!cellUtils.isBuilderCell(cellsMap, column, row)) break;
            if (stacks[stackId].size>0)stacks[stackId].size--;
            // let findStacks = stackUtils.findItems(typeId, inventories, [characters[personId].hotBarId, characters[personId].inventoryId], stacks);
            //
            // if (findStacks[0]>=1){
            //     for	(let i = 0; i<findStacks[1].length; i++){
            //         if (findStacks[1][i].size>1){
            //             findStacks[1][i].size -=1;
            //         }else{
            //             //stacks[key]=null;
            //             findStacks[1][i].item = null;
            //             findStacks[1][i].size = null;
            //         }
            //     }
            // }
            cellsMap[column][row].movable = false;
            cellsMap[column][row].objectId = typeId;
            let result = [cellsMap[column][row]];
            request = new Request({type:MAP_OBJECT, request:result});
            sender.sendByViewDistance(characters, request, column, row);

            // request = requestInventory(characters[personId].inventoryId, findStacks);
            sender.sendToClient(personId, new Request({type:INVENTORY_CHANGE, request:new Array(stacks[stackId].size)}));


        }
            break;
        case SHOT: {
            let toX = json.request[0];
            let toY = json.request[1];
            let firedAmmos = data.firedAmmos;
			if (characters[personId].activeHotBarCell===null||stacks[characters[personId].activeHotBarCell].item===null)break;
			let stackId = characters[personId].activeHotBarCell;
			if (stacks[stackId].item.typeName!=='weapon')break;


			if (stacks[stackId].item.isReloaded&&stacks[stackId].item.currentMagazine===0){
                let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
                let findAmmo = stackUtils.findItems(stacks[stackId].item.ammoId,inventories, new Array(characters[personId].hotBarId, characters[personId].inventoryId), stacks);
                if (findAmmo[0]==0)break;
                if (findAmmo[0]<quantity)quantity = findAmmo[0];
                let removeItems = stackUtils.removeItems(quantity, findAmmo[1]);
                stacks[stackId].item.reloadWeapon(quantity);
                sender.sendToClient(personId, new Request({type:INVENTORY_CHANGE, request:removeItems}));
                break;
            }
            let firedAmmo = stacks[stackId].item.shot(firedAmmos, personId, characters[personId].left, characters[personId].top, toX, toY);

			let arr = [5];
            arr[0]=firedAmmo.characterId;
            arr[1]=firedAmmo.initialX;
            arr[2]=firedAmmo.initialY;
            arr[3]=firedAmmo.finalX;
            arr[4]=firedAmmo.finalY;
            sender.sendToAll(clients, new Request({type:SHOT, request:arr}));
            break;
        }
        case HOT_BAR_CHANGE: {
            let indexFrom = json.request[0];
            let indexTo = json.request[1];
            let item = stacks[inventories[characters[personId].inventoryId].stacks[indexFrom]].item;

            if (item===null)break;
            let swaps;
            if (indexTo==-1){
                swaps = stackUtils.swapStack (inventories[characters[personId].hotBarId], null, stacks, indexFrom, indexTo);
            }else{
                swaps = stackUtils.swapStack (inventories[characters[personId].inventoryId], inventories[characters[personId].hotBarId], stacks, indexFrom, indexTo);
			}

            if (swaps!==1){
                request = new Request({type:INVENTORY_CHANGE, request:swaps});
                sender.sendToClient(personId, request);
            }
        }
        break;
        case RELOAD_WEAPON: {
            if (characters[personId].activeHotBarCell===null||stacks[characters[personId].activeHotBarCell].item===null)break;
            let stackId = characters[personId].activeHotBarCell;
            if (stacks[stackId].item.typeName!=='weapon'||!stacks[stackId].item.isReloaded)break;
            let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
            if (quantity===0) break;
            let findAmmo = stackUtils.findItems(stacks[stackId].item.ammoId, inventories, new Array(characters[personId].hotBarId, characters[personId].inventoryId), stacks);
            if (findAmmo[0]==0)break;
            if (findAmmo[0]<quantity)quantity = findAmmo[0];
            let removeItems = stackUtils.removeItems(quantity, findAmmo[1]);
            stacks[stackId].item.reloadWeapon(quantity);
            sender.sendToClient(personId, new Request({type:INVENTORY_CHANGE, request:removeItems}));
        }
            break;
        case HOT_BAR_CELL_ACTIVATE: {
            let stackId = json.request;
            if (stacks[stackId].inventoryId!==characters[personId].hotBarId)break;
            characters[personId].activeHotBarCell = stackId;

        }
            break;
	}
}
module.exports = messageHandler;