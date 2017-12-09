function Stack(id, itemId, size, inventoryId){
	this.id=id;
	this.itemId=itemId;
	this.size=size;
	this.inventoryId=inventoryId;
}
let stackProto={
    id:null,
	itemId:null,
	size:null,
	inventoryId:null
}
module.exports=Stack;