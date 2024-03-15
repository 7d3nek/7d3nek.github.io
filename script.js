import Snake from './snake.js';

const playBoard = document.querySelector(".play-board");
const player1Score = document.querySelector(".p1-score");
const player2Score = document.querySelector(".p2-score");
const timerElement = document.querySelector(".timer");

let gameOver = false;
let gameStart = true;
let timerStarted = false;
let foodX, foodY;
let foodSymbol = "🍎";
let normalFood = "🍎";
let twoPointFood = "🍔";
let minusPointFood = "💣";
let setIntervalId;
let setTimerId;
let p1Collision = false;
let p2Collision = false;

const ROWS = 25;
const COLS = 25;

const snake1 = new Snake("blue", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", COLS, ROWS);
const snake2 = new Snake("green", "w", "s", "a", "d", COLS, ROWS);

const pickFood = () => {
    let rnd = Math.floor(Math.random() * 10) + 1;
    if (rnd === 9 || rnd === 8) foodSymbol = twoPointFood;
    else if (rnd === 7) foodSymbol = minusPointFood;
    else foodSymbol = normalFood;
}

const startTimer = () => {
    let min = 4
    let sec = 60;
    setTimerId = setInterval(() => {
        sec--;

        if (min === 0 && sec === 0){
            handleGameOver();
        }

        if (sec === 0) {
            min--;
            sec = 60;
        }
        if (sec < 10){
            timerElement.textContent = `0${min}:0${sec}`;
        } else {
            timerElement.textContent = `0${min}:${sec}`;
        }
        
    }, 1000);
}

const changeFoodPosition = () => {
    // Random food position 1 - 25
    pickFood();
    foodX = Math.floor(Math.random() * COLS) + 1;
    foodY = Math.floor(Math.random() * ROWS) + 1;
}

const generateSnake = () => {
    if(snake1.x === foodX && snake1.y === foodY) {
        snake1.generateSnakePosition();
    }

    if(snake2.x === foodX && snake2.y === foodY) {
        snake2.generateSnakePosition();
    }
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    clearInterval(setTimerId);

    let winner = "";
    if (p1Collision && p2Collision){
        winner = "It's a tie!"
    } else if (p1Collision){
        winner = "Player 2 won!";
    } else if (p2Collision) {
        winner = "Player 1 won!";
    } else if (snake1.score > snake2.score){
        winner = "Player 1 won!";
    } else if (snake1.score < snake2.score){
        winner = "Player 2 won!";
    } else {
        winner = "It's a tie!"
    }

    callAlert(`Game over! ${winner}`);
}

const changeDirection = (event) => {
    if(event.key === snake1.keyUp && snake1.velocityY != 1) {
        snake1.velocityX = 0;
        snake1.velocityY = -1;
    } else if(event.key === snake1.keyDown && snake1.velocityY != -1) {
        snake1.velocityX = 0;
        snake1.velocityY = 1;
    } else if(event.key === snake1.keyLeft && snake1.velocityX != 1) {
        snake1.velocityX = -1;
        snake1.velocityY = 0;
    } else if(event.key === snake1.keyRight && snake1.velocityX != -1) {
        snake1.velocityX = 1;
        snake1.velocityY = 0;
    } else if(event.key === snake2.keyUp && snake2.velocityY != 1) {
        snake2.velocityX = 0;
        snake2.velocityY = -1;
    } else if(event.key === snake2.keyDown && snake2.velocityY != -1) {
        snake2.velocityX = 0;
        snake2.velocityY = 1;
    } else if(event.key === snake2.keyLeft && snake2.velocityX != 1) {
        snake2.velocityX = -1;
        snake2.velocityY = 0;
    } else if(event.key === snake2.keyRight && snake2.velocityX != -1) {
        snake2.velocityX = 1;
        snake2.velocityY = 0;
    }

    if(!timerStarted){
        startTimer();
        timerStarted = true;
    }
}

const checkSnakeCollision = () => {
    const [head1X, head1Y] = snake1.snakeBody[0];
    const [head2X, head2Y] = snake2.snakeBody[0];

    // Check if the heads of the two snakes collide
    if (head1X === head2X && head1Y === head2Y) {
        gameOver = true;
        p1Collision = true;
        p2Collision = true;
    }

    // Check if any part of snake 1 collides with snake 2
    for (let i = 0; i < snake2.snakeBody.length; i++) {
        const [x, y] = snake2.snakeBody[i];
        if (head1X === x && head1Y === y) {
            gameOver = true;
            p1Collision = true;
            break;
        }
    }

    // Check if any part of snake 2 collides with snake 1
    for (let i = 0; i < snake1.snakeBody.length; i++) {
        const [x, y] = snake1.snakeBody[i];
        if (head2X === x && head2Y === y) {
            gameOver = true;
            p2Collision = true;
            break;
        }
    }
}

const initGame = () => {
    if(gameOver) return handleGameOver();

    if(gameStart){
        generateSnake();
        gameStart = false;
    }

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}">${foodSymbol}</div>`;

    if(snake1.x === foodX && snake1.y === foodY){
        if (foodSymbol === normalFood || foodSymbol === twoPointFood){
            snake1.snakeBody.push([foodX, foodY]);
            foodSymbol === normalFood ? snake1.score += 1 : snake1.score += 2;
            player1Score.innerHTML = `PLAYER 1: ${snake1.score}`;
        } else if (foodSymbol === minusPointFood && snake2.snakeBody.length > 1){
            snake2.snakeBody.pop();
            snake2.score -= 1;
            player2Score.innerHTML = `PLAYER 2: ${snake2.score}`;
        }
        changeFoodPosition();
    }

    if(snake2.x === foodX && snake2.y === foodY){
        changeFoodPosition();
        if (foodSymbol === normalFood || foodSymbol === twoPointFood){
            snake2.snakeBody.push([foodX, foodY]);
            foodSymbol === normalFood ? snake2.score += 1 : snake2.score += 2;
            player2Score.innerHTML = `PLAYER 2: ${snake2.score}`;
        } else if (foodSymbol === minusPointFood && snake1.snakeBody.length > 1){
            snake1.snakeBody.pop();
            snake1.score -= 1;
            player1Score.innerHTML = `PLAYER 1: ${snake1.score}`;
        }
    }

    for(let i = snake1.snakeBody.length - 1; i > 0; i--){
        snake1.snakeBody[i] = snake1.snakeBody[i - 1];
    }

    for(let i = snake2.snakeBody.length - 1; i > 0; i--){
        snake2.snakeBody[i] = snake2.snakeBody[i - 1];
    }

    snake1.snakeBody[0] = [snake1.x, snake1.y];
    snake2.snakeBody[0] = [snake2.x, snake2.y];

    snake1.x += snake1.velocityX;
    snake1.y += snake1.velocityY;

    snake2.x += snake2.velocityX;
    snake2.y += snake2.velocityY;

    if(snake1.x <= 0 || snake1.x > COLS || snake1.y <= 0 || snake1.y > ROWS){
        gameOver = true;
        p1Collision = true;
    }

    if(snake2.x <= 0 || snake2.x > COLS || snake2.y <= 0 || snake2.y > ROWS){
        gameOver = true;
        p2Collision = true;
    }

    for(let i = 0; i < snake1.snakeBody.length; i++){
        htmlMarkup += `<div class="snakeBody" style="background-color:${snake1.snakeColor}; grid-area: ${snake1.snakeBody[i][1]} / ${snake1.snakeBody[i][0]}"></div>`;
        
        if(i !== 0 && snake1.snakeBody[0][1] === snake1.snakeBody[i][1] && snake1.snakeBody[0][0] === snake1.snakeBody[i][0]){
            gameOver = true;
        }
    }

    for(let i = 0; i < snake2.snakeBody.length; i++){
        htmlMarkup += `<div class="snakeBody" style="background-color:${snake2.snakeColor}; grid-area: ${snake2.snakeBody[i][1]} / ${snake2.snakeBody[i][0]}"></div>`;       

        if(i !== 0 && snake2.snakeBody[0][1] === snake2.snakeBody[i][1] && snake2.snakeBody[0][0] === snake2.snakeBody[i][0]){
            gameOver = true;
        }
    }

    checkSnakeCollision();
    
    playBoard.innerHTML = htmlMarkup;
}

const callAlert = (msg) => {
    alert(msg);
}

window.alert = function(message){
    const alert = document.createElement('div');
    alert.classList.add('alert');
    const alertButton = document.createElement('button');
    alertButton.classList.add('alertButton');
    alertButton.innerText = "Play Again!";
    alert.innerHTML = `<span style="padding: 10px;">${message}</span>`;
    alert.appendChild(alertButton);
    alertButton.addEventListener('click', (event) => {
        alert.remove();
        location.reload();
    });
    document.body.appendChild(alert);
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);