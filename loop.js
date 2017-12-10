const Request = require('./network/Request');
const sender = require('./network/sender');
const {
    HIT
} = require('./constants').messageTypes;
function mainLoop (data){
    let count = 0;
	setInterval(function(){
        count++;
        fire(data);
        moveNpc(data);
	}, 17);
}
function moveNpc(data) {
    for (let key in data.animals){
        if (data.animals[key].destination===null){
            data.animals[key].chooseNewDestination();
            if (!cellsMap[data.animals[key].destination.column][data.animals[key].destination.row].movable){
                data.animals[key].destination=null;
            }
        }else{

        }
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