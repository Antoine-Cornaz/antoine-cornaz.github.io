import {vec2, vec3} from "../lib/gl-matrix/index.js";
import {fromValues} from "../lib/gl-matrix/vec3.js";


export function addListener(window, canvas, player, restart){

    canvas.addEventListener('mousemove', (event) => {
        computerMove(player, event, canvas);
    });

    

    // Event listener for mouse click
    canvas.addEventListener('mousedown', (event) => {
        restart();
        computerMove(player, event, canvas);
    });


    canvas.addEventListener('touchmove', (event) => {
        // Prevent the default scrolling behavior
        event.preventDefault();
    
        // Get the touch point (we use the first touch point in case of multi-touch)
        phoneMove(event, canvas, player);
    });

    // Event listener for touch start
    canvas.addEventListener('touchstart', (event) => {
        // Prevent default touch behavior (e.g., scrolling)
        restart();
        phoneMove(event, canvas, player);
    });

}

function computerMove(player, event, canvas) {
    player.move(vec2.fromValues(event.clientX / canvas.width - 0.5, -event.clientY / canvas.height + 0.5));
}

function phoneMove(event, canvas, player) {
    const touch = event.touches[0];

    // Calculate normalized coordinates
    const normalizedX = 2 * touch.clientX / canvas.width - 0.5;
    const normalizedY = -2 * touch.clientY / canvas.height + 0.5;

    // Move the player based on the touch position
    player.move(vec2.fromValues(normalizedX, normalizedY));
}
