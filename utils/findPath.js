const utils = require('./bubbleSort');
let current=[2];
let last=[2];
let field;

function findPath(enemyLocation, myPos){
    current = myPos;
    if (current[0]>enemyLocation[0]) x = current[0]

    field = new Array(x);
    for(let i=0;i<x;i++){
        field[i]=new Array(y);
        for(let j=0;j<y;j++){
            if (i===current[0]&&j===current[1]){
                field[i][j]=1;
            }else{
                field[i][j]=0;
            }
        }
    }
    field[enemyLocation[0]][enemyLocation[1]]=1;
    field[4][6]=1;
    field[4][7]=1;
    field[1][9]=1;
    field[1][8]=1;
    field[1][10]=1;
    field[0][8]=1;
}
function update(enemyLocation){
    let wave = findWave(enemyLocation[0], enemyLocation[1]);
    if (wave!==null&&!stopMove(enemyLocation)){
        let pos = move(wave, enemyLocation);
        if (pos[0]!==current[0]||pos[1]!==current[1]) {
            last = current;
            current = pos;
            // field[last[0]][last[1]] = 0;
            // field[current[0]][current[1]] = 1
        }
    }
    return current;
}
function findWave(column, row){
    let add = true;
    let x;
    let y;
    let step = 0;
    let fieldCopy = new Array(field[0].length);
    for(let i=0;i<field[0].length;i++){
        fieldCopy[i]=new Array(field[0].length);
        for(let j=0;j<field[0].length;j++){
            if (field[i][j]===1){
                fieldCopy[i][j]=-2;
            }else{
                fieldCopy[i][j]=-1;
            }
        }
    }
    fieldCopy[column][row]=0;

    while (add == true) {
        add = false;
        for (x = 0; x < field[0].length; x++) {
            for (y = 0; y < field[0].length; y++) {
                if(fieldCopy[x][y] === step){
                    // если соседняя клетка не стена, и если она еще не помечена
                    // то помечаем ее значением шага + 1
                    if(y - 1 >= 0 && fieldCopy[x][y - 1] != -2 && fieldCopy[x][y - 1] == -1)
                        fieldCopy[x][y - 1] = step + 1;
                    if(x - 1 >= 0 && fieldCopy[x - 1][y] != -2 && fieldCopy[x - 1][y] == -1)
                        fieldCopy[x - 1][y] = step + 1;
                    if(y + 1<field[0].length&& fieldCopy[x][y + 1] != -2 && fieldCopy[x][y + 1] == -1)
                        fieldCopy[x][y + 1] = step + 1;
                    if(x + 1<field[0].length && fieldCopy[x + 1][y] != -2 && fieldCopy[x + 1][y] == -1)
                        fieldCopy[x + 1][y] = step + 1;
                }
            }
        }
        step++;
        add = true;
        if(fieldCopy[current[0]][current[1]] > 0) //решение найдено
        add = false;
        if(step > field[0].length * field[0].length){ //решение не найдено, если шагов больше чем клеток
            add = false;
            return null;
        }
    }
    return fieldCopy;
}
function stopMove(closestEnemy){
    let move = false;
    for (let x = current[0]-1; x <= current[0]+1; x++) {
        for (let y = current[1]+1; y >= current[1]-1; y--) {
            if(x === closestEnemy[0] && y === closestEnemy[1]){
                move = true;
            }
        }
    }
    return move;
}
function move(wave, closestEnemy){
    let neighbors = new Array(8);
    let moveTo = [2];
    moveTo[0]=-1;
    moveTo[1]=0;
    neighbors[0] = wave[current[0]+1][current[1]+1];
    neighbors[1] = wave[current[0]][current[1]+1];
    neighbors[2] = wave[current[0]-1][current[1]+1];
    neighbors[3] = wave[current[0]-1][current[1]];
    neighbors[4] = wave[current[0]-1][current[1]-1];
    neighbors[5] = wave[current[0]][current[1]-1];
    neighbors[6] = wave[current[0]+1][current[1]-1];
    neighbors[7] = wave[current[0]+1][current[1]];
    for (let i=0;i<8;i++){
        if (neighbors[i]===-2){
            neighbors[i] = 99999;
        }
    }
    utils.bubbleSortUp(neighbors);
    //ищем координаты клетки с минимальным весом.
    for (let column = current[0]-1; column <= current[0]+1; column++) {
        for (let row = current[1]+1; row >= current[1]-1; row--) {
            if(wave[column][row] === neighbors[0]&&wave[column][row] ===neighbors[0]){
                // и указываем вектору координаты клетки, в которую переместим нашего юнита
                moveTo[0] = column;
                moveTo[1] = row;
            }
        }
    }
    if(moveTo[0]==-1) {
        moveTo[0] = current[0];
        moveTo[1]=current[1];
    }

   return moveTo;

}

function algoritmA(currentLoc, target, map){
    let result = [];
    if (currentLoc.column===target.column&&currentLoc.row===target.row){
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
    f[currentNode.column.toString()+'/'+currentNode.row.toString()] = g[currentNode.column.toString()+'/'+currentNode.row.toString()]+h(currentNode, targetNode);
    while (open.length>0){
        currentNode = minF(f, open);
        if (currentNode.column === targetNode.column&&currentNode.row===targetNode.row){
            let current = target;
            result.unshift({column:current.column, row:current.row});
            while(from[current.column.toString()+'/'+current.row.toString()].column!==currentLoc.column&&from[current.column.toString()+'/'+current.row.toString()].row!==currentLoc.row){
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
                f[neibors[i].column.toString()+'/'+neibors[i].row.toString()]=g[neibors[i].column.toString()+'/'+neibors[i].row.toString()]+h(neibors[i], targetNode);
            }
            if(!inOpen){
                open.push(neibors[i]);
            }
        }
    }
    return result;
}
function h(start, end){
     return Math.sqrt(Math.pow((Math.abs((start.column-end.column))+1),2)+Math.pow((Math.abs((start.row-end.row))+1),2));
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
exports.findPath = findPath;
exports.update = update;
exports.algoritmA=algoritmA;