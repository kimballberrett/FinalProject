const pacman = document.getElementById('pacman');
const scoreDisplay = document.getElementById('score');
let score = 0;
let pacmanX = 240;  // Center X position of Pac-Man
let pacmanY = 240;  // Center Y position of Pac-Man
let pacmanSpeed = 40;
let pacmanDirection = { x: 0, y: 0 };
let moving = false;

const walls = [
    { x: 0, y: 0, width: 500, height: 20 },  // Top wall
    { x: 0, y: 480, width: 500, height: 20 },  // Bottom wall
    { x: 0, y: 0, width: 20, height: 500 },  // Left wall
    { x: 480, y: 0, width: 20, height: 500 },  // Right wall
];

let dots = [];
createDots();  // Initial dot generation

// Create random dots
function createDots() {
    dots = [];  // Reset the dots array
    for (let i = 0; i < 4; i++) {
        let x = Math.floor(Math.random() * 460); // Generate random x position
        let y = Math.floor(Math.random() * 460); // Generate random y position
        dots.push({ x, y });

        // Create dot element and add to the DOM
        let dotElement = document.createElement('div');
        dotElement.classList.add('dot');
        dotElement.style.left = `${x}px`;
        dotElement.style.top = `${y}px`;
        dotElement.setAttribute('data-index', i);  // Store index to track each dot
        document.querySelector('.game-container').appendChild(dotElement);
    }
}

// Check collision with walls
function checkWallCollision() {
    for (const wall of walls) {
        if (
            pacmanX < wall.x + wall.width &&
            pacmanX + 40 > wall.x &&
            pacmanY < wall.y + wall.height &&
            pacmanY + 40 > wall.y
        ) {
            return true; // Collision detected
        }
    }
    return false;
}

// Check if Pac-Man eats a dot
function checkDotCollision() {
    const dotsElements = document.querySelectorAll('.dot');
    let dotsLeft = 0;

    dotsElements.forEach(dotElement => {
        const dotX = parseInt(dotElement.style.left);
        const dotY = parseInt(dotElement.style.top);

        if (
            pacmanX < dotX + 10 &&
            pacmanX + 40 > dotX &&
            pacmanY < dotY + 10 &&
            pacmanY + 40 > dotY
        ) {
            // Remove the dot from the screen
            dotElement.remove();
            score += 10; // Increase the score
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            dotsLeft++; // Count remaining dots
        }
    });

    // If no dots are left, display "Good Job" message
    if (dotsLeft === 0) {
        displayGoodJobMessage();
    }
}

// Display a "Good Job" message
function displayGoodJobMessage() {
    const gameContainer = document.querySelector('.game-container');
    let message = document.createElement('div');
    message.textContent = 'Good Job!';
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = 'white';
    message.style.fontSize = '30px';
    message.style.fontWeight = 'bold';
    gameContainer.appendChild(message);

    // Optionally remove the message after a few seconds
    setTimeout(() => {
        message.style.display = 'none';
        createDots();  // Recreate dots after "Good Job!"
    }, 3000);
}

// Move Pac-Man continuously
function movePacman() {
    if (moving) {
        pacmanX += pacmanDirection.x * pacmanSpeed;
        pacmanY += pacmanDirection.y * pacmanSpeed;

        // Prevent pacman from going outside the game container
        pacmanX = Math.max(0, Math.min(pacmanX, 460));
        pacmanY = Math.max(0, Math.min(pacmanY, 460));

        // Check for collision with walls
        if (!checkWallCollision()) {
            pacman.style.left = pacmanX + 'px';
            pacman.style.top = pacmanY + 'px';
        }

        checkDotCollision();
    }
}

// Start continuous movement based on arrow key direction
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pacmanDirection = { x: 0, y: -1 };
        moving = true;
    } else if (e.key === 'ArrowDown') {
        pacmanDirection = { x: 0, y: 1 };
        moving = true;
    } else if (e.key === 'ArrowLeft') {
        pacmanDirection = { x: -1, y: 0 };
        moving = true;
    } else if (e.key === 'ArrowRight') {
        pacmanDirection = { x: 1, y: 0 };
        moving = true;
    }
});

// Stop movement when Pac-Man hits a wall until a new direction is given
function stopPacman() {
    moving = false;
    setTimeout(() => {
        moving = true;
    }, 200); // Small delay before restarting movement
}

// Update movement every 100ms
setInterval(movePacman, 100);

// Draw the walls on the screen
function drawWalls() {
    const gameContainer = document.querySelector('.game-container');
    walls.forEach(wall => {
        const wallElement = document.createElement('div');
        wallElement.classList.add('wall');
        if (wall.width > wall.height) {
            wallElement.classList.add('horizontal');
        } else {
            wallElement.classList.add('vertical');
        }
        wallElement.style.left = `${wall.x}px`;
        wallElement.style.top = `${wall.y}px`;
        wallElement.style.width = `${wall.width}px`;
        wallElement.style.height = `${wall.height}px`;
        gameContainer.appendChild(wallElement);
    });
}

// Call drawWalls to render the walls when the game starts
drawWalls();

// Initialize Pac-Man at the center of the game container
pacman.style.left = `${pacmanX}px`;
pacman.style.top = `${pacmanY}px`;
