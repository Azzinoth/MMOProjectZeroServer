
let characters = {};
let inventories = {};
let stacks = {};
let identificators={};
let characterRecipes = {};
let cellsMap=[];


let charactersDelete = [];
let inventoriesDelete = [];
let stacksDelete = [];


function toDataBase(sqlUtils){
setInterval(function(){
    sqlUtils.initDB();
        sqlUtils.insertAll('identificators',characters).then(
    result=>
        sqlUtils.insertAll('characters',characters)).then(
    result=>
        sqlUtils.insertAll('inventories', inventories)).then(
    result=>
        sqlUtils.insertAll('stacks', stacks)).then(
    result=>
        sqlUtils.insertAll('characterRecipes', characterRecipes)).then(
    result=>
        sqlUtils.updateAllById('cellsMap', cellsMap)).then(
    result=>
        sqlUtils.deleteAllById('stacks', stacksDelete)).then(
            result=>
        sqlUtils.deleteAllById('inventories', inventoriesDelete)).then(
            result=>
        sqlUtils.deleteAllById('characters', charactersDelete)).then(
            result=>{
        sqlUtils.closeDB(),
        characters = {},
        inventories = {},
        stacks = {},
        identificators={},
        characterRecipes = {},
        cellsMap=[],
        charactersDelete = [],
        inventoriesDelete = [],
        stacksDelete = []
    });


    console.log('Game data added to data base');
}, 60000);
}
function addData(dataName, value){
    switch(dataName){
        case 'identificators':
            for (let key in value){
            identificators[key] = value[key];
            }
            break;
        case 'characters':
            characters[value.id] = value;
            break;
        case 'inventories':
            inventories[value.id] = value;
            break;
        case 'characterRecipes':
            for (let key in value) {
                characterRecipes[key] = value[key];
            }
            break;
        case 'stacks':
            stacks[value.id] = value;
            break;
        case 'cellsMap':
            for (let i=0; i<cellsMap.length; i++){
                if (cellsMap[i].column===value.column&&cellsMap[i].row===value.row){
                    cellsMap[i] = value;
                    break;
                }
            }
            cellsMap.push(value);
            break;
    }
}
function addAllData(dataName, array){
    switch(dataName){
        case 'identificators':
            for (let key in array){
                identificators[key] = array[key];
            }
            break;
        case 'characters':
            for (let key in array){
                characters[key] = array[key];
            }
            break;
        case 'inventories':
            for (let key in array){
                inventories[key] = array[key];
            }
            break;
        case 'characterRecipes':
            for (let key in array) {
                characterRecipes[key]=array[key];
            }
            break;
        case 'stacks':
            for (let key in array){
                stacks[key]=array[key];
            }
            break;
        case 'cellsMap':
            for (let i=0; i< array.length;i++){
                for (let j=0; j<cellsMap.length; j++){
                    if (cellsMap[j].column==array[i].column&&cellsMap[j].row==array[i].row){
                        cellsMap[j] = array[i];
                        break;
                    }
                    cellsMap.push(array[i]);
                }

            }
            break;
    }
}
function deleteData(dataName, id){
    switch(dataName){
        case 'characters':
            if (id in characters){
                delete characters[id];
            }else{
                charactersDelete.push(id);
            }
            break;
        case 'inventories':
            if (id in inventories){
                delete inventories[id];
            }else{
                inventoriesDelete.push(id);
            }
            break;
        case 'stacks':
            if (id in stacks){
                delete stacks[id];
            }else{
                stacksDelete.push(id);
            }
            break;
    }
}
function deleteAllData(dataName, array){
    // switch(dataName){
    //     case 'identificators':
    //         for (let key in array){
    //
    //         }
    //         break;
    //     case 'characters':
    //         for (let key in array){
    //
    //         }
    //         break;
    //     case 'inventories':
    //         for (let key in array){
    //
    //         }
    //         break;
    //     case 'characterRecipes':
    //         for (let key in array) {
    //
    //         }
    //         break;
    //     case 'stacks':
    //         for (let key in array){
    //
    //         }
    //         break;
    // }
}
exports.toDataBase = toDataBase;
exports.addData = addData;
exports.addAllData = addAllData;
exports.deleteData = deleteData;