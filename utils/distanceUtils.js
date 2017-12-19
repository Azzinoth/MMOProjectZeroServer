function nearlyDistance(fromX, fromY, toX, toY){
    return Math.sqrt(Math.pow((fromX-toX+1),2)+Math.pow((fromY-toY+1),2));
}
function distance(fromX, fromY, toX, toY){
    return Math.sqrt(Math.pow((fromX-toX),2)+Math.pow((fromY-toY),2));
}
exports.nearlyDistance = nearlyDistance;
exports.distance = distance;