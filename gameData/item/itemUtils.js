const CommonItem = require('./common/CommonItem');
const Bow = require('./unique/weapon/range/Bow');
function createItem(typeId, itemId){
    let obj;

    switch (typeId) {
        case 1:
            obj = new CommonItem(typeId, 'resource', 20);
            break;
        case 2:
            obj = new CommonItem(typeId, 'resource', 20);
            break;
        case 3:
            obj = new CommonItem(typeId, 'buildingPart', 1);
            break;
        case 4:
            obj = new CommonItem(typeId, 'buildingPart', 1);
            break;
        case 5:
            obj = new Bow(typeId, itemId);
            break;
        case 6:
            obj = new CommonItem(typeId, 'ammo', 20);
            break;
    }
    return obj;
}
exports.createItem = createItem;