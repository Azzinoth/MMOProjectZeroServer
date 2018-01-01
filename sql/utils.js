let db;
let sqlite3 = require('sqlite3').verbose();
const dataName = './sql/tables/dataBase.db';
let sqlQuery = new Array(2000);
function fill(){
    for (let i =0; i<sqlQuery.length; i++){
        sqlQuery[i]=new sqlObject();
    }
}

function pushDb(callback=null){
    return new Promise(function(resolve, reject) {
        let i=0;
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
            if (i===length||sqlQuery[i].active===false){
                db.close();
                resolve();
                return;
            }
            if (sqlQuery[i].sqlParam==="run") {
                db.serialize(function () {
                    db.run(sqlQuery[i].query, function (err) {
                        if (err) {
                            console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                            db.close();
                            resolve();
                            return;
                        }
                        console.log('Run table ' + sqlQuery[i].tableName);
                        sqlQuery[i].active = false;
                        i++;
                        follow(i);

                    });

               });
            }else{
                db.all(sqlQuery[i].query, function (err, rows) {
                    if (err) {
                        console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                        db.close();
                        resolve();
                        return;
                    }
                    if (callback!==null){
                        callback(rows,sqlQuery[i].tableName)
                    }
                    console.log('Select table ' + sqlQuery[i].tableName + " "+rows.length);
                    sqlQuery[i].active = false;
                    i++;
                    follow(i);

                });
            }
        }
    });
}

function addSql(type, tableName, sql){
    for (let i =0; i<sqlQuery.length; i++){
        if (sqlQuery[i].active===false){
            sqlQuery[i].tableName = tableName;
            sqlQuery[i].query = sql;
            sqlQuery[i].sqlParam = type;
            sqlQuery[i].active = true;
            break;
        }
        if (i===sqlQuery.length-1)sqlQuery.push(new sqlObject(sql, tableName, type, true));
    }
}
function createTable(tableName, tableArguments, callBack){
    addSql("run",tableName,"CREATE TABLE " + tableName + " (" + tableArguments + ");");
}

function insert(tableName, tableArguments, value, callBack){
    addSql("run",tableName,"INSERT INTO " + tableName + " (" + tableArguments + ") VALUES" + " (" + value + ");");
}

function insertAll(tableName, array, callBack){

    // return new Promise(function(resolve, reject) {
        if (array===null){
            return;
        }
        // let values =null;
        switch(tableName){
            case 'accounts':{
                for (let key in array){
                    let id = key;
                    let email = array[key].email;
                    let password = array[key].password;
                    insert(tableName, 'id, email, password', id+', \''+email+'\', \''+password+'\'');
                    // if (values===null){
                    //     values = '('+id+', '+email+', '+password+')';
                    // }else  values += ', ('+id+', '+email+', '+password+')';
                }

            }
            break;
            case 'characters':{
                for (let key in array){
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
                    insert(tableName, 'id, accountId, inventoryId, armorInventoryId, hotBarId, activeHotBarCell, column, row, top, left, level, health, strength, viewDistance',
                        id+', '+accountId+', '+inventoryId+', '+armorInventoryId+', '+hotBarId+', '+activeHotBarCell+', '+column+', '+row+', '+top+', '+left+', '+level+', '+health+', '+strength+', '+viewDistance);
                    // if (values===null){
                    //     values = '('+id+', '+accountId+', '+inventoryId+', '+armorInventoryId+', '+hotBarId+', '+activeHotBar+', '+column+', '+row+', '+top+', '+left+', '+level+', '+health+', '+strength+', '+viewDistance+')';
                    // }else  values += ', ('+key+', '+accountId+', '+inventoryId+', '+armorInventoryId+', '+hotBarId+', '+activeHotBar+', '+column+', '+row+', '+top+', '+left+', '+level+', '+health+', '+strength+', '+viewDistance+')';
                }
            }
                break;
            case 'inventories':
                for (let key in array){
                    let id = key;
                    let size = array[key].size;
                    insert(tableName, 'id, size', id+', '+size);
                    // if (values===null){
                    //     values = '('+id+', '+size+')';
                    // }else  values += ', ('+id+', '+size+')';
                }

                    break;
            case 'characterRecipes':
                for (let key in array){
                    let characterId = key;
                    for (let i =0; i<array[key].craftRecipesId.length; i++){
                        let recipeId = array[key].craftRecipesId[i];
                        insert(tableName, 'characterId, recipeId', characterId+', '+recipeId);
                        // if (values===null){
                        //     values = '('+characterId+', '+recipeId+')';
                        // }else  values += ', ('+characterId+', '+recipeId+')';
                    }
                }

                break;
            case 'stacks':
                for (let key in array){
                    let id = parseInt(key);
                    let size = array[key].size;
                    let inventoryId = array[key].inventoryId;
                    let position = array[key].position;
                    insert(tableName, 'id, size, inventoryId, position', id+', '+size+', '+inventoryId+', '+position);
                    if (array[key].item!==null){
                        if (array[key].item.typeId===5){
                            insert('weaponsRange', 'typeId, itemId, durability, stackId', array[key].item.typeId+', '+array[key].item.itemId+', '+array[key].item.durability+', '+id);
                        }else{
                            insert('commonItems', 'typeId, name, stackSize, stackId', array[key].item.typeId+', \''+array[key].item.typeName+'\', '+size+', '+id);
                        }
                    }
                    // if (values===null){
                    //     values = '('+id+', '+itemId+', '+size+', '+inventoryId+')';
                    // }else  values += ', ('+id+', '+itemId+', '+size+', '+inventoryId+')';
                }

                break;
            // case 'commonItems':
            //     for (let key in array){
            //         let stackId = array[key].stackId;
            //         let typeId = array[key].typeId;
            //         let stackSize = array[key].stackSize;
            //         let name = array[key].name;
            //         insert(tableName, 'typeId, name, stackSize, stackId', typeId+', \''+name+'\', '+stackSize+', '+stackId);
            //         // if (values===null){
            //         //     values = '('+id+', '+itemId+', '+size+', '+inventoryId+')';
            //         // }else  values += ', ('+id+', '+itemId+', '+size+', '+inventoryId+')';
            //     }
            //
            //     break;
            case 'weaponsRange':
                for (let key in array){
                    let stackId = array[key].stackId;
                    let typeId = array[key].typeId;
                    let durability = array[key].durability;
                    let itemId = array[key].itemId;
                    insert(tableName, 'typeId, itemId, durability, stackId', typeId+', '+itemId+', '+durability+', '+stackId);
                    // if (values===null){
                    //     values = '('+id+', '+itemId+', '+size+', '+inventoryId+')';
                    // }else  values += ', ('+id+', '+itemId+', '+size+', '+inventoryId+')';
                }

                break;
            case 'items':

                break;
            case 'mapItems':

                break;
                break;
            case 'recipeList':

                break;
        }
        // if (values!==null) {
        //     addSql("run",tableName,'INSERT INTO ' + tableName + ' VALUES'+values);
        // }
        // values = null;
}

