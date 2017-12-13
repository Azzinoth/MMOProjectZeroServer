const Request = require('./network/Request');
const sender = require('./network/sender');
const findPath = require('./utils/findPath');
const {
    HIT,
    NPC_MOVE
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
            if (data.animals[key].path.length>0){
                result=new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row);
                sender.sendToAll(data.clients, new Request({type: NPC_MOVE, request: result}));
            }
        }
        if (data.animals[key].path.length > 0 && !data.animals[key].isMovement) {
            data.animals[key].initMovement();

        }
        data.animals[key].move();
        

    }
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
            for (let key in characters){

                if (key!=firedAmmos[i].characterId&&
                    (characters[key].top>firedAmmos[i].y&&characters[key].top-characters[key].size<firedAmmos[i].y)&&
                    (characters[key].left>firedAmmos[i].x&&characters[key].left-characters[key].size/2<firedAmmos[i].x)){
                    sender.sendToAll(data.clients, new Request ({type:HIT, request:characters[key]}));
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