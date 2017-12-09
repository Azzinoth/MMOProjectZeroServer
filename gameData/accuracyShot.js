function getAccuracy(accuracy) {
    let currentRadius0 = accuracy * 0.2;
    let currentRadius1 = accuracy * 0.55;
    let currentRadius2 = accuracy * 0.85;
    let array =new Array(2);
    let sx = 0;
    let sy = 0;

    let rand = Math.random();

    if (rand <= 0.15) {
        sx = -currentRadius0 / 2 + currentRadius0 * Math.random();
        sy = -currentRadius0 / 2 + currentRadius0 * Math.random();
    } else if (rand > 0.15 && rand <= 0.5) {
        currentRadius = accuracy * 0.2;
        sx = -currentRadius1 / 2 + currentRadius1 * Math.random();
        while (Math.abs(sx) <= currentRadius0 / 2) {
            sx = -currentRadius1 / 2 + currentRadius1 * Math.random();
        }
        sy = -currentRadius1 / 2 + currentRadius1 * Math.random();
        while (Math.abs(sy) <= currentRadius0 / 2) {
            sy = -currentRadius1 / 2 + currentRadius1 * Math.random();
        }
    } else if (rand > 0.5 && rand <= 1) {
        sx = -currentRadius2 / 2 + currentRadius2 * Math.random();
        while (Math.abs(sx) <= currentRadius1 / 2) {
            sx = -currentRadius2 / 2 + currentRadius2 * Math.random();
        }
        sy = -currentRadius2 / 2 + currentRadius2 * Math.random();
        while (Math.abs(sy) <= currentRadius1 / 2) {
            sy = -currentRadius2 / 2 + currentRadius2 * Math.random();
        }
    }
    array[0]=sx;
    array[1]=sy;
    return array;
}
exports.getAccuracy = getAccuracy;