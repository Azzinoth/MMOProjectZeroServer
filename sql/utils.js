const sqlite3 = require('sqlite3').verbose();


function SqlObject(query = null, tableName = null, sqlParam = null, active = false) {
  this.query = query;
  this.tableName = tableName;
  this.sqlParam = sqlParam;
  this.active = active;
}

const dataName = './sql/tables/dataBase.db';
let db;
const sqlQuery = new Array(2000);

function fill() {
  for (let i = 0; i < sqlQuery.length; i++) {
    sqlQuery[i] = new SqlObject();
  }
}

function pushDb(callback = null) {
  return new Promise(function (resolve, reject) {
    let result = new Array();
    let i = 0;
    let length = sqlQuery.length;
    db = new sqlite3.Database(dataName, (err) => {
      if (err) {
        console.log('Error in sqlite3.Database' + err.message);
        db.close();
        resolve();
        return;
      }
      follow(i);

    });


    function follow(i) {
      if (i === length || sqlQuery[i].active === false) {
        db.close();
        if (callback !== null) {
          for (let i = 0; i < result.length; i++) {
            callback(result[i][0], result[i][1]);
          }
        }
        resolve();
        return;
      }
      if (sqlQuery[i].sqlParam === 'run') {
        db.serialize(function () {
          db.run(sqlQuery[i].query, function (err) {
            if (err) {
              console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
              db.close();
              resolve();
              return;
            }

            i++;
            follow(i);

          });
          sqlQuery[i].active = false;

        });
      } else if (sqlQuery[i].sqlParam === "all") {
        db.all(sqlQuery[i].query, function (err, rows) {
          if (err) {
            console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
            db.close();
            resolve();
            return;
          }
          result.push(new Array(rows, sqlQuery[i].tableName));
          console.log('Select table ' + sqlQuery[i].tableName + " " + rows.length);
          i++;
          follow(i);

        });
        sqlQuery[i].active = false;
      } else if (sqlQuery[i].sqlParam === "rename") {
        db.serialize(function () {
          db.all("SELECT name FROM sqlite_master WHERE type='table' AND name=\'" + sqlQuery[i].tableName + "\';", function (err, rows) {
            if (err) {
              console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
              db.close();
              resolve();
              return;
            }
            if (rows.length > 0) {
              db.run(sqlQuery[i].query, function (err) {
                if (err) {
                  console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                  db.close();
                  resolve();
                  return;
                }

                i++;
                follow(i);

              });
            } else {
              i++;
              follow(i);
            }
          });
          sqlQuery[i].active = false;

        });
      }
    }
  });
}

function addSql(type, tableName, sql) {
  for (let i = 0; i < sqlQuery.length; i++) {
    if (sqlQuery[i].active === false) {
      sqlQuery[i].tableName = tableName;
      sqlQuery[i].query = sql;
      sqlQuery[i].sqlParam = type;
      sqlQuery[i].active = true;
      break;
    }
    if (i === sqlQuery.length - 1) {
      sqlQuery.push(new SqlObject(sql, tableName, type, true));
    }
  }
}

