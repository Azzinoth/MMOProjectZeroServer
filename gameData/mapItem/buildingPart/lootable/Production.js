const Lootable = require('../Lootable');
const craft = require('../../../craft/craftItem');
function Production(id, mapItemId, typeId, location, characterId, durability, inventoryId, invenorySize, preparingTime) {
  Lootable.apply(this, arguments);
  this.preparingTime=preparingTime;
  this.currentPreparingTime=null;
  this.currentFuelTime = null;
  this.isInAction = false;
  this.fuelTime = [new Array(1, 2500)];
}
Production.prototype = Object.create(Lootable.prototype);
Production.prototype.onOff = function (inventory, stacks) {
  let beforeAction = this.isInAction;
  let result = [];
  if (this.isInAction === true){
    this.isInAction = false;
  }else if (this.currentFuelTime===null){
    let isAddedFuel = false;
    for(let i=0; i<inventory.stacks.length; i++){
      for (let j = 0; j<this.fuelTime.length; j++){
        if (stacks[inventory.stacks[i]].item!==null&&stacks[inventory.stacks[i]].item.typeId === this.fuelTime[j][0]){
          this.isInAction = true;
          result = inventory.removeItem(stacks, stacks[inventory.stacks[i]].item.typeId, 1);
          isAddedFuel = true;
          this.currentFuelTime=this.fuelTime[j][1];
        }
      }
      if (isAddedFuel)break;
    }
  }else{
    this.isInAction = true;
  }
  let isActionChange=false;
  if (beforeAction!==this.isInAction) isActionChange = true;
  return new Array(isActionChange, result);
}
Production.prototype.tick = function (inventory, stacks, recipeList, items) {
  let beforeAction = this.isInAction;
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
            this.currentFuelTime = this.fuelTime[j][1];
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
    for (let key in recipeList){
      if (recipeList[key].instrumentId === this.id){
        let craftResult = craft(inventory, stacks, recipeList[key], items);
        if (craftResult!==1 && craftResult!==2 && craftResult.length>0){
          result = result.concat(craftResult);
          let craftedItem = inventory.addItem(stacks, recipeList[key].craftedTypeId, recipeList[key].outputAmount);
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
  let isActionChange=false;
  if (beforeAction!==this.isInAction) isActionChange = true;
  return new Array(isActionChange, result);
}
module.exports = Production;