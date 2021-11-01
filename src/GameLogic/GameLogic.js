// GameLogic contains all helper functions

// check in which column mouseX is
export const getSelectedCol = (colBounds, mouseX) => {
    for (let i = 0; i < colBounds.length; i++) {
        if (mouseX > colBounds[i][0] && mouseX < colBounds[i][1]){
            return i
        }
    }
    return -1
}

// paints colored rectangle to highlight the selected column
// takes an array rgb with all rgb values [R, G, B, A] (A can be omitted)
export const highlightColRGB = (col, colBounds, y, circleRad, p5, rgb) => {
    const x = colBounds[col][0];
    const width = circleRad;
    const height = 6 * width;

    p5.noFill();
    p5.stroke(rgb[0], rgb[1], rgb[2], rgb.length === 4 ? rgb[3] : 255);
    p5.strokeWeight(4);
    p5.rect(x, y-circleRad/2, width, height);
    p5.strokeWeight(1);
}

// insert new player-stone into game field
// returns true on success, else false (if stone cant be inserted)
export const addToField = (field, col, stoneColor) => {
    // column already full
    if (field[0][col] !== ""){
        return false;
    }
    for (let i = 0; i < field.length; i++) {
        // check if last element of col
        if (i+1 >= field.length){
            field[i][col] = stoneColor;
            return true;
        }
        // check if stone already placed, true: place new stone before
        else if (field[i+1][col] !== "") {
            field[i][col] = stoneColor;
            return true;
        }
    }
    return false;
}

// check if player won (4 same stones in a row/column/diagonally)
// returns color of winner, else ""
export const checkWin = (field) => {

    // check diagonals for win
    let diagonals = getFieldDiagonals(field);
    for (let i = 0; i < diagonals.length; i++) {
        let cur = diagonals[i][0];
        let cursInDiag = 1;
        for (let j = 1; j < diagonals[i].length; j++) {
            if (diagonals[i][j] === cur) {
                cursInDiag++;
            }else{
                cur = diagonals[i][j];
                cursInDiag = 1;
            }
            // won
            if (cursInDiag >= 4 && cur !== ""){
                return cur;
            }
        }
    }
    
    // check rows for win
    for (let i = 0; i < field.length; i++) {
        let cur = field[i][0];
        let cursInARow = 1;
        for (let j = 1; j < field[i].length; j++) {
            if (field[i][j] === cur){
                cursInARow++;
            }else{
                cur = field[i][j];
                cursInARow = 1;
            }
            // won
            if (cursInARow >= 4 && cur !== ""){
                return cur;
            }
        }
    }

    // check columns for win
    for (let i = 0; i < field[0].length; i++) {
        let cur = field[0][i];
        let cursInACol = 1;
        for (let j = 1; j < field.length; j++) {
            if (field[j][i] === cur){
                cursInACol++;
            }else{
                cur = field[j][i];
                cursInACol = 1;
            }
            // won
            if (cursInACol >= 4 && cur !== ""){
                return cur;
            }
        }
    }
    return "";
}

// return all diagonals of field (length >= 4, because if smaller: can't have four same stones)
const getFieldDiagonals = (field) => {
    let diagonals = [];

    // starting positions for: top left to bottom right - diagonals
    let topLeftStartPositions = [
        [2,0],
        [1,0],
        [0,0],
        [0,1],
        [0,2],
        [0,3]
    ]
    // starting position for: bottom left to up right - diagonals
    let bottomLeftStartPositions = [
        [3,0],
        [4,0],
        [5,0],
        [5,1],
        [5,2],
        [5,3]
    ]

    // top to bottom
    for (let i = 0; i < topLeftStartPositions.length; i++) {
        let row = topLeftStartPositions[i][0];
        let col = topLeftStartPositions[i][1];

        let diagonal = [];
        while (row < field.length && col < field[0].length){
            diagonal.push(field[row][col]);
            row++;
            col++;
        }
        diagonals.push(diagonal);
    }
    // bottom to top
    for (let i = 0; i < bottomLeftStartPositions.length; i++) {
        let row = bottomLeftStartPositions[i][0];
        let col = bottomLeftStartPositions[i][1];

        let diagonal = [];
        while (row >= 0 && col < field[0].length){
            diagonal.push(field[row][col]);
            row--;
            col++;
        }
        diagonals.push(diagonal);
    }
    return diagonals;
}

// return random char: "r" or "b" (red and blue)
export const generateRandomTurn = () => {
    if (Math.random() < 0.5){ // 50 % chance
        return "b";
    }else{
        return "r";
    }
}