function createTable(tableName, callBack) {
  switch (tableName) {

    case 'accounts':
    case 'accountsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, email TEXT, password TEXT);");

      break;
    case 'identificators':
    case 'identificatorsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (accountId INTEGER, characterId INTEGER, animalId INTEGER, itemId INTEGER, mapItemId INTEGER, recipeId INTEGER, inventoryId INTEGER, stackId INTEGER, zoneId INTEGER);");
      break;
    case 'characters':
    case 'charactersTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, accountId INTEGER, inventoryId INTEGER, armorInventoryId INTEGER, hotBarId INTEGER, activeHotBarCell INTEGER, column INTEGER, row INTEGER, top INTEGER, left INTEGER, level  INTEGER, health INTEGER, strength INTEGER, viewDistance INTEGER);");
      break;
    case 'inventories':
    case 'inventoriesTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, size INTEGER);");
      break;
    case 'characterRecipes':
    case 'characterRecipesTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (characterId INTEGER, recipeId INTEGER);");
      break;
    case 'stacks':
    case 'stacksTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, size INTEGER, inventoryId INTEGER, position INTEGER);");
      break;
    case 'commonItems':
    case 'commonItemsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (typeId INTEGER, name TEXT, stackSize INTEGER, stackId INTEGER);");
      break;
    case 'weaponsRange':
    case 'weaponsRangeTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (typeId INTEGER, itemId INTEGER primary key, durability INTEGER, stackId INTEGER);");
      break;
    case 'items':
    case 'itemsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, typeName TEXT, stackSize INTEGER);");
      break;
    case 'mapItemsCatalog':
    case 'mapItemsCatalogTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, typeId INTEGER);");
      break;
    case 'mapCells':
    case 'mapCellsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (column INTEGER, row INTEGER, movable INTEGER, objectId INTEGER, mapItemId INTEGER);");
      break;
    case 'resources':
    case 'resourcesTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER, mapItemId INTEGER primary key, typeId INTEGER);");
      break;
    case 'buildingParts':
    case 'buildingPartsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER, mapItemId INTEGER primary key, typeId INTEGER, characterId INTEGER, durability INTEGER);");
      break;
    case 'craftRecipes':
    case 'craftRecipesTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, craftedTypeId INTEGER, name TEXT, outputAmount INTEGER, categoryName TEXT);");
      break;
    case 'ingredients':
    case 'ingredientsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (typeId INTEGER, amount INTEGER, recipeId INTEGER);");
      break;
    case 'animals':
    case 'animalsTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, column INTEGER, row INTEGER, top INTEGER, left INTEGER, zoneId INTEGER, type INTEGER);");
      break;
    case 'zones':
    case 'zonesTmp':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (id INTEGER primary key, fromColumn INTEGER, fromRow INTEGER, toColumn INTEGER, toRow INTEGER, type TEXT);");
      break;
    case 'system':
      addSql("run", tableName, "CREATE TABLE " + tableName + " (systemBd INTEGER);");
      break;
  }

}

function insert(tableName, value, callBack) {
  switch (tableName) {

    case 'accounts':
    case 'accountsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, email, password) VALUES" + " (" + value + ");");
      break;
    case 'identificators':
    case 'identificatorsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (accountId, characterId, animalId, itemId, mapItemId, recipeId, inventoryId, stackId, zoneId) VALUES" + " (" + value + ");");
      break;
    case 'characters':
    case 'charactersTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, accountId, inventoryId, armorInventoryId, hotBarId, activeHotBarCell, column, row, top, left, level, health, strength, viewDistance) VALUES" + " (" + value + ");");
      break;
    case 'inventories':
    case 'inventoriesTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, size) VALUES" + " (" + value + ");");
      break;
    case 'characterRecipes':
    case 'characterRecipesTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (characterId, recipeId) VALUES" + " (" + value + ");");
      break;
    case 'stacks':
    case 'stacksTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, size, inventoryId, position) VALUES" + " (" + value + ");");
      break;
    case 'commonItems':
    case 'commonItemsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (typeId, name, stackSize, stackId) VALUES" + " (" + value + ");");
      break;
    case 'weaponsRange':
    case 'weaponsRangeTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (typeId, itemId, durability, stackId) VALUES" + " (" + value + ");");
      break;
    case 'items':
    case 'itemsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, typeName, stackSize) VALUES" + " (" + value + ");");
      break;
    case 'mapItemsCatalog':
    case 'mapItemsCatalogTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, typeId) VALUES" + " (" + value + ");");
      break;
    case 'mapCells':
    case 'mapCellsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (column, row, movable, objectId, mapItemId) VALUES" + " (" + value + ");");
      break;
    case 'resources':
    case 'resourcesTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, mapItemId, typeId) VALUES" + " (" + value + ");");
      break;
    case 'buildingParts':
    case 'buildingPartsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, mapItemId, typeId, characterId, durability) VALUES" + " (" + value + ");");
      break;
    case 'craftRecipes':
    case 'craftRecipesTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, craftedTypeId, name, outputAmount, categoryName) VALUES" + " (" + value + ");");
      break;
    case 'ingredients':
    case 'ingredientsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (typeId, amount, recipeId) VALUES" + " (" + value + ");");
      break;
    case 'zones':
    case 'zonesTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, fromColumn, fromRow, toColumn, toRow, type) VALUES" + " (" + value + ");");
      break;
    case 'animals':
    case 'animalsTmp':
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, column, row, top, left, zoneId, type) VALUES" + " (" + value + ");");
      break;
    case 'system':
      addSql("run", tableName, "INSERT INTO " + tableName + " (systemBd) VALUES" + " (" + value + ");");
      break;
  }
}

