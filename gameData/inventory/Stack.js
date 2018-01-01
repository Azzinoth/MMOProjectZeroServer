function Stack(id, inventoryId, position){
	this.id=id;
	this.item=null;
	this.size=null;
	this.inventoryId=inventoryId;
	this.position = position;
}
let stackProto={
    id:null,
	itemId:null,
	size:null,
	inventoryId:null
}
module.exports=Stack;