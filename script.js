const canvas = document.getElementById('mainCanvas'); 
const context = canvas.getContext('2d');

/* CONSTANTS */ 
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
const BACKGROUND_WIDTH = 2560;
const BACKGROUND_HEIGHT = 360;

let playerState = "fast"; // Initialize player state

let gameSpeed = 5;

const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

slider.addEventListener('change', function(e) {
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

const backgroundLayer1 = new Image();
const backgroundLayer2 = new Image();
const backgroundLayer3 = new Image();

backgroundLayer1.src = 'assets/sky.png';
backgroundLayer2.src = 'assets/2ndRow.png';
backgroundLayer3.src = 'assets/1stRow.png';

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
class Layer {
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

const layer1 = new Layer(backgroundLayer1, 0.1);
const layer2 = new Layer(backgroundLayer2, 0.6);
const layer3 = new Layer(backgroundLayer3, 0.9);

const gameObjects = [layer1, layer2, layer3];

function animate() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });

    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length; // position iterates to an integer every staggerFrames
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    context.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 520, spriteWidth, spriteHeight);
    gameFrame++;
    
    requestAnimationFrame(animate);
};

animate();  