function insertAll(tableName, array, callBack) {

  // return new Promise(function(resolve, reject) {
  if (array === null) {
    return;
  }
  // let values =null;
  switch (tableName) {
    case 'accounts':
    case 'accountsTmp': {
      for (let key in array) {
        let id = key;
        let email = array[key].email;
        let password = array[key].password;
        insert(tableName, id + ', \'' + email + '\', \'' + password + '\'');
      }

    }
      break;
    case 'identificators':
    case 'identificatorsTmp': {
      insert(tableName, array.accountId + ', ' + array.characterId + ', ' + array.animalId + ', ' + array.itemId + ', ' + array.mapItemId + ', ' + array.recipeId + ', ' + array.inventoryId + ', ' + array.stackId + ', ' + array.zoneId);
    }

      break;
    case 'characters':
    case 'charactersTmp': {
      for (let key in array) {
        let id = key;
        let accountId = array[key].accountId;
        let inventoryId = array[key].inventoryId;
        let armorInventoryId = array[key].armorInventoryId;
        let hotBarId = array[key].hotBarId;
        let activeHotBarCell = array[key].activeHotBarCell;
        let column = array[key].column;
        let row = array[key].row;
        let top = array[key].top;
        let left = array[key].left;
        let level = array[key].level;
        let health = array[key].health;
        let strength = array[key].strength;
        let viewDistance = array[key].viewDistance;
        insert(tableName,
          id + ', ' + accountId + ', ' + inventoryId + ', ' + armorInventoryId + ', ' + hotBarId + ', ' + activeHotBarCell + ', ' + column + ', ' + row + ', ' + top + ', ' + left + ', ' + level + ', ' + health + ', ' + strength + ', ' + viewDistance);
      }
    }
      break;
    case 'inventories':
    case 'inventoriesTmp':
      for (let key in array) {
        let id = key;
        let size = array[key].size;
        insert(tableName, id + ', ' + size);

      }

      break;
    case 'characterRecipes':
    case 'characterRecipesTmp':
      for (let key in array) {
        let characterId = key;
        for (let i = 0; i < array[key].craftRecipesId.length; i++) {
          let recipeId = array[key].craftRecipesId[i];
          insert(tableName, characterId + ', ' + recipeId);
        }
      }

      break;
    case 'stacks':
    case 'stacksTmp':
      for (let key in array) {
        let id = parseInt(key);
        let size = array[key].size;
        let inventoryId = array[key].inventoryId;
        let position = array[key].position;
        insert(tableName, id + ', ' + size + ', ' + inventoryId + ', ' + position);
        if (array[key].item !== null) {
          if (array[key].item.typeId === 5) {
            insert('weaponsRange', array[key].item.typeId + ', ' + array[key].item.itemId + ', ' + array[key].item.durability + ', ' + id);
          } else {
            insert('commonItems', array[key].item.typeId + ', \'' + array[key].item.typeName + '\', ' + size + ', ' + id);
          }
        }
      }

      break;

    case 'weaponsRange':
    case 'weaponsRangeTmp':
      for (let key in array) {
        let stackId = array[key].stackId;
        let typeId = array[key].typeId;
        let durability = array[key].durability;
        let itemId = array[key].itemId;
        insert(tableName, typeId + ', ' + itemId + ', ' + durability + ', ' + stackId);
      }
      break;
    case 'resources':
    case 'resourcesTmp':{
      let sqlQuery = null;
      for (let key in array) {
        let id = array[key].id;
        let mapItemId = array[key].mapItemId;
        let typeId = array[key].typeId;
        if (sqlQuery === null){
          sqlQuery = "(" + id + ', ' + mapItemId + ', ' + typeId + ")";
        }else{
          sqlQuery += ", (" + id + ', ' + mapItemId + ', ' + typeId + ")";
        }
      }
      addSql("run", tableName, "INSERT INTO " + tableName + " (id, mapItemId, typeId) VALUES " + sqlQuery);
    }
      break;
    case 'buildingParts':
    case 'buildingPartsTmp':
      for (let key in array) {
        let id = array[key].id;
        let mapItemId = array[key].mapItemId;
        let typeId = array[key].typeId;
        let characterId = array[key].characterId;
        let durability = array[key].durability;
        insert(tableName, id + ', ' + mapItemId + ', ' + typeId + ', ' + characterId + ', ' + durability);
      }
      break;
    case 'mapCells':
    case 'mapCellsTmp':{
      let sqlQuery = null;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          let column = array[i][j].column;
          let row = array[i][j].row;
          let movable = array[i][j].movable === true ? 1 : 0;
          let objectId = array[i][j].objectId;
          let mapItemId = array[i][j].mapItemId;
          if (sqlQuery === null) {
            sqlQuery = "(" + column + ', ' + row + ', ' + movable + ', ' + objectId + ', ' + mapItemId + ")";
          } else {
            sqlQuery += ", (" + column + ', ' + row + ', ' + movable + ', ' + objectId + ', ' + mapItemId + ")";
          }
        }
      }
      addSql("run", tableName, "INSERT INTO " + tableName + " (column, row, movable, objectId, mapItemId) VALUES " + sqlQuery);
    }
      break;
  }
}

