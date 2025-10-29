const scene = document.getElementById("scene");
const room = document.getElementById("room");
const hallways = [
    document.getElementById("hallway1"),
    document.getElementById("hallway2"),
    document.getElementById("hallway3")
];
const people = [];
const personSizePct = 3;

function createPerson(src) {
    const person = document.createElement("img");
    person.src = src;
    person.classList.add("person");
    scene.appendChild(person);

    const xPct = ((room.offsetLeft + Math.random() * (room.offsetWidth - personSizePct)) / scene.clientWidth) * 100;
    const yPct = ((room.offsetTop + Math.random() * (room.offsetHeight - personSizePct)) / scene.clientHeight) * 100;
    person.style.left = xPct + "%";
    person.style.top = yPct + "%";

    person.state = "wandering";
    person.currentTarget = pickRandomRoomPoint();
    person.finalTarget = null;
    person.speed = 0.15 + Math.random() * 0.1;

    people.push(person);
    return person;
}

function pickRandomRoomPoint() {
    const x = ((room.offsetLeft + Math.random() * (room.offsetWidth - personSizePct)) / scene.clientWidth) * 100;
    const y = ((room.offsetTop + Math.random() * (room.offsetHeight - personSizePct)) / scene.clientHeight) * 100;
    return {x, y};
}

function moveToward(person, targetX, targetY, speed) {
    let left = parseFloat(person.style.left);
    let top = parseFloat(person.style.top);

    const dx = targetX - left;
    const dy = targetY - top;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist > 0.1) {
        person.style.left = left + (dx/dist)*speed + "%";
        person.style.top = top + (dy/dist)*speed + "%";
        return false;
    }
    return true;
}

function updatePeople() {
    people.forEach(person => {
    if (person.state === "wandering") {
            const reached = moveToward(person, person.currentTarget.x, person.currentTarget.y, person.speed);
            if (reached) person.currentTarget = pickRandomRoomPoint();
        } else if (person.state === "exiting" && person.finalTarget) {
            moveToward(person, person.finalTarget.x, person.finalTarget.y, person.speed + 0.1);
        }
    });
    requestAnimationFrame(updatePeople);
}

for (let i = 0; i < 20; i++) createPerson("Assets/Person.svg");
    updatePeople();

function triggerExit() {
  people.forEach(person => {
    person.state = "exiting";

    const hallway = hallways[Math.floor(Math.random() * 3)];

    let targetX = (hallway.offsetLeft + hallway.offsetWidth / 2) / scene.clientWidth * 100;
    let targetY = (hallway.offsetTop + hallway.offsetHeight / 2) / scene.clientHeight * 100;

    if (hallway.offsetWidth > hallway.offsetHeight) {
      targetY = (hallway.offsetTop + 0.5 * hallway.offsetHeight) / scene.clientHeight * 100; 
    } else {
      targetX = (hallway.offsetLeft + hallway.offsetWidth) / scene.clientWidth * 100; 
    }

    targetX += (Math.random() - 0.5) * 5;
    targetY += (Math.random() - 0.5) * 5;

    person.finalTarget = {x: targetX, y: targetY};
    person.currentTarget = pickRandomRoomPoint();
  });
}
function initializeEventListeners() {
    // Credits Modal
    const creditsBtn = document.getElementById('credits-btn');
    const creditsModal = document.getElementById('credits-modal');
    const closeBtn = document.querySelector('.close');
    const githubBtn = document.getElementById('github-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // Open credits modal
    if (creditsBtn) {
        creditsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            creditsModal.classList.add('show');
            fullscreenBtn.style.pointerEvents = 'none';
            fullscreenBtn.style.opacity = '0.5';
        });
    }

    // Close credits modal - try multiple selectors to ensure we find it
    let closeBtn2 = closeBtn || document.querySelector('#credits-modal .close');

    if (closeBtn2) {
        closeBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            creditsModal.classList.remove('show');
            fullscreenBtn.style.pointerEvents = 'auto';
            fullscreenBtn.style.opacity = '1';
        });
    } else {
        console.log('Close button not found');
    }

    // Close modal when clicking outside of it
    if (creditsModal) {
        creditsModal.addEventListener('click', (event) => {
            if (event.target === creditsModal) {
                creditsModal.classList.remove('show');
                fullscreenBtn.style.pointerEvents = 'auto';
                fullscreenBtn.style.opacity = '1';
            }
        });

        // Prevent closing when clicking inside modal-content
        const modalContent = creditsModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
    }

    // GitHub button - update this URL to your actual GitHub repository
    if (githubBtn) {
        githubBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://github.com/moh-alzaw/ADU-STEM-Competition', '_blank');
        });
    }

    // Fullscreen button
    const roomDisplay = document.querySelector('.room-display');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            roomDisplay.classList.toggle('fullscreen');

            // If entering fullscreen, clear inline styles
            if (roomDisplay.classList.contains('fullscreen')) {
                roomDisplay.style.width = '';
                roomDisplay.style.height = '';
            } else {
                // If exiting fullscreen, retrigger resize handler
                handleWindowResize();
            }
        });
    }
}

// Responsive resize handler for desktop app
function handleWindowResize() {
    const roomDisplay = document.querySelector('.room-display');
    const statsPanel = document.querySelector('.stats-panel');

    if (!roomDisplay || !statsPanel || roomDisplay.classList.contains('fullscreen')) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get actual stats panel position and width
    const statsPanelRect = statsPanel.getBoundingClientRect();
    const statsPanelLeft = statsPanelRect.left; // Actual left position
    const statsPanelRight = statsPanelRect.right; // Actual right edge
    const minRightSpace = 60; // Right margin

    // Calculate available width for room display (from right edge of stats panel to right edge of window minus margin)
    const availableWidth = windowWidth - statsPanelRight - minRightSpace;
    const availableHeight = windowHeight - 200; // Top and bottom margin

    // Calculate scale factor based on available space
    const scaleWidth = Math.min(1, availableWidth / 800);
    const scaleHeight = Math.min(1, availableHeight / 500);
    const scale = Math.min(scaleWidth, scaleHeight);

    // Apply scaling to room display with proper constraints
    const newWidth = Math.max(300, 800 * scale);
    const newHeight = Math.max(250, 500 * scale);

    roomDisplay.style.width = newWidth + 'px';
    roomDisplay.style.height = newHeight + 'px';

    // Center the room display in the available space (right side of stats panel)
    const rightSideStart = statsPanelRight;
    const availableRightSpace = windowWidth - rightSideStart - minRightSpace;
    const leftOffset = rightSideStart + (availableRightSpace - newWidth) / 2;

    // Ensure room display doesn't go below the right edge of stats panel
    roomDisplay.style.left = Math.max(leftOffset, statsPanelRight + 20) + 'px';
    roomDisplay.style.right = 'auto';

    // Adjust stats panel position based on window width
    if (windowWidth < 1000) {
        statsPanel.style.left = '15px';
    } else {
        statsPanel.style.left = '40px';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeEventListeners();
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
    });
} else {
    initializeEventListeners();
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
}
