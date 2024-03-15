export default class Snake{
    constructor(snakeColor, keyUp, keyDown, keyLeft, keyRight, COLS, ROWS){
        this.snakeColor = snakeColor;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.keyLeft = keyLeft;
        this.keyRight = keyRight;
        this.snakeBody = [];
        this.velocityX = 0;
        this.velocityY = 0;
        this.score = 0;
        this.COLS = COLS;
        this.ROWS = ROWS;
        this.generateSnakePosition();
    }

    generateSnakePosition = () => {
        this.x = Math.floor(Math.random() * this.COLS) + 1;
        this.y = Math.floor(Math.random() * this.ROWS) + 1;
    }

}