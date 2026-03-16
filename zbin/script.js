const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// Load Images
const bgImage = new Image();
bgImage.src = 'images/archery_bg.jpg';

const gunImage = new Image();
gunImage.src = 'images/gun.png';

// Setup canvas size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Keep target centered on resize
    target.x = canvas.width / 2 - 200;
    target.y = canvas.height / 2;
}
window.addEventListener('resize', resize);

// Game state
let score = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isShooting = false;
const holes = [];

// Target settings
const target = {
    x: canvas.width / 2 - 200,
    y: window.innerHeight / 2,
    radius: 150,
    colors: ['blue', 'yellow', 'green', 'red', 'white']
};

const targetBox = {
    x: canvas.width / 4 + 230,       // left side of rectangle
    y: canvas.height / 2 + 30,
    width: 500,
    height: 500
};

// Track mouse
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function isMouseInsideBox(mx, my, box) {
    return mx >= box.x &&
           mx <= box.x + box.width &&
           my >= box.y &&
           my <= box.y + box.height;
}

// Shoot on click
window.addEventListener('mousedown', () => {
    isShooting = true;

    const dist = Math.hypot(mouseX - target.x, mouseY - target.y);

    if (dist < target.radius) {
        holes.push({ x: mouseX, y: mouseY });

        const ringWidth = target.radius / 5;
        const hitRing = Math.floor(dist / ringWidth);
        const points = (5 - hitRing) * 10;

        score += points;
        scoreEl.innerText = score;
    }

    setTimeout(() => isShooting = false, 100);
});

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🖼 Draw Background Image
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // 🎯 Draw Target
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
            target.x,
            target.y,
            target.radius - (i * target.radius / 5),
            0,
            Math.PI * 2
        );
        ctx.fillStyle = target.colors[i];
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // 🕳 Draw holes
    for (let i = holes.length - 1; i >= 0; i--) {
        const h = holes[i];
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fill();
    }

    // 🎯 Draw crosshair
    drawCrosshair(mouseX, mouseY);

    requestAnimationFrame(draw);
}

function drawCrosshair(x, y) {
    ctx.save();
    ctx.translate(x, y);

    const offset = isShooting ? 10 : 0;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, 15 + offset, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -5 - offset);
    ctx.lineTo(0, -25 - offset);

    ctx.moveTo(0, 5 + offset);
    ctx.lineTo(0, 25 + offset);

    ctx.moveTo(-5 - offset, 0);
    ctx.lineTo(-25 - offset, 0);

    ctx.moveTo(5 + offset, 0);
    ctx.lineTo(25 + offset, 0);

    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.restore();

    // 🔫 Draw Gun Image
    ctx.save();

    const gunBaseX = 3 * canvas.width / 4;
    const gunBaseY = canvas.height;

    // Constrain aim inside target box
    if (!isMouseInsideBox(x, y, targetBox)) {
        y = 600;
        x = 100;
    }

    // Angle to mouse
    const mouseAngle = Math.atan2(
        y - gunBaseY,
        x - gunBaseX
    );

    // Angle to target center
    const targetAngle = Math.atan2(
        target.y - gunBaseY,
        target.x - gunBaseX
    );

    // Subtract correction
    const correctedAngle = mouseAngle - targetAngle;

    ctx.translate(gunBaseX, gunBaseY);
    ctx.rotate(correctedAngle);

    const recoilY = isShooting ? 20 : 0;

    // Adjust size depending on your image proportions
    const gunWidth = 300;
    const gunHeight = 240;

    ctx.drawImage(
        gunImage,
        -gunWidth / 2,
        -gunHeight / 2 + recoilY,
        gunWidth - 20,
        gunHeight - 20
    );

    ctx.restore();
}

// Start once images load
bgImage.onload = () => {
    resize();
    draw();
};