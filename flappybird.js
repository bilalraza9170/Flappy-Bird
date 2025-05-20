//board
let board;
let boardHeight = 640; //according to our bg-image
let boardWidth = 360;
let context; //used for drawing on board

let birdHeight = 34 // height = 408, width = 288 , divided by 24
let birdWidth = 24 //original image ratio => 17/12
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

//bird
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //2 px per frame to the left
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let canRestart = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500) //every 1.5 seconds
    document.addEventListener("keydown",moveBird); //for keyboard
    board.addEventListener("touchstart", function(e) {
        e.preventDefault();
        moveBird(e);
    }, { passive: false }); // for mobile
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight); //clear previous frame.

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }
    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver){
        context.fillText("GAME OVER", 5,90);
        setTimeout(() => {
            canRestart = true;
        }, 1000); // 1 second
    }
}

function placePipes() {
    if (gameOver){
        return;
    }

    let randomPipe = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipe,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipe + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.type === "touchstart" || e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver && canRestart) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            canRestart = false;
        }
    }
}

function detectCollision(bird, pipe) {
    return bird.x < pipe.x + pipe.width &&   //bird's top left corner doesn't reach pipe's top right corner
        bird.x + bird.width > pipe.x &&   //bird's top right corner passes pipe's top left corner
        bird.y < pipe.y + pipe.height &&  //bird's top left corner doesn't reach pipe's bottom left corner
        bird.y + bird.height > pipe.y;    //bird's bottom left corner passes pipe's top left corner
}
