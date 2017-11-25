const stackUtils = require('../../gameData/inventory/stackUtils');
const Request = require('../Request');
const requestInventory = require('../requestInventory');
const surroundObjects = require('../../gameData/person/utils/surroundObjects');
const craftItem = require('../../gameData/craft/craftItem');
const cellUtils = require('../../gameData/map/cellUtils');
const sender = require('../sender');
const viewDistance = 20;
const width = 48;
const height = 48;
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
	SYSTEM_MESSAGE
} = require('../../constants').messageTypes;

function messageHandler (message, clients, characters, personId, inventories, cellsMap, items){
	let json = JSON.parse(message);
	let column;
	let row;
	let request;
	switch (json.type){
		case HUMAN_MOVE:{
			column = characters[personId].column;
			row = characters[personId].row;
			let fromTop = characters[personId].top;
			let fromLeft = characters[personId].left;
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
					request = new Request({type:HUMAN_MOVE, request:characters[personId]});
					
					for (let key in clients) {
						if (+key!==personId){
							clients[key].send(JSON.stringify(request));
						}						
					}
					
					let visibleObjects = surroundObjects(characters[personId].column, characters[personId].row, viewDistance, width, height, cellsMap);
					request = new Request({type:MAP_OBJECT, request:visibleObjects});
					clients[personId].send(JSON.stringify(request));
				}else{
					request = new Request({type:HUMAN_MOVE, request:characters[personId]});
					clients[personId].send(JSON.stringify(request));
				}
			}else{									
				characters[personId].top=toTop;
				characters[personId].left=toLeft;
				request = new Request({type:HUMAN_MOVE, request:characters[personId]});
				for (let key in clients) {
					if (+key!==personId){
						clients[key].send(JSON.stringify(request));
					}					
				}
			}
			
		}
			break;
        case GATHER:{
			
            column = characters[personId].column;
            row = characters[personId].row;
            let toColumn = json.request.column;
            let toRow = json.request.row;
            let idItem = cellsMap[toColumn][toRow].idObject;
            let isGather;
			let changedInventory;
			
            if (cellUtils.isGatheredCell(cellsMap, row, column, toRow, toColumn)){				
				let reqStacks = stackUtils.addStack(inventories[characters[personId].idInventory], idItem, 6, items);
				if (reqStacks!=null){
					delete reqStacks.isFull;
                    request = requestInventory (characters[personId].idInventory, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
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
			let swaps = stackUtils.swapStack (inventories[characters[personId].idInventory], personId, indexFrom, indexTo, items);
            request = requestInventory (characters[personId].idInventory, swaps, Object.getOwnPropertyNames(swaps).length);
			clients[personId].send(JSON.stringify(request));
		}
		break;
		case CRAFT:{
			let craftId = +json.request;
			let categ = characters[personId].craftList.categories;
			for (let i =0; i<categ.length; i++){			
				for(let j=0; j<categ[i].craftRecipes.length; j++){
					if (categ[i].craftRecipes[j].id===craftId){
						let invent = craftItem(inventories[characters[personId].idInventory], categ[i].craftRecipes[j], personId, items);
                        request = requestInventory (characters[personId].idInventory, invent, Object.getOwnPropertyNames(invent).length);
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
				let stacks = stackUtils.findItems(itemId, 1, inventories[characters[personId].idInventory]);
				if (stacks!==null){
					for	(let key in stacks){
						if (stacks[key].size>1){
                            inventories[characters[personId].idInventory].stacks[key].size -=1;
                        }else{
							inventories[characters[personId].idInventory].stacks[key]=null;
							stacks[key] = null;
                        }
					}
                    cellsMap[column][row].movable = false;
                    cellsMap[column][row].idObject = itemId;
                    let result = [cellsMap[column][row]];
					request = new Request({type:MAP_OBJECT, request:result});
					sender.sendToAll(clients, request);

                    request = requestInventory(characters[personId].idInventory, stacks, Object.getOwnPropertyNames(stacks).length);
                    clients[personId].send(JSON.stringify(request));
				}
			}
        }
            break;
	}
}
module.exports = messageHandler;