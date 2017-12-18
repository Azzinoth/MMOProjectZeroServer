const Request = require('./network/Request');
const sender = require('./network/sender');
const findPath = require('./utils/findPath');
const nearlyDistance = require('./utils/nearlyDistance');
const {
    HIT,
    NPC_MOVE,
    NPC_DATA
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
        for (let i = 0; i< data.firedAmmos.length; i++){
            if (data.firedAmmos[i].active) {
                if (data.animals[key].location.left > data.firedAmmos[i].x && data.animals[key].location.left - 12 < data.firedAmmos[i].x &&
                    data.animals[key].location.top > data.firedAmmos[i].y && data.animals[key].location.top - 24 < data.firedAmmos[i].y) {
                    data.firedAmmos[i].active = false;
                    console.log('hit');
                }
            }
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
        let fromCol = data.animals[key].location.column;
        let fromRow = data.animals[key].location.row;
        let changeCell = data.animals[key].move();
        data.animals[key]
        if (changeCell===1){
            for (let key2 in data.characters){
                let beforeDistance = nearlyDistance(data.characters[key2].column, data.characters[key2].row, fromCol, fromRow);
                let distance = nearlyDistance(data.characters[key2].column, data.characters[key2].row, data.animals[key].location.column, data.animals[key].location.row);
                if (beforeDistance>distance&&distance<=data.characters[key2].viewDistance&&data.characters[key2].viewDistance-distance>1){
                    result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top));
                    sender.sendToClient(key2, new Request({type: NPC_DATA, request:result}));
                    result = [];
                }
            }
        }

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
                if (key!=firedAmmos[i].characterId&&
                    (data.characters[key].top>firedAmmos[i].y&&data.characters[key].top-data.characters[key].size<firedAmmos[i].y)&&
                    (data.characters[key].left>firedAmmos[i].x&&data.characters[key].left-data.characters[key].size/2<firedAmmos[i].x)){
                    sender.sendByViewDistance(data.characters, new Request ({type:HIT, request:data.characters[key]}), firedAmmos[i].x/64, firedAmmos[i].y/64);
                    firedAmmos[i].active = false;
                    break;
                }
            }

            if (firedAmmos[i].timePassed > firedAmmos[i].maxTime) {
                firedAmmos[i].active = false;
            }
        }
    }
}
module.exports = mainLoop;