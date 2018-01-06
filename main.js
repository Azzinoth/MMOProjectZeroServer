const server = require('./network/server');
const data = require('./gameData/data');
const Cell = require('./gameData/map/Cell');
const sqlUtils = require('./sql/utils');
const toDataBase = require('./sql/gameDataToDataBase');
const send = require('./network/sender');
const mainLoop = require('./loop');

sqlUtils.fill();
// data.fillId(sqlUtils);
// sqlUtils.pushDb(data.callBackTable).then(
//     result=>{
//
//     }
// )

// clear();
// system();
// sqlUtils.pushDb();

// wipe().then(
//   result => recover()
// )

recover();


function recover() {
  sqlUtils.selectAll('system');
  sqlUtils.pushDb(callBack);
}

function callBack(tableRows, tableName) {
  let status = tableRows[0].systemBd;
  if (status === 0) {
    console.log('recover db status ' + status);
    start();
  }
  if (status === 1) {
    console.log('recover db status ' + status);
    sqlUtils.drop('identificatorsTmp');
    sqlUtils.drop('accountsTmp');
    sqlUtils.drop('charactersTmp');
    sqlUtils.drop('inventoriesTmp');
    sqlUtils.drop('stacksTmp');
    sqlUtils.drop('commonItemsTmp');
    sqlUtils.drop('weaponsRangeTmp');
    sqlUtils.drop('characterRecipesTmp');
    sqlUtils.updateById('system', null, 0);
    sqlUtils.pushDb().then(
      result => start()
    );
  }
  if (status === 2) {
    console.log('recover db status ' + status);
    sqlUtils.drop('identificators');
    sqlUtils.drop('accounts');
    sqlUtils.drop('characters');
    sqlUtils.drop('inventories');
    sqlUtils.drop('stacks');
    sqlUtils.drop('commonItems');
    sqlUtils.drop('weaponsRange');
    sqlUtils.drop('characterRecipes');
    sqlUtils.updateById('system', null, 3);
    sqlUtils.pushDb().then(
      result => {
        sqlUtils.rename('identificatorsTmp', 'identificators'),
        sqlUtils.rename('accountsTmp', 'accounts'),
          sqlUtils.rename('charactersTmp', 'characters'),
          sqlUtils.rename('inventoriesTmp', 'inventories'),
          sqlUtils.rename('stacksTmp', 'stacks'),
          sqlUtils.rename('commonItemsTmp', 'commonItems'),
          sqlUtils.rename('weaponsRangeTmp', 'weaponsRange'),
          sqlUtils.rename('characterRecipesTmp', 'characterRecipes'),
          sqlUtils.updateById('system', null, 0),
          sqlUtils.pushDb().then(
            result => start()
          )
      });
  }
  if (status === 3) {
    console.log('recover db status ' + status);
    sqlUtils.rename('identificatorsTmp', 'identificators');
    sqlUtils.rename('accountsTmp', 'accounts');
    sqlUtils.rename('charactersTmp', 'characters');
    sqlUtils.rename('inventoriesTmp', 'inventories');
    sqlUtils.rename('stacksTmp', 'stacks');
    sqlUtils.rename('commonItemsTmp', 'commonItems');
    sqlUtils.rename('weaponsRangeTmp', 'weaponsRange');
    sqlUtils.rename('characterRecipesTmp', 'characterRecipes');
    sqlUtils.updateById('system', null, 0);
    sqlUtils.pushDb().then(
      result => start()
    )
  }
}

function start() {
  data.fillId(sqlUtils);
  data.fillData(sqlUtils);
  sqlUtils.pushDb(data.callBackTable).then(
    result => {
      toDataBase.toDataBase(sqlUtils, data),
        mainLoop(data),
        send.setData(data),
        server(data)
    });
}

function wipe() {
  return new Promise(function (resolve, reject) {
    sqlUtils.drop('identificators');
    sqlUtils.createTable('identificators');
    sqlUtils.drop('identificatorsTmp');
    sqlUtils.drop('accountsTmp');
    sqlUtils.drop('inventoriesTmp');
    sqlUtils.drop('charactersTmp');
    sqlUtils.drop('stacksTmp');
    sqlUtils.drop('characterRecipesTmp');
    sqlUtils.drop('commonItemsTmp');
    sqlUtils.drop('weaponsRangeTmp');


    mapItemsCatalog();
    buildingParts();
    let accountId = accounts();
    items();
    commonItems();
    let itemId = weaponsRange();
    let stackId = stacks();
    let inventoryId = inventories();
    ingredients();
    let recipeId = craftRecipes();
    characterRecipes();
    let characterId = characters();
    let zoneId = zones();
    let animalId = animals();
    let mapItemId = null;
    mapCells().then(
      result => {
        mapItemId = result,
          sqlUtils.insert('identificators', accountId + ', ' + characterId + ', ' + animalId + ', ' + itemId + ', ' + mapItemId + ', ' + recipeId + ', ' + inventoryId + ', ' + stackId + ', ' + zoneId),
          sqlUtils.updateById('system', null, 0),
          sqlUtils.pushDb().then(
            result =>
              resolve()
          )
      }
    )

  });
}

