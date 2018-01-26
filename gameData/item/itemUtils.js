const WoodChest = require('../mapItem/buildingPart/lootable/WoodChest');
const CampFire = require('../mapItem/buildingPart/lootable/production/CampFire');
const UniqueItem = require('./unique/UniqueItem');
const Instruments = require('./unique/Instruments');
const Lootable = require('../mapItem/buildingPart/Lootable');
const data = require('../data');


function createItem(typeId) {
  console.log(data.items[typeId] instanceof (UniqueItem));
  console.log(data.items[typeId] instanceof (Instruments));
  if (data.items[typeId] instanceof (UniqueItem)){
    let itemId = data.getId('item');
    return data.items[typeId].create(itemId);
  }else{
    return data.items[typeId].create();
  }
  // for (let key in items){
  //   if (key == items.typeId){
  //
  //     return items[key].create(itemId);
  //   }
  // }
  // return null;
}

function createMapItem(catalogId, characterId, location) {
  let mapItemId = data.getId('mapItem');
  if (data.mapItemsCatalog[catalogId] instanceof (Lootable)){
    let inventoryId = data.createInventory(data.mapItemsCatalog[catalogId].inventorySize);
    return data.mapItemsCatalog[catalogId].create(mapItemId, location, characterId, inventoryId);
  }else{
    return data.mapItemsCatalog[catalogId].create(mapItemId, location, characterId);
  }
}

exports.createItem = createItem;
exports.createMapItem = createMapItem;