function selectAll(tableName, callBack) {
  addSql("all", tableName, "SELECT * FROM " + tableName);
}

function drop(tableName) {
  addSql("run", tableName, "DROP TABLE IF EXISTS " + tableName);
}

function rename(tableName, newTableName) {
  addSql("rename", tableName, "ALTER TABLE " + tableName + " RENAME TO " + newTableName);
}

function deleteTable(tableName, callBack) {
  addSql("run", tableName, "DELETE FROM " + tableName);
}

function deleteAllById(tableName, arrayId, callBack) {

  if (arrayId.length <= 0) {
    return;
  }
  let sqlId = null;
  for (let i = 0; i < arrayId.length; i++) {
    if (sqlId === null) {
      sqlId = 'id=' + arrayId[i];
    } else {
      sqlId += ' OR id=' + arrayId[i];
    }
  }
  addSql("run", tableName, "DELETE FROM " + tableName + ' WHERE ' + sqlId);
}

function deleteById(tableName, id, callBack) {
  addSql("run", tableName, "DELETE FROM " + tableName + ' WHERE id=' + id);
}

function updateById(tableName, id, value, callBack) {
  let sqlValue;
  switch (tableName) {
    case 'mapCells': {
      sqlValue = 'column=' + value.column + ' row=' + value.row + ' movable=' + value.movable === true ? 1 : 0 + ' objectId=' + value.objectId;
      addSql("run", tableName, "UPDATE " + tableName + ' SET ' + sqlValue + ' WHERE column=' + value.column + 'AND row=' + value.row);
    }
      break;
    case 'identificators': {
      if (value === null) {
        return;
      }
      sqlValue = 'accountId=' + value.accountId + ', characterId=' + value.characterId + ', animalId=' + value.animalId + ', itemId=' + value.itemId + ', mapItemId=' + value.mapItemId + ', recipeId=' + value.recipeId + ', inventoryId=' + value.inventoryId + ', stackId=' + value.stackId + ', zoneId=' + value.zoneId;
      addSql("run", tableName, "UPDATE " + tableName + ' SET ' + sqlValue);
    }
      break;
    case 'system': {
      if (value === null) {
        return;
      }
      sqlValue = 'systemBd=' + value;
      addSql("run", tableName, "UPDATE " + tableName + ' SET ' + sqlValue);
    }
      break;
  }
}

function updateAllById(tableName, array, callBack) {
  let sqlValue;
  switch (tableName) {
    case 'mapCells':
      for (let i = 0; i < array.length; i++) {
        sqlValue = 'column=' + array[i].column + ' row=' + array[i].row + ' movable=' + array[i].movable === true ? 1 : 0 + ' objectId=' + array[i].objectId;
        addSql("run", tableName, "UPDATE " + tableName + ' SET ' + sqlValue + ' WHERE column=' + array[i].column + 'AND row=' + array[i].row);
      }
      break;
    case 'characters':

      break;
    case 'inventories':

      break;
    case 'stacks':

      break;
    case 'characterRecipes':

      break;
  }
}


exports.createTable = createTable;
exports.insert = insert;
exports.insertAll = insertAll;
exports.drop = drop;
exports.selectAll = selectAll;
exports.deleteTable = deleteTable;
exports.deleteById = deleteById;
exports.deleteAllById = deleteAllById;
exports.updateAllById = updateAllById;
exports.pushDb = pushDb;
exports.fill = fill;
exports.updateById = updateById;
exports.rename = rename;