const Bow = require('./unique/weapon/range/Bow');
const WoodWall = require('../mapItem/buildingPart/wall/WoodWall');
const StoneWall = require('../mapItem/buildingPart/wall/StoneWall');
const WoodChest = require('../mapItem/buildingPart/lootable/WoodChest');
const CampFire = require('../mapItem/buildingPart/lootable/production/CampFire');
const UniqueItem = require('./unique/UniqueItem');
const Lootable = require('../mapItem/buildingPart/Lootable');
const data = require('../data');


function createItem(typeId) {
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