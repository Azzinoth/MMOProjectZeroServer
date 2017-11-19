const Request = require('./Request');
const{
	INVENTORY_CHANGE
} = require('../constants').messageTypes;
function requestInventory(idInventory, stacks, lenthStacks){
    let reqInventory = {idInventory:idInventory, stacks:stacks, length:lenthStacks};
    return new Request({type:INVENTORY_CHANGE, request:reqInventory});

}
module.exports = requestInventory;