const Request = require('./network/Request');
const sender = require('./network/sender');
const collision = require('./utils/collision');
const getTime = require('./utils/getTime');
const visibleObjects = require('./gameData/visibleObjects');
const cellUtils = require('./gameData/map/cellUtils');
const initialize = require('./network/initialize');
const {
    HIT,
    NPC_MOVE,
    NPC_DATA,
    SHOT,
    HUMAN_MOVE,
    MAP_OBJECT,
    DIE
} = require('./constants').messageTypes;
let startTime;
let finishTime;
let frameTime;
function mainLoop (data){
	setInterval(function(){
        startTime = getTime.getTimeInMs();
        moveCharacters(data);
        fire(data);
        moveNpc(data);
        // for (let i=0; i<7000; i++){
        //     moveNpc(data);
        // }
        finishTime= getTime.getTimeInMs();
        frameTime=finishTime-startTime;

        if (frameTime>20){
            console.log('Frame: '+frameTime);
        }
	}, 17);
}
function moveCharacters(data) {
    let request;
    for (let key in data.characters){
        if (data.characters[key].isOnline&&data.characters[key].direction!==-1){
            let column = data.characters[key].column;
            let row = data.characters[key].row;
            let changedCell = data.characters[key].getNewCoord();
            let toColumn = Math.floor(changedCell[0]/64);
            let toRow = Math.floor(changedCell[1]/64);
            if (column!==toColumn||row!==toRow){
                if (cellUtils.isMovableCell(data.getMap(), row, toRow, column, toColumn)){
                    let visible = visibleObjects.surroundObjects(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, 48*3, 48*3, data.getMap());
                    let result = [];
                    for(let i=0; i<visible.length; i++){
                        result.push(new Array(visible[i].column, visible[i].row, visible[i].objectId));
                    }
                    request = new Request({type:MAP_OBJECT, request:result});
                    sender.sendToClient(data.characters[key].accountId, request);
                    let surrAnimals = visibleObjects.surroundAnimals(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, data.animals);
                    request = new Request({type:NPC_DATA, request:surrAnimals});
                    sender.sendToClient(data.characters[key].accountId, request);

                    let founderCharacters = visibleObjects.findCharacters(data.characters, data.characters[key].viewDistance, key);
                    let resultChatacter=null;
                    for (let i=0; i<founderCharacters.length; i++){
                        resultChatacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
                        sender.sendToClient(data.characters[key].accountId, new Request({type:HUMAN_MOVE, request:resultChatacter}));
                        resultChatacter = new Array(data.characters[key].id, data.characters[key].column, data.characters[key].row, data.characters[key].left, data.characters[key].top, data.characters[key].direction);
                        sender.sendToClient(data.characters[founderCharacters[i].id].accountId, new Request({type:HUMAN_MOVE, request:resultChatacter}));
                    }

                }else continue;
            }
            //data.characters[key].lastTick = getTime.getTimeInMs();
            data.characters[key].move(changedCell[0], changedCell[1], toColumn, toRow);

        }

    }
}

