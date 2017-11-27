const server = require ('./network/server');
const data = require ('./gameData/data');
const Cell = require ('./gameData/map/Cell');
const sqlUtils = require ('./sql/utils');
const toDataBase = require ('./sql/gameDataToDataBase');
  sqlUtils.initDB();
// sqlUtils.drop('mapCells');
//  sqlUtils.drop('stacks');
// sqlUtils.drop('inventories');
// sqlUtils.drop('ingredients');
//  sqlUtils.drop('craftRecipes');
// sqlUtils.drop('characterRecipes');
//  sqlUtils.drop('characters');
// sqlUtils.drop('items');
// sqlUtils.drop('mapItems');
// sqlUtils.drop('identificators');
sqlUtils.deleteTable('inventories');
sqlUtils.deleteTable('characters');
sqlUtils.deleteTable('stacks');
// sqlUtils.deleteTable('identificators');
sqlUtils.closeDB();
// sqlUtils.createTable('identificators', 'characterId INTEGER, itemId INTEGER, mapItemId INTEGER, recipeId INTEGER, inventoryId INTEGER, stackId INTEGER', function(){
    //sqlUtils.insert('identificators', 'characterId, itemId, mapItemId, recipeId, inventoryId, stackId','20, 20, 20, 20, 20, 20');
// });
// sqlUtils.createTable('items', 'id INTEGER primary key, name TEXT, type TEXT, stackSize INTEGER', function(){
// 	sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+', \'wood\', \'resource\', 20');
// 	sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'stone\', \'resource\', 20');
// 	sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'woodWall\', \'buildingPart\', 20');
// 	sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'stoneWall\', \'buildingPart\', 20');
// });
//
//
// sqlUtils.createTable('mapItems', 'id INTEGER primary key, type TEXT, size INTEGER', function(){
//     sqlUtils.insert('mapItems', 'id, type, size', data.getId('mapItem')+', \'rock\', 5');
//     sqlUtils.insert('mapItems', 'id, type, size', data.getId('mapItem')+', \'tree\', 5');
// });
// //
// //
// sqlUtils.createTable('mapCells', 'column INTEGER, row INTEGER, movable INTEGER, objectId INTEGER', function(){
//     let array = [];
//     for (let i =0; i<48; i++){
//         for (let j =0; j<48; j++){
//             if (Math.random()<0.25){
//                 array.push(new Cell({column: i, row:j, movable: false, objectId:1}));
//             }else if (Math.random()>=0.25&&Math.random()<0.5){
//                 array.push(new Cell({column: i, row:j, movable: false, objectId:2}));
//             }else{
//                 array.push(new Cell({column: i, row:j, movable: true, objectId:null}));
//             }
//         }
//     }
//     sqlUtils.insertAll('mapCells', array);
// });
//
// sqlUtils.createTable('stacks', 'id INTEGER primary key, itemId INTEGER, size INTEGER , inventoryId INTEGER');
// sqlUtils.createTable('inventories', 'id INTEGER primary key, size INTEGER');
//
//
// sqlUtils.createTable('ingredients', 'itemId INTEGER, amount INTEGER, recipeId INTEGER', function(){
// 	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 4, 1');
// 	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '2, 3, 2');
// 	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 3, 2');
// });
//
//
// sqlUtils.createTable('craftRecipes', 'id INTEGER primary key, craftedItemId INTEGER, name TEXT, outputAmount INTEGER, categoryName TEXT', function(){
// 	sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe')+', 3, \'Wood wall\', 1, \'Building\'');
// 	sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe')+', 4, \'Stone wall\', 1, \'Building\'');
// });
//
// sqlUtils.createTable('characterRecipes', 'characterId INTEGER, recipeId INTEGER');
// sqlUtils.createTable('characters', 'id INTEGER primary key, inventoryId INTEGER, isPlayer INTEGER, column INTEGER, row INTEGER, top INTEGER, left INTEGER, health INTEGER, strength INTEGER');
// sqlUtils.closeDB();

//
data.fillData(sqlUtils, toDataBase);
toDataBase.toDataBase(sqlUtils, data);
server(data);