function selectAll(tableName, callBack){
    addSql("all",tableName,"SELECT * FROM " + tableName);
}

function drop(tableName){
    addSql("run",tableName,"DROP TABLE " + tableName);
}
function deleteTable(tableName, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName);
}
function deleteAllById(tableName, arrayId, callBack){

        if (arrayId.length<=0){
            return;
        }
            let sqlId = null;
            for(let i=0; i<arrayId.length; i++){
                if (sqlId===null){
                    sqlId = 'id='+arrayId[i];
                } else{
                    sqlId += ' OR id='+arrayId[i];
                }
            }
            addSql("run",tableName,"DELETE FROM " + tableName+' WHERE '+sqlId);
}
function deleteById(tableName, id, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName+' WHERE id='+id);
}
function updateById(tableName, id, value, callBack){
        let sqlValue;
        switch (tableName){
            case 'mapCells':{
                sqlValue = 'column='+value.column+' row='+value.row+' movable='+value.movable===true?1:0+' objectId='+value.objectId;
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+value.column+'AND row='+value.row);
            }
            case 'identificators':{
                if (value===null){
                    return;
                }
                sqlValue = 'accountId='+value.accountId+', characterId='+value.characterId+', animalId='+value.animalId+', itemId='+value.itemId+', mapItemId='+value.mapItemId+', recipeId='+value.recipeId+', inventoryId='+value.inventoryId+', stackId='+value.stackId+', zoneId='+value.zoneId;
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue);
            }
        }
}
function updateAllById(tableName, array, callBack){
        let sqlValue;
        switch (tableName){
            case 'mapCells':
                for (let i = 0; i<array.length; i++){
                    sqlValue = 'column='+array[i].column+' row='+array[i].row+' movable='+array[i].movable===true?1:0+' objectId='+array[i].objectId;
                    addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+array[i].column+'AND row='+array[i].row);
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
function sqlObject(query=null, tableName=null, sqlParam=null, active=false){
    this.query=query;
    this.tableName=tableName;
    this.sqlParam = sqlParam;
    this.active = active;
}
let sqlObjectProto ={
    query:null,
    tableName: null,
    sqlParam : null,
    active : false
}
exports.createTable = createTable;
exports.insert = insert;
exports.insertAll = insertAll;
exports.drop = drop;
exports.selectAll = selectAll;
exports.deleteTable =deleteTable;
exports.deleteById =deleteById;
exports.deleteAllById =deleteAllById;
exports.updateAllById=updateAllById;
exports.pushDb = pushDb;
exports.fill = fill;
exports.updateById=updateById;