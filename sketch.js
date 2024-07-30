let scene, camera, renderer;
let player, stars = [], backgroundStars = [];
let numStars = 10;
let numBackgroundStars = 100;
let playerSize = 2;
let starSize = 1;
let backgroundStarSize = 0.05;
let targetPos;
let score = 0;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Player setup
    const playerGeometry = new THREE.BoxGeometry(playerSize, playerSize, playerSize);
    const playerTexture = new THREE.TextureLoader().load('mochi.png');
    const playerMaterial = new THREE.MeshBasicMaterial({ map: playerTexture });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.z = 0; // Ensure player is on the z=0 plane
    scene.add(player);
    targetPos = player.position.clone();

    // Stars setup
    const starTexture = new THREE.TextureLoader().load('michi.png');
    for (let i = 0; i < numStars; i++) {
        const starGeometry = new THREE.BoxGeometry(starSize, starSize, starSize);
        const starMaterial = new THREE.MeshBasicMaterial({ map: starTexture });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            0 // Ensure star is on the z=0 plane
        );
        scene.add(star);
        stars.push(star);
    }

    // Background stars setup
    for (let i = 0; i < numBackgroundStars; i++) {
        const backgroundStarGeometry = new THREE.SphereGeometry(backgroundStarSize, 8, 8);
        const backgroundStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const backgroundStar = new THREE.Mesh(backgroundStarGeometry, backgroundStarMaterial);
        backgroundStar.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        scene.add(backgroundStar);
        backgroundStars.push(backgroundStar);
    }

    // Event listeners for touch and mouse move
    document.addEventListener('touchmove', onTouchMove, false);
    document.addEventListener('mousemove', onMouseMove, false);

    // Prevent scrolling on touch and mouse events
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });

    // Resize event
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

function update() {
    const lerpFactor = 0.1;
    player.position.lerp(targetPos, lerpFactor);

    // Spin the player cube
    player.rotation.x += 0.01;
    player.rotation.y += 0.01;

    // Spin the stars
    stars.forEach(star => {
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;
    });

    // Check for star collection with improved collision detection
    for (let i = stars.length - 1; i >= 0; i--) {
        if (player.position.distanceTo(stars[i].position) < (playerSize / 2 + starSize / 2)) {
            scene.remove(stars[i]);
            stars.splice(i, 1);
            score++;
            player.scale.multiplyScalar(1.1); // Increase player size by 10%
            console.log('Score: ' + score);
        }
    }
}

function onTouchMove(event) {
    event.preventDefault(); // Prevent scrolling
    const touch = event.touches[0];
    const mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
    updateTargetPos(mouseX, mouseY);
}

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    updateTargetPos(mouseX, mouseY);
}

function updateTargetPos(mouseX, mouseY) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
    targetPos.z = 0; // Ensure target position is on the z=0 plane
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function preventDefault(event) {
    event.preventDefault();
}

// Initial debugging information
console.log('Three.js version:', THREE.REVISION);
console.log('Scene:', scene);
console.log('Camera:', camera);
console.log('Renderer:', renderer);
console.log('Player:', player);
console.log('Stars:', stars);
