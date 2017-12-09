
// let characters = null;
// let inventories = null;
// let stacks = null;
// let identificators=null;
// let characterRecipes = null;
// let cellsMap=[];
//
// let charactersUpdate = null;
// let inventoriesUpdate = null;
// let stacksUpdate = null;
// let characterRecipesUpdate = null;
//
// let charactersDelete = [];
// let inventoriesDelete = [];
// let stacksDelete = [];


function toDataBase(sqlUtils, data){
setInterval(function(){
    // sqlUtils.initDB().then(
    sqlUtils.updateById('identificators', null, data.identificators);
    sqlUtils.deleteTable('characters');
    sqlUtils.insertAll('characters',data.characters);
    sqlUtils.deleteTable('inventories');
    sqlUtils.insertAll('inventories', data.inventories);
    sqlUtils.deleteTable('stacks');
    sqlUtils.insertAll('stacks', data.stacks);
    sqlUtils.deleteTable('characterRecipes');
    sqlUtils.insertAll('characterRecipes', data.characterRecipes);
    sqlUtils.updateAllById('cellsMap', data.cellsMap);
    sqlUtils.pushDb();
    // result=>sqlUtils.closeDB())

    console.log('Game data added to data base');
}, 50000);
}
// function addData(dataName, value, familyId){
//     switch(dataName){
//         case 'identificators':
//             identificators = value;
//             break;
//         case 'characters':
//             if (characters===null)characters={};
//             characters[value.id] = value;
//             break;
//         case 'inventories':
//             if (inventories===null)inventories={};
//             inventories[value.id] = value;
//             break;
//         case 'characterRecipes':
//             if (characterRecipes===null)characterRecipes={};
//             for (let key in value) {
//                 characterRecipes[key] = value[key];
//             }
//             break;
//         case 'stacks':
//             if (stacks===null)stacks={};
//             stacks[value.id] = value;
//             stacks[value.id].inventoryId = familyId;
//             break;
//         case 'cellsMap':{
//             let isFind = false;
//             for (let i=0; i<cellsMap.length; i++){
//                 if (cellsMap[i].column===value.column&&cellsMap[i].row===value.row){
//                     cellsMap[i] = value;
//                     isFind = true;
//                     break;
//                 }
//             }
//             if (!isFind) cellsMap.push(value);
//         }
//             break;
//     }
// }
// function updateData(dataName, id, value, familyId){
//     switch(dataName){
//         case 'identificators':
//             identificators = value;
//             break;
//         case 'characters':
//             if (id in characters){
//                 characters[value.id]=value;
//             }else{
//                 if (charactersUpdate===null)charactersUpdate={};
//                 charactersUpdate[value.id] = value;
//             }
//             break;
//         case 'inventories':
//             if (id in inventories){
//                 inventories[value.id]=value;
//             }else{
//                 if (inventoriesUpdate===null)inventoriesUpdate={};
//                 inventoriesUpdate[value.id] = value;
//             }
//             break;
//         case 'characterRecipes':
//             if (id in characterRecipes){
//                 characterRecipes[value.characterId]=value;
//             }else{
//                 if (characterRecipesUpdate===null)characterRecipesUpdate={};
//                 characterRecipesUpdate[value.characterId] = value;
//             }
//             break;
//         case 'stacks':
//             if (id in stacks){
//                 stacks[value.id]=value;
//                 stacks[value.id].inventoryId = familyId;
//             }else{
//                 if (stacksUpdate===null)stacksUpdate={};
//                 stacksUpdate[value.id] = value;
//                 stacksUpdate[value.id].inventoryId = familyId;
//             }
//             break;
//         case 'cellsMap':{
//             let isFind = false;
//             for (let i=0; i<cellsMap.length; i++){
//                 if (cellsMap[i].column===value.column&&cellsMap[i].row===value.row){
//                     cellsMap[i] = value;
//                     isFind = true;
//                     break;
//                 }
//             }
//             if (!isFind) cellsMap.push(value);
//         }
//             break;
//     }
// }
// function addAllData(dataName, array){
//     switch(dataName) {
//         case 'identificators':
//             identificators = array;
//             break;
//         case 'characters':
//             if (characters===null)characters={};
//
//             for (let key in array) {
//                 characters[key] = array[key];
//             }
//             break;
//         case 'inventories':
//             if (inventories===null)inventories={};
//             for (let key in array) {
//                 inventories[key] = array[key];
//             }
//             break;
//         case 'characterRecipes':
//             if (characterRecipes===null)characterRecipes={};
//             for (let key in array) {
//                 characterRecipes[key] = array[key];
//             }
//             break;
//         case 'stacks':
//             if (stacks===null)stacks={};
//             for (let key in array) {
//                 stacks[key] = array[key];
//             }
//             break;
//         case 'cellsMap': {
//             let isFind = false;
//             for (let i = 0; i < array.length; i++) {
//                 for (let j = 0; j < cellsMap.length; j++) {
//                     if (cellsMap[j].column == array[i].column && cellsMap[j].row == array[i].row) {
//                         cellsMap[j] = array[i];
//                         isFind=true;
//                         break;
//                     }
//                 }
//                 if(!isFind) cellsMap.push(array[i]);
//
//             }
//         }
//             break;
//     }
// }
// function deleteData(dataName, id){
//     switch(dataName){
//         case 'characters':
//             if (id in characters){
//                 delete characters[id];
//             }else{
//                 charactersDelete.push(id);
//             }
//             break;
//         case 'inventories':
//             if (id in inventories){
//                 delete inventories[id];
//             }else{
//                 inventoriesDelete.push(id);
//             }
//             break;
//         case 'stacks':
//             if (id in stacks){
//                 delete stacks[id];
//             }else{
//                 stacksDelete.push(id);
//             }
//             break;
//     }
// }
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
// exports.addData = addData;
// exports.addAllData = addAllData;
// exports.deleteData = deleteData;