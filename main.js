const server = require ('./network/server');
const data = require ('./gameData/data');
const Cell = require ('./gameData/map/Cell');
const sqlUtils = require ('./sql/utils');
const toDataBase = require ('./sql/gameDataToDataBase');
const send = require('./network/sender');
const mainLoop = require ('./loop');
sqlUtils.fill();


clear();
identificators();
stacks();
inventories();
ingredients();
characterRecipes();
characters();
sqlUtils.pushDb().then(
result=>{
    start();
    return result;
    }).then(
    result =>sqlUtils.pushDb(data.callBackTable)).then(
    result =>{
    items();
    craftRecipes();
    return result;
}).then(
    result =>sqlUtils.pushDb());





function start(){
    data.fillData(sqlUtils, toDataBase);
    // sqlUtils.pushDb(data.callBackTable);
    toDataBase.toDataBase(sqlUtils);
    mainLoop(data);
    send.setData(data);
    server(data);
}
function clear(){
    // return new Promise(function(resolve, reject) {
        // sqlUtils.initDB().then(
    sqlUtils.deleteTable('inventories');
    sqlUtils.deleteTable('characters');
    sqlUtils.deleteTable('stacks');

            // result => resolve());
    // });
}
function identificators(){
  sqlUtils.drop('identificators');
  sqlUtils.createTable('identificators', 'characterId INTEGER, itemId INTEGER, mapItemId INTEGER, recipeId INTEGER, inventoryId INTEGER, stackId INTEGER, weaponId INTEGER');
  sqlUtils.insert('identificators', 'characterId, itemId, mapItemId, recipeId, inventoryId, stackId, weaponId', '0, 0, 0, 0, 0, 0, 0');
}

function items(){

    sqlUtils.drop('items');
    sqlUtils.createTable('items', 'id INTEGER primary key, name TEXT, type TEXT, stackSize INTEGER');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+', \'wood\', \'resource\', 20');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'stone\', \'resource\', 20');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'woodWall\', \'buildingPart\', 20');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'stoneWall\', \'buildingPart\', 20');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'bow\', \'armory\', 1');
    sqlUtils.insert('items', 'id, name, type, stackSize', data.getId('item')+',  \'arrow\', \'armory\', 20');

}

function mapItems(){
    sqlUtils.drop('mapItems');
    sqlUtils.createTable('mapItems', 'id INTEGER primary key, type TEXT, objectId INTEGER', function(){
      var fs = require('fs');
      fs.readFile('MapItemObjects.json', function (err, data) {
          if (err) {
              throw err;
          }
          let object = JSON.parse(data.toString());

          for (let i = 0; i < object.length; i++) {
              if (object[i].objectId!==-1) {
                  sqlUtils.insert('mapItems', 'id, type, objectId', object[i].id + ',  \'' + object[i].type + '\',  ' + object[i].objectId);
              }

              // for (let j = 0; j < object[i].obstacles.length; j++) {
              //     mapObjects[mapObjects.length - 1].obstacles.push(object[i].obstacles[j]);
              // }
          }
      });
    });
}
function mapCells(){
    sqlUtils.drop('mapCells');
    sqlUtils.createTable('mapCells', 'column INTEGER, row INTEGER, movable INTEGER, objectId INTEGER', function(){
    var fs = require('fs');
    fs.readFile('myMap.map', function (err, data) {
        if (err) {
            throw err;
        }
        let array = [];
        let isPush;
        let map = JSON.parse(data.toString());
        for (let i =0; i<48*3; i++) {
            for (let j =0; j<48*3; j++) {
                isPush = true;
                for (let k=0; k<map.length; k++){
                    if (map[k].cell.column==i&&map[k].cell.row==j&&map[k].type.objectId !== -1) {
                        array.push(new Cell({column: map[k].cell.column, row:map[k].cell.row, movable: false, objectId:map[k].type.id}));
                        isPush = false;
                    }
                }
                if (isPush)
                array.push(new Cell({column: i, row:j, movable: true, objectId:null}));
            }
        }

        sqlUtils.insertAll('mapCells', array);
    });

    });
}
function stacks(){
    sqlUtils.drop('stacks');
    sqlUtils.createTable('stacks', 'id INTEGER primary key, itemId INTEGER, size INTEGER , inventoryId INTEGER');
}
function inventories(){
    sqlUtils.drop('inventories');
    sqlUtils.createTable('inventories', 'id INTEGER primary key, size INTEGER');
}
function ingredients(){
    sqlUtils.drop('ingredients');
    sqlUtils.createTable('ingredients', 'itemId INTEGER, amount INTEGER, recipeId INTEGER');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 4, 1');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '2, 3, 2');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 3, 2');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 12, 3');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 5, 3');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 10, 4');
    sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '2, 5, 4');
}
function craftRecipes() {
    sqlUtils.drop('craftRecipes');
    sqlUtils.createTable('craftRecipes', 'id INTEGER primary key, craftedItemId INTEGER, name TEXT, outputAmount INTEGER, categoryName TEXT');
    sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe') + ', 3, \'Wood wall\', 1, \'Building\'');
    sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe') + ', 4, \'Stone wall\', 1, \'Building\'');
    sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe') + ', 5, \'Bow\', 1, \'Armor\'');
    sqlUtils.insert('craftRecipes', 'id, craftedItemId, name, outputAmount, categoryName', data.getId('recipe') + ', 6, \'Arrows\', 5, \'Armor\'');
}
function characterRecipes(){
    sqlUtils.drop('characterRecipes');
    sqlUtils.createTable('characterRecipes', 'characterId INTEGER, recipeId INTEGER');
}
function characters(){

    sqlUtils.drop('characters');
    sqlUtils.createTable('characters', 'id INTEGER primary key, inventoryId INTEGER, isPlayer INTEGER, column INTEGER, row INTEGER, top INTEGER, left INTEGER, health INTEGER, strength INTEGER');

}