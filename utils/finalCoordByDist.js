function getFinalCoord(fromX, fromY, vectorX, vectorY, distance){
  // let x1 = vectorX - fromX; //last x coordinate
  // let y1 = vectorY - fromY; //last y coordinate
  // let c1; //last hypotenuse (distance)
  // let c2 = distance;  //new hypotenuse
  // let a; //corner between x and c
  // let b; //corner between y and c
  // let cos_a;
  // let cos_b;
  // c1 = Math.sqrt(Math.pow(x1, 2)+Math.pow(y1, 2));
  // cos_a = x1/c1;
  // a = Math.acos(cos_a)/(Math.PI / 180); //additional transfer to degrees
  // if (x1>=0&&y1>=0) b = 90-a; //in degrees
  // else if (x1>=0&&y1<=0) b = 270-a;
  // else if (x1<=0&&y1<=0) b = 270-a;
  // else if (x1<=0&&y1>=0) b = 90-a;
  // cos_b = Math.cos(b*(Math.PI / 180)); //transfer to radians for function
  // return [(c2 * cos_a) + fromX, (c2 * cos_b) + fromY];
  if (fromX===vectorX&&fromY===vectorY) return[vectorX, vectorY];
  let normVecX = (vectorX - fromX) / Math.sqrt(Math.pow(vectorX - fromX, 2) + Math.pow(vectorY - fromY, 2));
  let normVecY = (vectorY - fromY) / Math.sqrt(Math.pow(vectorX - fromX, 2) + Math.pow(vectorY - fromY, 2));

  return [fromX + normVecX*distance, fromY + normVecY*distance];
}
module.exports = getFinalCoord;