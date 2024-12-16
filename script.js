// After heading finishes, start typing the subheading
function startSubheading() {
    new Typed(".subheading", {
        strings: ["New website coming soon!<br>This time I am coding it myself :)"],
        typeSpeed: 50,
        showCursor: false,
        html: true // Needed for the <br> tag
    });
}

// Typed for heading, calls startSubheading on complete
new Typed(".heading", {
    strings: ["Jacob<span class='dash'></span>Colangelo"],
    typeSpeed: 150,
    showCursor: false,
    onComplete: startSubheading
});

// Canvas-based cursor trail
let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

let mousePositions = [];
let lastMousePosition = { x: undefined, y: undefined }
let collectMousePositionTimerElapsed = false;

let collectMousePositionTimer = setInterval(function() {
    collectMousePositionTimerElapsed = true;
}, 100);

let mouseIsStoppedTimer;

canvas.width = innerWidth;
canvas.height = innerHeight;

c.lineWidth = 2;

let hue = 0; // We'll use this to change the trail's color gradually

window.addEventListener('mousemove', function(event) {
    lastMousePosition = { x: event.x, y: event.y }

    clearTimeout(mouseIsStoppedTimer);
    mouseIsStoppedTimer = setTimeout(function() {
        if (mousePositions.length === 10)
            mousePositions.shift();
        mousePositions.push(lastMousePosition);
    }, 100);

    if (collectMousePositionTimerElapsed) {
        collectMousePositionTimerElapsed = false;
        if (mousePositions.length === 10)
            mousePositions.shift();
        mousePositions.push({ x: event.x, y: event.y });
    }
});

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    if (mousePositions.length <= 0) return;

    hue += 1; // Increment hue for each frame
    c.strokeStyle = 'hsl(' + (hue % 360) + ', 100%, 50%)';

    c.beginPath();
    c.moveTo(mousePositions[0].x, mousePositions[0].y);

    for (let i = 1; i < mousePositions.length; i++)
        c.lineTo(mousePositions[i].x, mousePositions[i].y);

    c.stroke();
}

animate();
