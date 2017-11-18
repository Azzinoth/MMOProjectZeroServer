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
	CRAFT : 9
}

const WebSocketServer = new require('ws');
const distanceVeiw = 20;
// ???????????? ???????
let clients = {};
let humans = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let idHuman = 0;
let idInventory = 0;
let idStack = 0;
// WebSocket-?????? ?? ????? 8081
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
let fieldMatrix=new Array(gameBoardHeight);
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
mapItems[1] = new mapItem.MapItem({id:1, type:'rock', size:5});
mapItems[2] = new mapItem.MapItem({id:2, type:'wood', size:5});
items[1] = new item.Item({id:1, type:'rock', stackSize:20});
items[2] = new item.Item({id:2, type:'wood', stackSize:20});

let arrayIngridients = new Array(new craft.Ingredient(2, 6));
let craftRecipe1 = new craft.CraftRecipe(1, "Wood wall", arrayIngridients);
let arrayIngridients2 = new Array(new craft.Ingredient(1, 15));
let craftRecipe2 = new craft.CraftRecipe(2, "Stone wall", arrayIngridients2);
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
				let reqStacks = addStack(ws.id, idItem, 6);
				if (reqStacks!=null){
					let reqInventory = {idInventory:humans[ws.id].idInventory, stacks:reqStacks, length:Object.getOwnPropertyNames(reqStacks).length};
					changedInventory = new requestField.Request({type:MSG_TYPES.INVENTORY_CHANGE, request:reqInventory});
					clients[ws.id].send(JSON.stringify(changedInventory));
					
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
			let reqInventory = {idInventory:humans[ws.id].idInventory, stacks:swaps, length:Object.getOwnPropertyNames(swaps).length};
			let changedInventory = new requestField.Request({type:MSG_TYPES.INVENTORY_CHANGE, request:reqInventory});
			clients[ws.id].send(JSON.stringify(changedInventory));
		}
		break;
		case MSG_TYPES.CRAFT:{
			let craftId = json.request;
			let categ = humans[ws.id].craftList.categories;
			for (let i =0; i<categ.length; i++){			
				for(let j=0; j<categ[i].craftRecipes.length; j++){
					if (categ[i].craftRecipes[j].craftRecipeId===+craftId){	
						let invent = deleteInventoryItems(categ[i].craftRecipes[j].ingredients, ws.id);
						let changedInventory = {idInventory:humans[ws.id].idInventory, stacks:invent, length:Object.getOwnPropertyNames(invent).length};
						let request = new requestField.Request({type:MSG_TYPES.INVENTORY_CHANGE, request:changedInventory});
						clients[ws.id].send(JSON.stringify(request));
					}
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
function addStack (idHuman, idItem, size){
	let array={};
	let inventory = inventories[humans[idHuman].idInventory];
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
				inventory.stacks[i] =newStack;
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
function deleteInventoryItems(arrayIngr, idHuman){
	let stacks = inventories[humans[idHuman].idInventory].stacks;
	let tmpStacks = [stacks.length];
	let isEnought = false;
	let isFullTmpStack = false;
	let result = {};
	let isBreak;
	for (let i = 0; i<arrayIngr.length; i++){
		let indexStack = [];
		for (let j = 0; j<stacks.length; j++){
			if (!isFullTmpStack)tmpStacks[j] = stacks[j];
			if (stacks[j]!==undefined && stacks[j]!==null && stacks[j].idItem===arrayIngr[i].itemId){
				indexStack.push(stacks[j]);
			}
		}
		isFullTmpStack = true;
		new quickSort.QuickSort(indexStack);
		let price = arrayIngr[i].amount;
		isBreak = false;
		for(let j =0; j<indexStack.length;j++){
			for(k=0; k<tmpStacks.length;k++){
				if (tmpStacks[k]!==undefined && tmpStacks[k]!==null && indexStack[j].id===tmpStacks[k].id){
						console.log(tmpStacks[k].size);
					if (price<tmpStacks[k].size){	
						console.log('two' + price);					
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
						console.log('one' + price);
						tmpStacks[k] = null;
						result[k] = tmpStacks[k];
						
					}
				}
			}
			if (isBreak) break;
		}
		if (!isEnought) return result = {};
	}
	inventories[humans[idHuman].idInventory].stacks = tmpStacks;
	return result;
}