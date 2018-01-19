const Lootable = require('../Lootable');
const craft = require('../../../craft/craftItem');
function Production(id, mapItemId, typeId, location, characterId, durability, inventoryId, preparingTime) {
  Lootable.apply(this, arguments);
  this.preparingTime=preparingTime;
  this.currentPreparingTime=null;
  this.currentFuelTime = null;
  this.isInAction = false;
  this.fuelTime = [new Array(1, 50)];
}
Production.prototype = Object.create(Lootable.prototype);
Production.prototype.onOff = function (inventory, stacks) {
  if (this.isInAction === true){
    this.isInAction = false;
    return;
  }
  for(let i=0; i<inventory.stacks.length; i++){
    for (let j = 0; j<this.fuelTime.length; j++){
      if (stacks[inventory.stacks[i]].item!==null&&stacks[inventory.stacks[i]].item.typeId === this.fuelTime[j][0]){
        this.isInAction = true;
        if (this.currentFuelTime === null)this.currentFuelTime=this.fuelTime[j][1];
      }
    }
  }
}
Production.prototype.tick = function (inventory, stacks, recipeList, items) {
  let result = [];
  this.currentFuelTime--;
  if (this.currentFuelTime<=0){
    ////////Get fuel
    let isAddedFuel = false;
    for (let i=0; i<inventory.stacks.length; i++){
      if (stacks[inventory.stacks[i]].item!==null){
        for (let j=0; j<this.fuelTime.length; j++){
          if (stacks[inventory.stacks[i]].item.typeId === this.fuelTime[j][0]){
            result = inventory.removeItem(stacks, stacks[inventory.stacks[i]].item.typeId, 1);
            this.currentFuelTime === this.fuelTime[j][1];
            isAddedFuel = true;
            break
          }
        }
      }
      if (isAddedFuel) break;
    }
    if (!isAddedFuel){
      this.currentFuelTime = null;
      this.onOff();
    }
  }
  // let isAllIngredients;
  this.currentPreparingTime++;
  if (this.preparingTime<=this.currentPreparingTime){
    this.currentPreparingTime = 0;
    //////Craft item
    for (let i=0; i<recipeList.length; i++){
      if (recipeList[i].instrumentId === this.id){
        let craftResult = craft(inventory, stacks, recipeList[i], items);
        if (craftResult!==1 && craftResult!==2 && craftResult.length>0){
          result = result.concat(craftResult);
          let craftedItem = inventory.addItem(stacks, recipeList[i].craftedTypeId, recipeList[i].outputAmount);
          result = result.concat(craftedItem);
        }
        // isAllIngredients = true;
        // for (let j=0; j<recipeList[i].ingredients.length; j++){
        //   let amount = recipeList[i].ingredients[j].amount;
        //   for (let k=0; k<inventory.stacks.length; k++){
        //     if (stacks[inventory.stacks[k]].item!==null){
        //       if (stacks[inventory.stacks[k]].item.typeId === recipeList[i].ingredients[j].typeId){
        //         amount -=stacks[inventory.stacks[k]].size;
        //       }
        //       if (amount<=0) break;
        //       if (k===inventory.stacks.length-1)isAllIngredients=false
        //     }
        //   }
        //   if (!isAllIngredients) break;
        // }
        // if (isAllIngredients) {
        //   craftedItemId = recipeList[i].craftedTypeId;
        //   amount = recipeList[i].outputAmount;
        //   break;
        // }
      }
    }
  }
  return result;
}
module.exports = Production;