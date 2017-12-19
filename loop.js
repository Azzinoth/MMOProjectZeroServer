const Request = require('./network/Request');
const sender = require('./network/sender');
const collision = require('./utils/collision');
const visibleObjects = require('./gameData/visibleObjects');
const {
    HIT,
    NPC_MOVE,
    NPC_DATA,
    SHOT
} = require('./constants').messageTypes;

function mainLoop (data){
	setInterval(function(){
        fire(data);
        moveNpc(data);
	}, 17);
}
function moveNpc(data) {
    let result = [];
    for (let key in data.animals){

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
                // sender.sendToAll(null, new Request({type: NPC_MOVE, request:result}));
            }
        }
        if (data.animals[key].path.length > 0 && !data.animals[key].isMovement) {
            data.animals[key].initMovement();

        }
        let fromLeft = data.animals[key].location.left;
        let fromTop = data.animals[key].location.top;
        let fromColumn = data.animals[key].location.column;
        let fromRow = data.animals[key].location.row;
        let changeCell = data.animals[key].move();
        if (changeCell===1){
            for (let key2 in data.characters){
                let isNewVisible = visibleObjects.isNewObjectInViewDistance(data.characters[key2].left, data.characters[key2].top, fromColumn*64, fromRow*64, data.animals[key].location.left, data.animals[key].location.top, data.characters[key2].viewDistance);
                if (isNewVisible){
                    result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top));
                    sender.sendToClient(key2, new Request({type: NPC_DATA, request:result}));
                    result = [];
                }
            }
        }
        // result=new Array(2, data.animals[key].path, data.animals[key].location.left, data.animals[key].location.top);
        // sender.sendToAll(null, new Request({type: NPC_MOVE, request:result}), data.animals[key].location.column, data.animals[key].location.row);
    }
    // if (result.length>0)
    //     sender.sendToClient(key2, new Request({type: NPC_DATA, request:result}));
}
function fire(data){
    let firedAmmos = data.firedAmmos;
    for (let i = 0; i< firedAmmos.length; i++){
        if (firedAmmos[i].active){
            let time = new Date().getTime();
            firedAmmos[i].currentTick = time;
            firedAmmos[i].timePassed += firedAmmos[i].currentTick - firedAmmos[i].lastTick;
            firedAmmos[i].lastTick = time;

            firedAmmos[i].x = parseInt(firedAmmos[i].initialX + (firedAmmos[i].finalX - firedAmmos[i].initialX) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
            firedAmmos[i].y = parseInt(firedAmmos[i].initialY + (firedAmmos[i].finalY - firedAmmos[i].initialY) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));

            for (let key in data.characters){
                if (key!=data.firedAmmos[i].characterId){
                    let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.characters[key].left-32, data.characters[key].top-64, 32, 64);//shoot from center
                    if (isHit){
                        sender.sendByViewDistance(data.characters, new Request ({type:HIT, request:data.characters[key]}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                        data.firedAmmos[i].active = false;
                        break;
                    }
                }

            }
            for (let key in data.animals){
                if (data.firedAmmos[i].active){
                    let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.animals[key].location.left, data.animals[key].location.top, 40, 40);
                    if (isHit){
                        //console.log('hit');
                        //sender.sendByViewDistance(data.characters, new Request ({type:HIT, request:data.characters[key]}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                        data.firedAmmos[i].active = false;
                        break;
                    }

                }
            }

            if (firedAmmos[i].timePassed > firedAmmos[i].maxTime) {
                firedAmmos[i].active = false;
            }
        }
    }
}
module.exports = mainLoop;