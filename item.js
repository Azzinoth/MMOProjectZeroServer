class Item {
    constructor({id = -1, name= null, type = null, stackSize = 10}) {
        this.id = id;
        this.name = name;
        this.type = type;
		this.stackSize = stackSize;
    }
}
exports.Item = Item;