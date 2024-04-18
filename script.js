const canvas = document.getElementById('mainCanvas'); 
const context = canvas.getContext('2d');

//======================================================
// CONSTANTS
//======================================================
const CANVAS_WIDTH      = canvas.width = 1024;
const CANVAS_HEIGHT     = canvas.height = 768;
const BACKGROUND_WIDTH  = 2560;
const BACKGROUND_HEIGHT = 360;
const ROAD_WIDTH        = 128;
const ROAD_NUM          = CANVAS_WIDTH / ROAD_WIDTH;

//======================================================
// GLOBAL VARIABLES
//======================================================
var fps              = 60;
var step             = 1 / fps;
var segments         = [];
var segmentLength    = 200;
var playerState      = 'fast'; // Initialize player state
var playerY          = CANVAS_HEIGHT / 1.5;
var playerX          = 10;
var gameSpeed        = 5;
var lanes            = 4;
var velocity         = 10;
var maxVelocity      = segmentLength / step;
var acceleration     = maxVelocity / 5; 
var braking          = -maxVelocity;
var decelaration     = -maxVelocity / 5;
var drag             = -0.0015;
var friction         = -0.3;

var keyLeft          = false;
var keyRight         = false;
var keyUp            = false;
var keyDown          = false;

const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

slider.addEventListener('change', function(e) {
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'assets/sky.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'assets/2ndRow.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'assets/1stRow.png';

const roadFourLane = new Image();
roadFourLane.src = 'assets/roadFourLane.png';

const playerImage = new Image();
playerImage.src = 'assets/GetawayCar-sheet.png'
const spriteWidth = 64;
const spriteHeight = 32;

let gameFrame = 0;
let framesInRow = 2;
const staggerFrames = 5; // The higher the value the more it slows down animations

const spriteAnimations = [];

const animationStates = [
    {
        name: 'fast',
        frames: 2,
    },
    {
        name: 'crash',
        frames: 5,
    }
]

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames; // Initialize spriteAnimations 
})

// Background layers for parallax
class ParallaxLayer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = BACKGROUND_WIDTH;
        this.height = BACKGROUND_HEIGHT;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);
    }
    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

class Road {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = BACKGROUND_HEIGHT;
        this.width = ROAD_WIDTH;
        this.height = 228;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);
    }
    draw() {
        for (let i = 0; i < (ROAD_NUM+1); i++) {
            context.drawImage(this.image, this.x + (this.width * i), this.y, this.width, this.height); 
        }
    }
}

const layer1 = new ParallaxLayer(backgroundLayer1, 0.1);
const layer2 = new ParallaxLayer(backgroundLayer2, 0.6);
const layer3 = new ParallaxLayer(backgroundLayer3, 0.9);

const road = new Road(roadFourLane, 0.9);

const parallax = [layer1, layer2, layer3];

class Player {
    constructor() {
        this.x = playerX;
        this.y = playerY;
    }

}

function update() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    parallax.forEach(background => {
        background.update();
        background.draw();
    });

    road.update();
    road.draw();

    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length; // position iterates to an integer every staggerFrames
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    context.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, playerX, playerY, spriteWidth, spriteHeight);
    movePlayer();
    gameFrame++;
    
    requestAnimationFrame(update);
};

update();  

function movePlayer() {
    if (keyUp) playerY--;
    if (keyDown) playerY++;
    if (keyRight) accelerate();
    if (keyLeft) brake();
}

function accelerate() {
    if (keyRight) playerX++;
}

function brake() {
    if (velocity > 0) {
        acceleration = 0;
        velocity--;
    }
} 

document.onkeydown = function(e) {
    if (e.key == "ArrowRight") {
        keyRight = true;
    }
    if (e.key == "ArrowLeft") {
        keyLeft = true;
    }
    if (e.key == "ArrowUp") {
        keyUp = true;
    }
    if (e.key == "ArrowDown") {
        keyDown = true;
    }
};

document.onkeyup = function(e) {
    if (e.key == "ArrowRight") {
        keyRight = false;
    }
    if (e.key == "ArrowLeft") {
        keyLeft = false;
    }
    if (e.key == "ArrowUp") {
        keyUp = false;
    }
    if (e.key == "ArrowDown") {
        keyDown = false; 
    }
    
}