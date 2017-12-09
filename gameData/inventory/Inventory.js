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
module.exports=Inventory;