function moveNpc(data) {
    let result = [];
    for (let key in data.animals){
        if (!data.animals[key].isAlive){
            data.animals[key].timeToResurrection--;
            if (data.animals[key].timeToResurrection<=0){
                data.animals[key].resurrect(data.zones);
            }
            continue;
        }
        //result.push(new Array(data.animals[key].location.left, data.animals[key].location.top));
        if (data.animals[key].zone===null){
            data.animals[key].randZone();
        }
        if (data.animals[key].destination===null){
            data.animals[key].chooseNewDestination(data.getMap(), data.zones);
        }
        if (data.animals[key].destination!==null&&data.animals[key].path.length===0){
            data.animals[key].findPath(data.getMap());
            if ( data.animals[key].findPath.length>0){
                result=new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row);
                sender.sendByViewDistance(data.characters, new Request({type: NPC_MOVE, request:result}), data.animals[key].location.column, data.animals[key].location.row);
            }
        }
        if (data.animals[key].path.length > 0 && !data.animals[key].isMovement) {
            data.animals[key].initMovement();

        }
        let fromColumn = data.animals[key].location.column;
        let fromRow = data.animals[key].location.row;
        let changeCell = data.animals[key].move();
        if (changeCell===1){
            for (let key2 in data.characters) {
                if (data.characters[key2].isOnline){
                    let isNewVisible = visibleObjects.isNewObjectInViewDistance(data.characters[key2].left, data.characters[key2].top, fromColumn * 64, fromRow * 64, data.animals[key].location.left, data.animals[key].location.top, data.characters[key2].viewDistance);
                    if (isNewVisible) {
                        result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top));
                        sender.sendToClient(data.characters[key2].accountId, new Request({
                            type: NPC_DATA,
                            request: result
                        }));
                        result = [];
                    }
                }
            }
        }
    }
    // if (result.length>0)
}
function fire(data){
    let firedAmmos = data.firedAmmos;
    for (let i = 0; i< firedAmmos.length; i++){
        if (firedAmmos[i].active){
            let time = new Date().getTime();
            firedAmmos[i].currentTick = time;
            firedAmmos[i].timePassed += firedAmmos[i].currentTick - firedAmmos[i].lastTick;
            firedAmmos[i].lastTick = time;

            let fromColumn = Math.floor(firedAmmos[i].x/64);
            let fromRow = Math.floor(firedAmmos[i].y/64);
            firedAmmos[i].x = parseInt(firedAmmos[i].initialX + (firedAmmos[i].finalX - firedAmmos[i].initialX) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
            firedAmmos[i].y = parseInt(firedAmmos[i].initialY + (firedAmmos[i].finalY - firedAmmos[i].initialY) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
            let toColumn = Math.floor(firedAmmos[i].x/64);
            let toRow = Math.floor(firedAmmos[i].y/64);
            for (let key in data.characters){
                if (data.characters[key].isOnline&&key!=data.firedAmmos[i].characterId){
                    let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.characters[key].left-32, data.characters[key].top-64, 32, 64);//shoot from center
                    if (isHit){
                        if (data.characters[key].health>1){
                            let damage = 2;
                            data.characters[key].health-=damage;
                            sender.sendByViewDistance(data.characters, new Request ({type:HIT, request:new Array(0, data.characters[key].id, damage)}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                        }else {
                            data.characters[key].dead();
                            data.inventories[data.characters[key].inventoryId].clear(data.stacks);
                            data.inventories[data.characters[key].armorInventoryId].clear(data.stacks);
                            data.inventories[data.characters[key].hotBarId].clear(data.stacks);
                            sender.sendToAll(new Request ({type:DIE, request:new Array(0, data.characters[key].id)}));
                            initialize(data, data.characters[key].accountId);

                        }

                        data.firedAmmos[i].active = false;
                        break;
                    }
                }

            }
            for (let key in data.animals){
                if (data.firedAmmos[i].active&&data.animals[key].isAlive){
                    let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.animals[key].location.left, data.animals[key].location.top, 40, 40);
                    if (isHit){
                        if (data.animals[key].health>0){
                            data.firedAmmos[i].active = false;
                            let damage = 2;
                            data.animals[key].health-=damage;
                            sender.sendByViewDistance(data.characters, new Request ({type:HIT, request:new Array(1, data.animals[key].id, damage)}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                        }else{
                            data.animals[key].dead();
                            data.firedAmmos[i].active = false;
                            sender.sendByViewDistance(data.characters, new Request ({type:DIE, request:new Array(1, data.animals[key].id)}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                        }
                        break;
                    }

                }
            }

            if(fromColumn!=toColumn||fromRow!==toRow){
                if (!data.getMap()[toColumn][toRow].movable){
                    data.firedAmmos[i].active = false;
                }
            }


            if (firedAmmos[i].timePassed > firedAmmos[i].maxTime) {
                firedAmmos[i].active = false;
            }
        }
    }
}
module.exports = mainLoop;