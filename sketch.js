let player;
let stars = [];
let numStars = 10;
let starSize = 20;
let playerSize = 40;
let score = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    player = createVector(width / 2, height - playerSize);

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

    // Move player
    if (keyIsDown(LEFT_ARROW)) {
        player.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.x += 5;
    }
    if (keyIsDown(UP_ARROW)) {
        player.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.y += 5;
    }

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
    player.x = mouseX;
    player.y = mouseY;
    return false;
}
