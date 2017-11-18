MSG_TYPES = {
    SESSION_ID : 0,
    HUMAN_DATA : 1,
	HUMAN_MOVE : 2,
	HUMAN_UPDATE : 3,
	HUMAN_DELETE : 4,
	GATHER : 5,
	MAP_OBJECT : 6,
	ERROR : 7,
	INVENTORY_CHANGE : 8,
	CRAFT : 9,
    ITEMS_LIST : 10,
    PLACE_ON_MAP : 11,
	SYSTEM_MESSAGE : 12
}

const WebSocketServer = new require('ws');
const distanceVeiw = 20;

let clients = {};
let humans = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let idHuman = 0;
let idInventory = 0;
let idStack = 0;

const requestField = require('./request.js');
const field = require('./field.js');
const human = require('./human.js');
const item = require('./item.js');
const mapItem = require('./mapItem.js');
const stack = require('./stack.js');
const inventory = require('./inventory.js');
const craft = require('./craftRecipe.js');
const quickSort = require('./quickSort.js')
const gameBoardWidth = 50;
const gameBoardHeight = 50;
let fieldMatrix = new Array(gameBoardHeight);
for (let i = 0; i<gameBoardHeight; i++){
	fieldMatrix[i] = new Array(gameBoardWidth);
	for (let j = 0; j<gameBoardWidth; j++){
		fieldMatrix[i][j] = new field.Field({movable : true, column : i, row : j});
		if (Math.random()<0.25){
			fieldMatrix[i][j].idObject = 1;
			fieldMatrix[i][j].movable = false;
		}
	}
}
mapItems[1] = new mapItem.MapItem({id:1, name:'rock', size:5});
mapItems[2] = new mapItem.MapItem({id:2, name:'wood', size:5});
items[1] = new item.Item({id:1, name:'stone', type:'resource', stackSize:20});
items[2] = new item.Item({id:2, name:'wood', type:'resource', stackSize:20});
items[3] = new item.Item({id:3, name:'woodWall', type:'buildingPart', stackSize:20});
items[4] = new item.Item({id:4, name:'stoneWall', type:'buildingPart', stackSize:20});

