class Inventory{
	constructor ({id=0, size=24}){
		this.id = id;
		this.size = size;
		this.stacks = new Array(size);
	}
}
module.exports=Inventory;