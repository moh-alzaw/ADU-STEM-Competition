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