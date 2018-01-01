function Inventory(id, size){
	this.id = id;
	this.size = size;
	this.stacks = new Array(size);
}
let inventoryProto = {
    id : null,
	size : null,
	stacks : null
}
Inventory.prototype.clear = function(allStacks){
	for (let i =0; i<this.stacks.length; i++){
		if (allStacks[this.stacks[i]].item!==null){
			allStacks[this.stacks[i]].item = null;
			allStacks[this.stacks[i]].size = null;
        }
	}
}
module.exports=Inventory;