let arrayIngridients = new Array(new craft.Ingredient(2, 6));
let craftRecipe1 = new craft.CraftRecipe(1, 3, "Wood wall", arrayIngridients, 1);
let arrayIngridients2 = new Array(new craft.Ingredient(1, 15));
let craftRecipe2 = new craft.CraftRecipe(2, 4, "Stone wall", arrayIngridients2, 1);
let categories = new craft.Category(1, "Building", new Array(craftRecipe1, craftRecipe2));
let craftList = new craft.CraftList(new Array(categories));
const webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {

	idHuman++;
	idInventory++;
	ws.id = idHuman;
	clients[ws.id] = ws;
	console.log("new connection " + ws.id);
	clients[idHuman].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.SESSION_ID, request:idHuman})));
	
	inventories[idInventory] = new inventory.Inventory({id:idInventory, size:24});
	humans[idHuman] = new human.Human({id:idHuman, idInventory:idInventory, isPlayer:true, column:10, row:10, health:3, strengh:1});
	humans[idHuman].craftList = craftList;
    clients[ws.id].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.ITEMS_LIST, request:items})));
    let myInventoryId = humans[ws.id].idInventory;
	let myRequest;
	for (let key in clients) {
		if (+key!==idHuman){
			myRequest = new requestField.Request ({type:MSG_TYPES.HUMAN_DATA, request:humans[idHuman]})
			clients[key].send(JSON.stringify(myRequest));	
		}
	}
	
	let nearbyObjects = visibleObjects(humans[idHuman].column, humans[idHuman].row, distanceVeiw);
	clients[ws.id].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.MAP_OBJECT, request:nearbyObjects})));
	
	for (let key in humans) {
		myRequest = new requestField.Request ({type:MSG_TYPES.HUMAN_DATA, request:humans[key]})
		clients[idHuman].send(JSON.stringify(myRequest));		
	}
  
  
	ws.on('message', function(message) {
    let json = JSON.parse(message);
	switch (json.type){
		case MSG_TYPES.HUMAN_MOVE:{
			let fromColumn = humans[ws.id].column;
			let fromRow = humans[ws.id].row;
			let fromTop = humans[ws.id].top;
			let fromLeft = humans[ws.id].left;
			let toTop = parseInt(json.request.top);
			let toLeft = parseInt(json.request.left);
			
			let toRow = Math.floor(toTop / 64);
			let toColumn = Math.floor(toLeft / 64);
			if (toColumn!==fromColumn||toRow!==fromRow){
	
				let isMove;
				if (isMovableCell(fromRow, toRow, fromColumn, toColumn)){
					
					
					humans[ws.id].top=toTop;
					humans[ws.id].left=toLeft;
					humans[ws.id].column=toColumn;
					humans[ws.id].row=toRow;
					isMove = new requestField.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
					let nearbyObjects = visibleObjects(humans[ws.id].column, humans[ws.id].row, distanceVeiw);
					clients[ws.id].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.MAP_OBJECT, request:nearbyObjects})));
					for (let key in clients) {
						if (+key!==ws.id){
							clients[key].send(JSON.stringify(isMove));
						}						
					}
				}else{
					isMove = new requestField.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
					clients[ws.id].send(JSON.stringify(isMove));
				}
			}else{									
				humans[ws.id].top=toTop;
				humans[ws.id].left=toLeft;
				isMove = new requestField.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
				for (let key in clients) {
					if (+key!==ws.id){
						clients[key].send(JSON.stringify(isMove));
					}					
				}
			}
			
		}
			break;
        case MSG_TYPES.GATHER:{
			
            let fromColumn = humans[ws.id].column;
            let fromRow = humans[ws.id].row;
            let toColumn = json.request.column;
            let toRow = json.request.row;
            let idItem = fieldMatrix[toColumn][toRow].idObject;
            let isGather;
			let changedInventory;
			
            if (isGatheredCell(fromRow, fromColumn, toRow, toColumn)){				
				let reqStacks = addStack(inventories[myInventoryId], idItem, 6);
				if (reqStacks!=null){
					delete reqStacks.isFull;
                    let request = requestInventory (myInventoryId, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
					clients[ws.id].send(JSON.stringify(request));
					
					isGather = new requestField.Request({type:MSG_TYPES.GATHER, request:true});
					clients[ws.id].send(JSON.stringify(isGather));		
					isGather = new requestField.Request({type:MSG_TYPES.GATHER, request:fieldMatrix[toColumn][toRow]});
					for (let key in clients) {
						if (+key!==ws.id){
							clients[key].send(JSON.stringify(isGather));
						}
					}
					let tmpArray = [fieldMatrix[toColumn][toRow]];
					clients[ws.id].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.MAP_OBJECT, request:tmpArray})));
				}else{
					changedInventory = new requestField.Request({type:MSG_TYPES.ERROR, request:001});
					clients[ws.id].send(JSON.stringify(changedInventory));
				}
			}else{
                isGather = new requestField.Request({type:MSG_TYPES.GATHER, request:false});
                clients[ws.id].send(JSON.stringify(isGather));
			}
		}
        	break;
		case MSG_TYPES.HUMAN_UPDATE:{
			let req = new requestField.Request({type:MSG_TYPES.HUMAN_MOVE, request:humans[ws.id]});
			clients[ws.id].send(JSON.stringify(req));
			
		}
		break;
		case MSG_TYPES.INVENTORY_CHANGE:{
			let indexFrom = json.request[0];
			let indexTo = json.request[1];
			let swaps = swapStack (ws.id, indexFrom, indexTo);
            let request = requestInventory (myInventoryId, swaps, Object.getOwnPropertyNames(swaps).length);
			clients[ws.id].send(JSON.stringify(request));
		}
		break;
		case MSG_TYPES.CRAFT:{
			let craftId = +json.request;
			let categ = humans[ws.id].craftList.categories;
			for (let i =0; i<categ.length; i++){			
				for(let j=0; j<categ[i].craftRecipes.length; j++){
					if (categ[i].craftRecipes[j].id===craftId){
						let invent = craftItem(categ[i].craftRecipes[j], ws.id);
                        let request = requestInventory (myInventoryId, invent, Object.getOwnPropertyNames(invent).length);
						clients[ws.id].send(JSON.stringify(request));
					}
				}
			}
			
		}
		break;
        case MSG_TYPES.PLACE_ON_MAP:{
            let itemId = json.request[0];
            if (items[itemId].type!=='buildingPart') break;
            let column = json.request[1][0];
            let row = json.request[1][1];
			if (isBuilderCell(column, row)){
				let stacks = findItems(itemId, 1, inventories[myInventoryId]);
				if (stacks!==null){
					for	(let key in stacks){
						if (stacks[key].size>1){
                            inventories[myInventoryId].stacks[key].size -=1;
                        }else{
							inventories[myInventoryId].stacks[key]=null;
							stacks[key] = null;
                        }
					}
                    fieldMatrix[column][row].movable = false;
                    fieldMatrix[column][row].idObject = itemId;
                    let request = [fieldMatrix[column][row]];
                    clients[ws.id].send(JSON.stringify(new requestField.Request({type:MSG_TYPES.MAP_OBJECT, request:request})));

                    request = requestInventory(myInventoryId, stacks, Object.getOwnPropertyNames(stacks).length);
                    clients[ws.id].send(JSON.stringify(request));
				}
			}
        }
            break;
	}
});

	ws.on('close', function() {
		console.log('connection closed ' + ws.id);
		delete clients[ws.id];
		delete inventories[humans[ws.id].idInventory];
		let requestDelete = new requestField.Request({type:MSG_TYPES.HUMAN_DELETE, request:humans[ws.id]});
		
		for (let key in clients) {
			clients[key].send(JSON.stringify(requestDelete));			
		}
		delete humans[ws.id];
	});

});
function requestInventory(idInventory, stacks, lenthStacks){
    let reqInventory = {idInventory:idInventory, stacks:stacks, length:lenthStacks};
    return new requestField.Request({type:MSG_TYPES.INVENTORY_CHANGE, request:reqInventory});

}
function findItems(idItem, size, inventory){
	let result = {};
	for (let i =0; i<inventory.stacks.length; i++){
		if(inventory.stacks[i]!==undefined&&inventory.stacks[i]!==null&&inventory.stacks[i].idItem===idItem){
			if (inventory.stacks[i].size>=size){
                result[i] = inventory.stacks[i];
                return result;
			}else{
                size -= inventory.stacks[i].size;
                result[i] = inventory.stacks[i];
			}
        }
    }
    return null;
}
function isBuilderCell(column, row){
    if (fieldMatrix[column][row].idObject===undefined||fieldMatrix[column][row].idObject===null){
        return true;
    }else{
        return false;
    }
}
function isMovableCell(fromRow, toRow, fromColumn, toColumn){
	if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2){
		return fieldMatrix[toColumn][toRow].movable;
	}else{
		return false;
	}
}
function isGatheredCell(fromRow, fromColumn, toRow, toColumn){
    if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2&&fieldMatrix[toColumn][toRow].idObject!==null){
		fieldMatrix[toColumn][toRow].idObject=null;
		fieldMatrix[toColumn][toRow].movable = true;
		return true;
    }else{
        return false;
    }
}
function addStack (inventory, idItem, size){
	let array = new Object();
    array.isFull = false;
	//let inventory = inventories[humans[idHuman].idInventory];
	idStack++;

	for (let i = 0; i<inventory.stacks.length; i++){
		if (inventory.stacks[i]!==undefined&&inventory.stacks[i]!==null&&inventory.stacks[i].idItem===idItem&&items[idItem].stackSize>inventory.stacks[i].size){
			let quantity = inventory.stacks[i].size+size - items[idItem].stackSize;
			if (quantity<=0){
				inventory.stacks[i].size += size;
				array[i] = inventory.stacks[i];
				return array;
			}else {
				inventory.stacks[i].size = items[idItem].stackSize;
				size = quantity;
				array[i] = inventory.stacks[i];
			}
		}
	}
	let newStack;
	for (let i = 0; i<inventory.stacks.length; i++){
		if (inventory.stacks[i] ===undefined||inventory.stacks[i] === null){
			if (size<=items[idItem].stackSize){
				newStack = new stack.Stack({id:idStack, idItem:idItem, size:size});
				inventory.stacks[i] = newStack;
				array[i] = newStack;
				return array;
			}else{
				newStack = new stack.Stack({id:idStack, idItem:idItem, size:items[idItem].stackSize});
				inventory.stacks[i] =newStack;
				array[i] = newStack;
				size -= items[idItem].stackSize;
			}
			
		}
	}
    array[isFull] = true;
	return array;
}

