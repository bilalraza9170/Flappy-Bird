//board
let board;
let boardHeight = 640; //according to our bg-image
let boardWidth = 360;
let context; //used for drawing on board

let birdHeight = 34 // height = 408, width = 288 , divided by 24
let birdWidth = 24 //original image ratio => 17/12
let birdX = birdWidth / 8;
let birdY = birdHeight / 2;
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

let velocityX = -2; //2 px per frame to the left

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
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardWidth, boardHeight); //clear previous frame.

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function placePipes() {

    let randomPipe = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

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
