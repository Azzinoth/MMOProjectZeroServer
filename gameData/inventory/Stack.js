function Stack(id, inventoryId){
	this.id=id;
	this.item=null;
	this.size=null;
	this.inventoryId=inventoryId;
}
let stackProto={
    id:null,
	itemId:null,
	size:null,
	inventoryId:null
}
module.exports=Stack;