function swapStack (idHuman, indexFrom, indexTo){
	let array={};
	if (indexFrom===indexTo) return array
	let inventory = inventories[humans[idHuman].idInventory];
	let idItem;
	if(inventory.stacks[indexFrom]!==null&&inventory.stacks[indexFrom]!==undefined){ 
		idItem = inventory.stacks[indexFrom].idItem;
	}else{
		return;
	}
	if (inventory.stacks[indexFrom].idItem!==undefined){
		if (indexTo===-1){			
			delete stacks[inventory.stacks[indexFrom].id];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;			
		}else if (inventory.stacks[indexTo]===undefined||inventory.stacks[indexTo]===null){
			array[indexTo]=inventory.stacks[indexFrom];
			inventory.stacks[indexTo]= inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;
		}else if (inventory.stacks[indexTo].idItem===idItem&&inventory.stacks[indexTo].size<items[idItem].stackSize){
			let quantity = items[idItem].stackSize - (inventory.stacks[indexTo].size + inventory.stacks[indexFrom].size);
			if (quantity>0){
				inventory.stacks[indexTo].size += inventory.stacks[indexFrom].size;
				inventory.stacks[indexFrom]=null;
				array[indexTo] = inventory.stacks[indexTo];
				array[indexFrom] = null;
			}else{
				inventory.stacks[indexTo].size = items[idItem].stackSize;
				inventory.stacks[indexFrom].size = Math.abs(quantity);
				array[indexTo] = inventory.stacks[indexTo];
				array[indexFrom] = inventory.stacks[indexFrom];
			}	
		} else if (inventory.stacks[indexTo].idItem!==idItem){
			let tmp = inventory.stacks[indexTo];
			inventory.stacks[indexTo] = inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = tmp;
			array[indexTo] = inventory.stacks[indexTo];
			array[indexFrom] = inventory.stacks[indexFrom];
		}		
	}
	return array;
}

