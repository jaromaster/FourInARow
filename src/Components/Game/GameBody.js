import Sketch from 'react-p5'
import React, { useState} from 'react'
import { addToField, checkWin, getSelectedCol, highlightCol, highlightColRGB } from '../../GameLogic/GameLogic';
import './GameBody.css';

const GameBody = () => {

    // game field, width = 7, height = 6, red or blue: "r" / "b"
    let field = [
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""]
    ]
    let winner = ""; // empty string means no winner yet
    
    let currentTurn = ""; // which player is next
    if (Math.random() < 0.5){ // 50 % chance
        currentTurn = "b"
    }else{
        currentTurn = "r"
    }
    let hasClicked = false; // if player clicked a short time ago, only accept new clicks if hasClicked is false

    // setup p5
    const setup = (p5, canvasParentRef) => {
        // friendly errors are not check -> better performance
        p5.disableFriendlyErrors = true;
        // get width and height of div gameBody
        const divWidth = document.getElementById("gameBody").offsetWidth - 2;
        const divHeight = document.getElementById("gameBody").offsetHeight;
        p5.createCanvas(divWidth, divHeight).parent(canvasParentRef);
    }

    // draws field
    const draw = (p5) => {
        p5.clear()
        // get width and height of div gameBody
        const divWidth = document.getElementById("gameBody").offsetWidth - 2;
        const divHeight = document.getElementById("gameBody").offsetHeight;
        const circleRad = 80;
        const xStep = circleRad;
        const yStep = circleRad;
        

        // xStart: starting value of x, used for centering horizontally
        const xStart = (divWidth - field[0].length * xStep) / 2 + circleRad / 2
        let x = xStart
        // yStart: starting value of y, used for centering vertically
        let y = (divHeight - field.length * yStep) / 2 + circleRad / 2


        // cols defines bound of the single columns
        // used for user input (check which column was clicked)
        // schema: [starting x value of column, ending x value of column], for each column
        const colBounds = [
            [xStart-circleRad/2, xStart-circleRad/2 + circleRad], // first column
            [xStart-circleRad/2 + circleRad, xStart-circleRad/2 + 2*circleRad], // second column
            [xStart-circleRad/2 + 2*circleRad, xStart-circleRad/2 + 3*circleRad], // third column
            [xStart-circleRad/2 + 3*circleRad, xStart-circleRad/2 + 4*circleRad], // fourth column
            [xStart-circleRad/2 + 4*circleRad, xStart-circleRad/2 + 5*circleRad], // fifth column
            [xStart-circleRad/2 + 5*circleRad, xStart-circleRad/2 + 6*circleRad], // sixth column
            [xStart-circleRad/2 + 6*circleRad, xStart-circleRad/2 + 7*circleRad], // seventh column
        ]
        const selectedCol = getSelectedCol(colBounds, p5.mouseX);

        // highlighting could be optimized, as it is sometimes laggy
        if (selectedCol !== -1){
            if (currentTurn === "r"){
                highlightColRGB(selectedCol, colBounds, y, circleRad, p5, [255, 10, 10, 100])
            }else{
                highlightColRGB(selectedCol, colBounds, y, circleRad, p5, [10, 10, 255, 100])
            }
            
            if (p5.mouseIsPressed && !hasClicked) { // check if user clicked column and is allowed to click again
                // if won, reset game by clicking
                if (winner !== ""){
                    field = [
                        ["", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", ""],
                        ["", "", "", "", "", "", ""]
                    ]
                    winner = "";
                }
                else if (addToField(field, selectedCol, currentTurn)){
                    if (currentTurn === "b"){
                        currentTurn = "r";
                    }else{
                        currentTurn = "b";
                    }
                    // check win
                    winner = checkWin(field);
                }
                
                
                // prevent user from clicking multiple times per second (like holding mouse button)
                hasClicked = true;
                setTimeout(()=> {
                    hasClicked = false;
                }, 300);
            }
        }

        // draw text if player has won
        if (winner !== "") {
            const winText = winner === "r" ? "Red has won!" : "Blue has won!";
            const fontSize = 30;
            const winTextX = xStart + 4.5 * circleRad - p5.textWidth(winText); // center text horizontally
            const winTextY = y / 2 - fontSize / 2; // center text vertically
            if (winner === "r"){
                p5.fill("red");
            }else{
                p5.fill("blue");
            }
            p5.noStroke();
            p5.textSize(fontSize);
            p5.textStyle(p5.BOLD);
            p5.text(winText, winTextX, winTextY); // draw text
        }
        p5.noFill();

        // draw field (stones, rows, columns)
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j] === "r") {
                    p5.fill("red");
                }
                else if (field[i][j] === "b"){
                    p5.fill("blue");
                }
                p5.noStroke();
                p5.circle(x, y, circleRad);
                p5.noFill();
                p5.stroke(0);
                p5.rect(x-circleRad/2, y-circleRad/2, circleRad, circleRad);
                x += xStep;
            }
            x = xStart;
            y += yStep;
        }
    }


    return (
        <div id="gameBody">
            <Sketch setup={setup} draw={draw}/>
        </div>
    )
}

export default GameBody;