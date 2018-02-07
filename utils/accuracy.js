function calculateAccurace(accuracy, initX, initY, finalX, finalY){
  let result =new Array(2);
  let angle0 = accuracy * 0.2;
  let angle1 = accuracy * 0.55;
  let angle2 = accuracy * 0.85;

  let currentAngle = 0;

  let rand = Math.random();

  if (rand <= 0.15) {
    currentAngle = 0 + angle0 * Math.random();
  } else if (rand > 0.15 && rand <= 0.7) {
    currentAngle = angle0 + (angle1 - angle0) * Math.random();
  } else if (rand > 0.7) {
    currentAngle = angle1 + (angle2 - angle1) * Math.random();
  }

  rand = Math.random();
  if (rand <= 0.5) {
    currentAngle = -currentAngle;
  }


  // * TO MOUSE VECTOR *
  let tempMagnitude = Math.sqrt(Math.pow(finalX - initX, 2) + Math.pow(finalY - initY, 2));
  let normalizedVector = new Array();

  normalizedVector.push((finalX - initX) / tempMagnitude);
  normalizedVector.push((finalY - initY) / tempMagnitude);
  // * TO MOUSE VECTOR END *

  let a = currentAngle * (Math.PI / 180.0);
  let newx = normalizedVector[0]* Math.cos(a) - normalizedVector[1]*Math.sin(a);
  let newy = normalizedVector[0]*Math.sin(a) + normalizedVector[1]*Math.cos(a);

  //AddFiredAmmo(humans[0].left, humans[0].top, worldMouseX, worldMouseY, 750, null);
  result[0] = initX + newx * 100;
  result[1] = initY + newy * 100;
  return result;
}
module.exports = calculateAccurace;