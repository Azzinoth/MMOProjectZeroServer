const distanceUtils = require('./distanceUtils');
const constans = require('../constants/constans');
function algoritmA(currentLoc, target, map){
    let result = [];
    if (target.column<0||target.column>constans.mapWidth||target.row<0||target.row>constans.mapHeight) return result;
    if ((currentLoc.column===target.column&&currentLoc.row===target.row)||!map[target.column][target.row].movable){
        return result;
    }

    // let time = new Date().getTime();

    let closed = [];
    let open = [];
    let currentNode ={};
    currentNode.column = currentLoc.column;
    currentNode.row= currentLoc.row;

    let targetNode ={};
    targetNode.column=target.column;
    targetNode.row=target.row;

    open.push(currentNode);
    let from = {};
    let g ={};
    g[currentNode.column.toString()+'/'+currentNode.row.toString()] = 0;
    let f ={};
    f[currentNode.column.toString()+'/'+currentNode.row.toString()] = g[currentNode.column.toString()+'/'+currentNode.row.toString()]+distanceUtils.nearlyDistance(currentNode.column,currentNode.row, targetNode.column,target.row);
    while (open.length>0){
        currentNode = minF(f, open);
        if (currentNode.column === targetNode.column&&currentNode.row===targetNode.row){
            let current = target;
            result.unshift({column:current.column, row:current.row});
            while(true){
                if (from[current.column.toString()+'/'+current.row.toString()].column===currentLoc.column&&
                    from[current.column.toString()+'/'+current.row.toString()].row===currentLoc.row) break;
               result.unshift(from[current.column.toString()+'/'+current.row.toString()]);
               current = from[current.column.toString()+'/'+current.row.toString()];

            }
            // let time1 = new Date().getTime();
            // console.log(time1-time);
            return result;
        }
        for (let i=0; i<open.length; i++){
            if (currentNode.column === open[i].column&&currentNode.row===open[i].row)
                open.splice(i, 1);
        }
        closed.push(currentNode);
        let neibors = neighbours(currentNode, closed, map);
        let inOpen = false;
        for (let i=0; i<neibors.length; i++){
            inOpen = false;
            let tmpG =g[currentNode.column.toString()+'/'+currentNode.row.toString()]+1;
            for (let j=0; j<open.length; j++){
                if (open[j].column==neibors[i].column&&open[j].row==neibors[i].row){
                    inOpen = true;
                    break;
                }
            }
            if (!inOpen||tmpG<g[neibors[i].column.toString()+'/'+neibors[i].row.toString()]){
                from[neibors[i].column.toString()+'/'+neibors[i].row.toString()]=currentNode;
                g[neibors[i].column.toString()+'/'+neibors[i].row.toString()]=tmpG;
                f[neibors[i].column.toString()+'/'+neibors[i].row.toString()]=g[neibors[i].column.toString()+'/'+neibors[i].row.toString()]+distanceUtils.nearlyDistance(neibors[i].column, neibors[i].row, targetNode.column, targetNode.row);
            }
            if(!inOpen){
                open.push(neibors[i]);
            }
        }
    }
    return result;
}

function minF(f, open){
    let min = null;
    let result;
    for (let i=0; i<open.length; i++){
        if (min===null||f[open[i].column.toString()+'/'+open[i].row.toString()]<min){
            min = f[open[i].column.toString()+'/'+open[i].row.toString()];
            result = open[i];
        }
    }
    return result;
}
function neighbours(curr, closed, map){
    let size = map.length;
    let neighbors = [];
    let isAdd = true;
    if (size > curr.column+1&&size >curr.row+1&&map[curr.column+1][curr.row+1].movable){
        for(let i = 0; i<closed.length; i++){
            if (closed[i].column===curr.column+1&&closed[i].row===curr.row+1){
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column:curr.column + 1, row:curr.row + 1};
            neighbors.push(node);
        }//
    }
    isAdd = true;
    if (size > curr.column+1&&map[curr.column+1][curr.row].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column + 1 && closed[i].row === curr.row) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column + 1, row: curr.row};
            neighbors.push(node);
        }//
    }
    isAdd = true;
    if (size > curr.column+1&&0 <= curr.row-1&&map[curr.column+1][curr.row-1].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column + 1 && closed[i].row === curr.row - 1) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column + 1, row: curr.row - 1};
            neighbors.push(node);
        }//
    }
    isAdd = true;
    if (size > curr.row+1&&map[curr.column][curr.row+1].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column && closed[i].row === curr.row + 1) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column, row: curr.row + 1};
            neighbors.push(node);
        }
        //
    }
    isAdd = true;
    if (0 <= curr.column-1&&size > curr.row+1&&map[curr.column-1][curr.row+1].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column - 1 && closed[i].row === curr.row + 1) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column - 1, row: curr.row + 1};
            neighbors.push(node);
        }
        //
    }
    isAdd = true;
    if (0 <= curr.column-1&&0 <= curr.row-1&&map[curr.column-1][curr.row-1].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column - 1 && closed[i].row === curr.row - 1) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column - 1, row: curr.row - 1};
            neighbors.push(node);
        }//
    }
    isAdd = true;
    if (0 <= curr.row-1&&map[curr.column][curr.row-1].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column && closed[i].row === curr.row - 1) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column, row: curr.row - 1};
            neighbors.push(node);
        }
        //
    }
    isAdd = true;
    if (0 <= curr.column-1&&map[curr.column-1][curr.row].movable) {
        for (let i = 0; i < closed.length; i++) {
            if (closed[i].column === curr.column - 1 && closed[i].row === curr.row) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            let node = {column: curr.column - 1, row: curr.row};
            neighbors.push(node);
        }
        //
    }
    return neighbors;
}

exports.algoritmA=algoritmA;