function accounts() {
  sqlUtils.drop('accounts');
  sqlUtils.createTable('accounts');
  return 0;
}

function identificators() {
  sqlUtils.drop('identificators');
  sqlUtils.createTable('identificators');
  sqlUtils.insert('identificators', '0, 0, 0, 0, 0, 0, 0, 0, 0');
}

function items() {
  sqlUtils.drop('items');
  sqlUtils.createTable('items');
  sqlUtils.insert('items', 1 + ', \'RESOURCE\', 20'); //wood
  sqlUtils.insert('items', 2 + ', \'RESOURCE\', 20'); //stone
  sqlUtils.insert('items', 3 + ', \'BUILDING_PART\', 1'); //wood wall
  sqlUtils.insert('items', 4 + ', \'BUILDING_PART\', 1'); //stone wall
  sqlUtils.insert('items', 5 + ', \'WEAPON\', 1'); //bow
  sqlUtils.insert('items', 6 + ', \'AMMO\', 20'); //arrow
  sqlUtils.insert('items', 7 + ', \'BUILDING_PART\', 1'); //campFire
  sqlUtils.insert('items', 8 + ', \'RESOURCE\', 20'); //meat
  sqlUtils.insert('items', 9 + ', \'RESOURCE\', 20'); //leather
}

function commonItems() {
  sqlUtils.drop('commonItems');
  sqlUtils.createTable('commonItems');
}

function weaponsRange() {
  sqlUtils.drop('weaponsRange');
  sqlUtils.createTable('weaponsRange');
  return 0;

}

function mapItemsCatalog() {
  sqlUtils.drop('mapItemsCatalog');
  sqlUtils.createTable('mapItemsCatalog');
  let fs = require('fs');
  fs.readFile('MapItemObjects.json', function (err, data) {
    if (err) {
      throw err;
    }
    let object = JSON.parse(data.toString());

    for (let i = 0; i < object.length; i++) {
      if (object[i].objectId !== -1) {
        sqlUtils.insert('mapItemsCatalog', object[i].id, object[i].objectId);
      }
    }
  });
}

//function resources(){

//}
function buildingParts() {
  sqlUtils.drop('buildingParts');
  sqlUtils.createTable('buildingParts');
}

function mapCells() {
  return new Promise(function (resolve, reject) {
    sqlUtils.drop('resources');
    sqlUtils.createTable('resources');
    sqlUtils.drop('mapCells');
    sqlUtils.createTable('mapCells');
    let result = [];
    let resources = {};
    let mapItemId = 0;
    var fs = require('fs');
    fs.readFile('myMap.map', function (err, data) {
      if (err) {
        throw err;
      }

      let map = JSON.parse(data.toString());
      for (let i = 0; i < 48 * 3; i++) {
        result.push(new Array(48 * 3));
        for (let j = 0; j < 48 * 3; j++) {
          result[i][j] = new Cell(i, j, true, null, null)
          // isPush = true;
          //
          // if (isPush){
          //     sqlUtils.insert('mapCells', i+', '+j+', '+1+', '+null+', '+null);
          // }
        }
      }
      for (let i = 0; i < map.length; i++) {
        if (map[i].type.objectId !== -1) {
          mapItemId++;
          result[map[i].cell.column][map[i].cell.row].movable = false;
          result[map[i].cell.column][map[i].cell.row].objectId = map[i].type.id;
          result[map[i].cell.column][map[i].cell.row].mapItemId = mapItemId;
          resources[mapItemId] = {id:map[i].type.id, mapItemId:mapItemId, typeId:map[i].type.objectId};
        }
      }
      // for (let i = 0; i < result.length; i++) {
      //     for (let j = 0; j < result[i].length; j++) {
      //         if (result[i][j][0] === 1) {
      //             sqlUtils.insert('mapCells', i + ', ' + j + ', ' + 1 + ', ' + null + ', ' + null);
      //         } else {
      //             sqlUtils.insert('resources', result[i][j][1], result[i][j][2], 6);
      //             sqlUtils.insert('mapCells', i + ', ' + j + ', ' + 0 + ', ' + result[i][j][1] + ', ' + result[i][j][2]);
      //         }
      //     }
      // }
      sqlUtils.insertAll('mapCells', result);
      sqlUtils.insertAll('resources', resources);
      resolve(mapItemId);
    });

  });
}

