const CommonItem = require('./common/CommonItem');
const Bow = require('./unique/weapon/range/Bow');
const WoodWall = require('../mapItem/buildingPart/wall/WoodWall');
const StoneWall = require('../mapItem/buildingPart/wall/StoneWall');
const data = require('../data');

function createItem(typeId) {
  let obj;
  switch (typeId) {
    case 1:
    case 2:
    case 8:
    case 9:
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

function createMapItem(catalogId, mapItemId, characterId) {
  let obj;
  switch (catalogId) {
    case 3:
      obj = new WoodWall(catalogId, mapItemId, characterId);
      break;
    case 4:
      obj = new StoneWall(catalogId, mapItemId, characterId);
      break;
    case 23:
      obj = new WoodChest(catalogId, mapItemId, characterId);
      break;
    case 25:
      obj = new CampFire(catalogId, mapItemId, characterId);
      break;
  }
  return obj;
}

exports.createItem = createItem;
exports.createMapItem = createMapItem;