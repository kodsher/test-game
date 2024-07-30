let player;
let stars = [];
let numStars = 10;
let starSize = 20;
let playerSize = 40;
let score = 0;
let targetPos;

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = createVector(width / 2, height - playerSize);
    targetPos = player.copy();

    for (let i = 0; i < numStars; i++) {
        stars.push(createVector(random(width), random(height - 100)));
    }
}

function draw() {
    background(0);

    // Draw player
    fill(255);
    rect(player.x, player.y, playerSize, playerSize);

    // Draw stars
    fill(255, 204, 0);
    for (let i = 0; i < stars.length; i++) {
        ellipse(stars[i].x, stars[i].y, starSize);
    }

    // Move player towards target position
    let lerpFactor = 0.1; // Adjust this value for smoother or faster movement
    player.x = lerp(player.x, targetPos.x, lerpFactor);
    player.y = lerp(player.y, targetPos.y, lerpFactor);

    // Check for star collection
    for (let i = stars.length - 1; i >= 0; i--) {
        if (dist(player.x, player.y, stars[i].x, stars[i].y) < (playerSize + starSize) / 2) {
            stars.splice(i, 1);
            score++;
        }
    }

    // Display score
    fill(255);
    textSize(24);
    text('Score: ' + score, 10, 30);
}

function touchMoved() {
    targetPos.x = mouseX;
    targetPos.y = mouseY;
    return false;
}
