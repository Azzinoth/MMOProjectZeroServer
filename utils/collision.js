function isCollision(X_f,Y_f,W_f,H_f,X_s,Y_s,W_s,H_s) {
    let second_top = Y_f;
    let second_bottom = Y_f + H_f;
    let second_left = X_f;
    let second_right = X_f + W_f;

    let first_top = Y_s;
    let first_bottom = Y_s + H_s;
    let first_left = X_s;
    let first_right = X_s + W_s;

    return ((second_top <= first_bottom) &&
        (second_left <= first_right) &&
        ((second_top >= first_top) &&
            (second_right > first_left)))
}
exports.isCollision = isCollision;