function visibleObjects (startColumn, startRow, distance){
	let arrayObjects = [];
	for (let i =startColumn-Math.floor(distance/2); i<=startColumn+Math.floor(distance/2); i++){
		for (let j =startRow-Math.floor(distance/2); j<=startRow+Math.floor(distance/2); j++){
			if (i<gameBoardWidth&&j<gameBoardHeight&&i>=0&&j>=0&&fieldMatrix[i][j].idObject!=null){
				arrayObjects.push(fieldMatrix[i][j]);
			}		
		}
	}
	return arrayObjects;
}
function craftItem(recipe, idHuman){
	let stacks = inventories[humans[idHuman].idInventory].stacks;
	let tmpStacks = [stacks.length];
	let isEnought = false;
	let isFullTmpStack = false;
	let result = {};
	let isBreak;
	for (let i = 0; i<recipe.ingredients.length; i++){
		let indexStack = [];
		for (let j = 0; j<stacks.length; j++){
			if (!isFullTmpStack)tmpStacks[j] = stacks[j];
			if (stacks[j]!==undefined && stacks[j]!==null && stacks[j].idItem===recipe.ingredients[i].itemId){
				indexStack.push(stacks[j]);
			}
		}
		isFullTmpStack = true;
		new quickSort.QuickSort(indexStack);
		let price = recipe.ingredients[i].amount;
		isBreak = false;
		for(let j =0; j<indexStack.length;j++){
			for(k=0; k<tmpStacks.length;k++){
				if (tmpStacks[k]!==undefined && tmpStacks[k]!==null && indexStack[j].id===tmpStacks[k].id){
					if (price<tmpStacks[k].size){
						tmpStacks[k].size -= price;
						isEnought = true;
						result[k] = tmpStacks[k];
						isBreak=true;
						break;
					}else if (price===tmpStacks[k].size){
						tmpStacks[k] = null;
						isEnought = true;
						result[k] = tmpStacks[k];
						isBreak=true;
						break;
					}else{
						
						price -= tmpStacks[k].size;
						tmpStacks[k] = null;
						result[k] = tmpStacks[k];
						
					}
				}
			}
			if (isBreak) break;
		}
		if (!isEnought) return result = {};
	}

	// for(let i = 0; i<tmpStacks.length; i++) {
    	// if (tmpStacks[i]===undefined || tmpStacks[i]===null){
     //        idStack++;
     //        tmpStacks[i] = new stack.Stack ({id:idStack, idItem:recipe.craftedItemId, size:items[recipe.craftedItemId].stackSize});
     //        result[i] = tmpStacks[i];
     //        isInventoryFull = false;
     //        break;
	// 	}
	// }
	let tmpInventory = new inventory.Inventory({id:humans[idHuman].idInventory, size:inventories[humans[idHuman].idInventory].size});
    tmpInventory.stacks =tmpStacks ;
    let tmp = addStack(tmpInventory, recipe.craftedItemId, recipe.outputAmount);
    delete tmpInventory;
    if (tmp.isFull)return result = {};
    for (let key in tmp){
    	if (key!=='isFull'){
			tmpStacks[key] = tmp[key];
            result[key] = tmp[key];
        }
    }
	inventories[humans[idHuman].idInventory].stacks = tmpStacks;
	return result;
}