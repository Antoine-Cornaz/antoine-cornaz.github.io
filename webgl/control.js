import {vec2, vec3} from "../lib/gl-matrix/index.js";
import {fromValues} from "../lib/gl-matrix/vec3.js";


export function addListener(window, canvas, player, restart){

    canvas.addEventListener('mousemove', (event) => {
        mouseMove(player, event, canvas);
    });

    

    // Event listener for mouse click
    canvas.addEventListener('mousedown', (event) => {
        restart();
        mouseMove(player, event, canvas);
    });


    canvas.addEventListener('touchmove', (event) => {
        // Prevent the default scrolling behavior
        
    
        // Get the touch point (we use the first touch point in case of multi-touch)
        fingerMove(event, canvas, player);
    });

    // Event listener for touch start
    canvas.addEventListener('touchstart', (event) => {
        // Prevent default touch behavior (e.g., scrolling)
        restart();
        fingerMove(event, canvas, player);
    });

}

function mouseMove(player, event, canvas) {
    // Prevent default scrolling behavior
    event.preventDefault();
    player.move(vec2.fromValues(event.clientX / canvas.width - 0.5, -event.clientY / canvas.height + 0.5));
}

function fingerMove(event, canvas, player) {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Get the touch point (we use the first touch point in case of multi-touch)
    touch_x /= event.touches[0].clientX;
    touch_y /= event.touches[0].clientY;

    // Calculate normalized coordinates
    const normalizedX = 2 * touch_x / canvas.width - 1;
    const normalizedY = -2 * touch_y / canvas.height + 1;

    // Move the player based on the touch position
    player.move(vec2.fromValues(normalizedX, normalizedY));
}
