const MapItem = require('./MapItem');
const itemUtils = require('../item/itemUtils');
function Resource(id, mapItemId, typeId) {
    MapItem.apply(this, arguments);
    this.isStartLooted = false;
    this.lootChance = null; ///lootChance array with itemId, quantity, chance
    this.mapInventoryId = null;
}
Resource.prototype = Object.create(MapItem.prototype);
Resource.prototype.getLoot = function (data) {
    let result = [];
    if (this.lootChance===null) return result;
    if (!this.isStartLooted){
        this.mapInventoryId = data.createMapInventory(this.lootChance.length);
        this.isStartLooted = true;
        for (let i =0; i<this.lootChance.length; i++){
            let rand = Math.floor(Math.random() * (101));
            if (rand<=this.lootChance[i][2]){
                data.mapStacks[data.mapInventories[this.mapInventoryId].stacks[i]].item = itemUtils.createItem(this.lootChance[i][0]);
                data.mapStacks[data.mapInventories[this.mapInventoryId].stacks[i]].size = this.lootChance[i][1];
            }
        }
    }
    for (let i=0; i<data.mapInventories[this.mapInventoryId].stacks.length; i++){
        let itemId = data.mapStacks[data.mapInventories[this.mapInventoryId].stacks[i]].item.typeId;
        let size = data.mapStacks[data.mapInventories[this.mapInventoryId].stacks[i]].size;
        result.push(new Array(itemId, size));
    }
    this.looted(data);
    return result;
}
Resource.prototype.looted = function (data) {
    for (let i=0; i<data.mapInventories[this.mapInventoryId].stacks.length; i++){
        delete data.stacks[data.mapInventories[this.mapInventoryId].stacks[i]];
    }
    delete data.mapInventories[this.mapInventoryId];
    this.isStartLooted = false;
    this.lootChance = null;
    this.mapInventoryId = null;
}

module.exports = Resource;