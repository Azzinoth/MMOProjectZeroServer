const CommonItem = require('./common/CommonItem');
const Bow = require('./unique/weapon/range/Bow');
const WoodWall = require('../mapItem/buildingPart/wall/WoodWall');
const StoneWall = require('../mapItem/buildingPart/wall/StoneWall');
const WoodChest = require('../mapItem/buildingPart/lootable/WoodChest');
const CampFire = require('../mapItem/buildingPart/lootable/production/CampFire');
const data = require('../data');

function createItem(typeId) {
  let obj;
  switch (typeId) {
    case 1:
    case 2:
    case 8:
    case 9:
    case 10:
      obj = new CommonItem(typeId, 'RESOURCE', 20);
      break;
    case 3:
      obj = new CommonItem(typeId, 'BUILDING_PART', 1);
      break;
    case 4:
      obj = new CommonItem(typeId, 'BUILDING_PART', 1);
      break;
    case 5:
      let itemId = data.getId('item');
      obj = new Bow(typeId, itemId);
      break;
    case 6:
      obj = new CommonItem(typeId, 'AMMO', 20);
      break;
    case 7:
      obj = new CommonItem(typeId, 'BUILDING_PART', 1);
      break;
  }
  return obj;
}

function createMapItem(catalogId, characterId) {
  let obj;
  let mapItemId = data.getId('mapItem');
  let inventoryId = null;
  switch (catalogId) {
    case 22:
      obj = new WoodWall(catalogId, mapItemId, characterId);
      break;
    case 26:
      obj = new StoneWall(catalogId, mapItemId, characterId);
      break;
    case 23:
      inventoryId = data.createInventory(8);
      obj = new WoodChest(catalogId, mapItemId, characterId, inventoryId);
      break;
    case 25:
      inventoryId = data.createInventory(6);
      obj = new CampFire(catalogId, mapItemId, characterId, inventoryId);
      break;
  }
  return obj;
}

exports.createItem = createItem;
exports.createMapItem = createMapItem;