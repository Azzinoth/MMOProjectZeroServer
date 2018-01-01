const CommonItem = require('./common/CommonItem');
const Bow = require('./unique/weapon/range/Bow');
const data = require('../data');
function createItem(typeId){
    let obj;

    switch (typeId) {
        case 1:
            obj = new CommonItem(typeId, 'RESOURCE', 20);
            break;
        case 2:
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
exports.createItem = createItem;