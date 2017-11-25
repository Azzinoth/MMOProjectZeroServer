let clients = {};
let characters = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let recipeList={};
function toDataBase(sqlUtils){
setInterval(function(){
    sqlUtils.initDB();
    sqlUtils.insertAll('characters').then
    result=>
    sqlUtils.insertAll('inventories').then
    result=>
    sqlUtils.insertAll('stacks').then
    result=>
    sqlUtils.insertAll('items').then
    result=>
    sqlUtils.insertAll('mapItems').then
    result=>
    sqlUtils.insertAll('cellsMap').then
    result=>
    sqlUtils.insertAll('recipeList').then
    result=>
    sqlUtils.closeDB();

    console.log('Game data added to data base');
}, 60000);
}
function addData(dataName, value){
    switch(dataName){
        case 'characters':
            characters[value.id] = value;
            break;
        case 'inventories':
            inventories[value.id] = value;
            break;
        case 'stacks':
            stacks[value.id] = value;
            break;
        case 'items':
            items[value.id] = value;
            break;
        case 'mapItems':
            mapItems[value.id] = value;
            break;
        case 'cellsMap':
            cellsMap.push(value)
            break;
        case 'recipeList':
            recipeList[value.id] = value;
            break;
    }
}
function addAllData(dataName, value){
    switch(dataName){
        case 'characters':

            break;
        case 'inventories':

            break;
        case 'stacks':

            break;
        case 'items':

            break;
        case 'mapItems':

            break;
        case 'cellsMap':

            break;
        case 'recipeList':

            break;
    }
}
function deleteData(dataName, value){
    switch(dataName){
        case 'characters':

            break;
        case 'inventories':

            break;
        case 'stacks':

            break;
        case 'items':

            break;
        case 'mapItems':

            break;
        case 'cellsMap':

            break;
        case 'recipeList':

            break;
    }
}
function deleteAllData(dataName, value){
    switch(dataName){
        case 'characters':

            break;
        case 'inventories':

            break;
        case 'stacks':

            break;
        case 'items':

            break;
        case 'mapItems':

            break;
        case 'cellsMap':

            break;
        case 'recipeList':

            break;
    }
}
module.exports = toDataBase;