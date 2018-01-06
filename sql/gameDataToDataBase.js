
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
let isBusy = false;
let timeLoop = 50000;
function toDataBase(sqlUtils, data){

setInterval(function(){
    // sqlUtils.initDB().then(
    if (!isBusy){
        isBusy = true;
        sqlUtils.updateById('system', null, 1);
        sqlUtils.createTable('identificatorsTmp');
        sqlUtils.insertAll('identificatorsTmp', data.identificators);
        sqlUtils.createTable('accountsTmp');
        sqlUtils.insertAll('accountsTmp',data.accounts);
        sqlUtils.createTable('charactersTmp');
        sqlUtils.insertAll('charactersTmp',data.characters);
        sqlUtils.createTable('inventoriesTmp');
        sqlUtils.insertAll('inventoriesTmp', data.inventories);
        sqlUtils.createTable('stacksTmp');
        sqlUtils.createTable('commonItemsTmp');
        sqlUtils.createTable('weaponsRangeTmp');
        sqlUtils.insertAll('stacksTmp', data.stacks);
        sqlUtils.createTable('characterRecipesTmp');
        sqlUtils.insertAll('characterRecipesTmp', data.characters);
        //sqlUtils.updateAllById('mapCells', data.getMap());
        sqlUtils.updateById('system', null, 2);

        sqlUtils.pushDb().then(
        result=> {
            sqlUtils.drop('identificators'),
            sqlUtils.drop('accounts'),
            sqlUtils.drop('characters'),
            sqlUtils.drop('inventories'),
            sqlUtils.drop('stacks'),
            sqlUtils.drop('commonItems'),
            sqlUtils.drop('weaponsRange'),
            sqlUtils.drop('characterRecipes'),
            sqlUtils.updateById('system', null, 3),

            sqlUtils.pushDb().then(
                result=> {
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
                    result=> {
                        isBusy = false,
                        console.log('backup database ')
                    })

                })
        });
    }
}, timeLoop);
}
exports.toDataBase = toDataBase;
// exports.addData = addData;
// exports.addAllData = addAllData;
// exports.deleteData = deleteData;