function stacks() {
  sqlUtils.drop('stacks');
  sqlUtils.createTable('stacks');
  return 0;
}

function inventories() {
  sqlUtils.drop('inventories');
  sqlUtils.createTable('inventories');
  return 0;
}

function ingredients() {
  sqlUtils.drop('ingredients');
  sqlUtils.createTable('ingredients');
  sqlUtils.insert('ingredients', '1, 4, 1'); //wood wall
  sqlUtils.insert('ingredients', '2, 3, 2'); //stone wall
  sqlUtils.insert('ingredients', '1, 3, 2'); //stone wall
  sqlUtils.insert('ingredients', '1, 12, 3'); //bow
  sqlUtils.insert('ingredients', '1, 5, 3'); //bow
  sqlUtils.insert('ingredients', '1, 10, 4'); //arrows
  sqlUtils.insert('ingredients', '2, 5, 4'); //arrows
  sqlUtils.insert('ingredients', '1, 10, 5'); //camp fire
  sqlUtils.insert('ingredients', '2, 5, 5'); //camp fire
}

function craftRecipes() {
  sqlUtils.drop('craftRecipes');
  sqlUtils.createTable('craftRecipes');
  sqlUtils.insert('craftRecipes', 1 + ', 3, \'Wood wall\', 1, \'Building\'');
  sqlUtils.insert('craftRecipes', 2 + ', 4, \'Stone wall\', 1, \'Building\'');
  sqlUtils.insert('craftRecipes', 3 + ', 5, \'Bow\', 1, \'Armor\'');
  sqlUtils.insert('craftRecipes', 4 + ', 6, \'Arrows\', 5, \'Armor\'');
  sqlUtils.insert('craftRecipes', 5 + ', 7, \'Camp fire\', 1, \'Building\'');
  return 5
}

function characterRecipes() {
  sqlUtils.drop('characterRecipes');
  sqlUtils.createTable('characterRecipes');
}

function characters() {

  sqlUtils.drop('characters');
  sqlUtils.createTable('characters');
  return 0;

}

function animals() {
  sqlUtils.drop('animals');
  sqlUtils.createTable('animals');
  let fromC;
  let toC;
  let fromR;
  let toR;
  let zoneId;
  let id = 0;
  for (let i = 0; i < 3; i++) {

    if (i === 0) {
      fromC = 0;
      toC = 36;
      fromR = 5;
      toR = 30;
      zoneId = 2;
    }
    if (i === 1) {
      fromC = 50;
      toC = 80;
      fromR = 60;
      toR = 80;
      zoneId = 3;
    }
    if (i === 2) {
      fromC = 108;
      toC = 144;
      fromR = 12;
      toR = 50;
      zoneId = 4;
    }
    for (let j = 0; j < 10; j++) {
      let col = Math.floor(Math.random() * (toC - fromC) + fromC);
      let row = Math.floor(Math.random() * (toR - fromR) + fromR);
      id++;
      sqlUtils.insert('animals', id + ', ' + col + ', ' + row + ', ' + col * 64 + ', ' + row * 64 + ', ' + zoneId + ', ' + 1);
    }
    for (let j = 0; j < 10; j++) {
      let col = Math.floor(Math.random() * (toC - fromC) + fromC);
      let row = Math.floor(Math.random() * (toR - fromR) + fromR);
      id++;
      sqlUtils.insert('animals', id + ', ' + col + ', ' + row + ', ' + col * 64 + ', ' + row * 64 + ', ' + zoneId + ', ' + 2);
    }
  }
  return id
}

function zones() {
  sqlUtils.drop('zones');
  sqlUtils.createTable('zones');
  sqlUtils.insert('zones', 1 + ', 0, 48, 48, 96, \'rocks\'');
  sqlUtils.insert('zones', 2 + ', 0, 5, 36, 30, \'forest\'');
  sqlUtils.insert('zones', 3 + ', 50, 60, 80, 80, \'forest\'');
  sqlUtils.insert('zones', 4 + ', 108, 12, 144, 50, \'forest\'');
  sqlUtils.insert('zones', 5 + ', 120, 70, 134, 90, \'rocks\'');
  return 5;
}

function system() {
  sqlUtils.drop('system');
  sqlUtils.createTable('system');
  sqlUtils.insert('system', 0);

}