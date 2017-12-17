function nearlyDistance(fromX, fromY, toX, toY){
    return Math.sqrt(Math.pow((Math.abs((fromX-toX))+1),2)+Math.pow((Math.abs((fromY-toY))+1),2));
}

module.exports = nearlyDistance;