var GAME_BOARD_ROW = 20,
GAME_BOARD_COLUMN = 20,
SNAKE_SPEED = 200,
snake = [],
direction = "y+",
gameIsRunning = false,
snakeTimer,
foodTimer,
score = 0;

function init() {
    prepareGameField();

    document.getElementsByClassName('game-wrap')[0].style.width = "400px";

    document.getElementById("start-game").addEventListener("click", startGame);
    document.getElementById("refresh-game").addEventListener("click", refreshGame);


    addEventListener('keydown', changeDirection);

}


function prepareGameField() {
    var table = document.createElement("table");
    table.className = "game-table";

    for(i=0; i<GAME_BOARD_ROW; i++) {
        var row = document.createElement("tr");
        row.className = "game-table-row row-" + i;
        for(j=0; j<GAME_BOARD_COLUMN; j++) {
            var cell = document.createElement("td");
            cell.className = "game-table-cell cell-" + i + '-' + j; 
            row.append(cell);
        }
        table.append(row);  
    }
        document.getElementById("game-board").append(table);
}

function startGame () {
    if (gameIsRunning) {
        return;
    }
    gameIsRunning = true;
    respawn();

    snakeTimer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 4000);
}

function respawn() {
    var start_snake_x = Math.floor(GAME_BOARD_ROW / 2),
    start_snake_y = Math.floor(GAME_BOARD_COLUMN / 2),
    
    snake_head = document.getElementsByClassName("cell-"+ start_snake_y + "-" + start_snake_x)[0];
    snake_head.className += " snake-unit";

    var snake_tail = document.getElementsByClassName("cell-" + (start_snake_y-1) + "-" + start_snake_x)[0];
    snake_tail.className += " snake-unit";

    snake.push(snake_head);
    snake.push(snake_tail);
}


function move() {
    var snake_head_classes = snake[snake.length-1].getAttribute("class").split(" ");


    var new_unit,
    snake_coor = snake_head_classes[1].split("-"),
    snake_coor_y = parseInt(snake_coor[1]),
    snake_coor_x = parseInt(snake_coor[2]);

    if (direction == "x+") {
            new_unit = document.getElementsByClassName("cell-" + (snake_coor_y) + "-" + (snake_coor_x + 1))[0];
        } else if (direction=="x-") {
            new_unit = document.getElementsByClassName("cell-" + (snake_coor_y) + "-" + (snake_coor_x - 1))[0];
        } else if (direction=="y+") {
            new_unit = document.getElementsByClassName("cell-" + (snake_coor_y - 1) + "-" + (snake_coor_x))[0]; 
        } else if (direction=="y-") {
            new_unit = document.getElementsByClassName("cell-" + (snake_coor_y + 1) + "-" + (snake_coor_x))[0];
        };


        if(!isSnakeUnit(new_unit) && new_unit !== undefined) {

            new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
            snake.push(new_unit);

        if (!haveFood(new_unit)) {

                var removed = snake.splice(0, 1)[0],
                classes = removed.getAttribute("class").split(" ");
                removed.setAttribute('class', classes[0] + ' ' + classes[1]);
            }
        } else {
            finishGame();
        };
};


function isSnakeUnit(unit) {
    var check = false;

    if (snake.includes(unit)) {
        check = true;
    }

    return check;
}



function haveFood(unit) {
    var check = false,
    unit_classes = unit.getAttribute("class").split(" ");

    if(unit_classes.includes("food-unit")) {
        check = true;
        createFood();
        score++;
    }

    return check;

}

function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        var food_x = Math.floor(Math.random() * GAME_BOARD_COLUMN),
        food_y = Math.floor(Math.random() * GAME_BOARD_ROW);

        var food_cell = document.getElementsByClassName("cell-" + food_y + "-" + food_x)[0],
        food_cell_classes = food_cell.getAttribute("class").split(" ");

        if (!food_cell_classes.includes("snake_unit")) {
            food_cell.setAttribute('class', food_cell_classes.join(" ") + ' food-unit');
            foodCreated = true;

        }

    }
}

function changeDirection(e) {
    console.log(e);

    switch(e.keyCode) {
        case 37:
            if(direction != "x+") {
            direction = "x-";
        }
            break;
        case 38: 
            if(direction != "y-") {
            direction = "y+";
        }
            break;
        case 39: 
            if(direction != "x-") {
            direction = "x+";
        }
            break;
        case 40:
            if(direction != "y+") {
            direction = "y-";
        }
            break;
    }
}

function finishGame() {
    gameIsRunning = false;
    clearInterval(snakeTimer);
    alert('You lost! You final score is: ' + score.toString());
    refreshGame();
}

function refreshGame() {
    location.reload();
}

window.onload = init;