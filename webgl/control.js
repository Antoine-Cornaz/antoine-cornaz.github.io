import {vec2, vec3} from "../lib/gl-matrix/index.js";
import {fromValues} from "../lib/gl-matrix/vec3.js";

let keyState = {};
let mouseDirection = vec2.fromValues(0, 0)

export function addListener(window, canvas, player){
    window.addEventListener('keydown', (event) => {
        keyState[event.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (event) => {
        keyState[event.key.toLowerCase()] = false;
    });

    window.addEventListener('mouseout', event => {
        mouseDirection = vec2.fromValues(0, 0)}
        )

    canvas.addEventListener('mousemove', (event) => {
        player.move(vec2.fromValues(event.clientX / canvas.width - 0.5, -event.clientY /canvas.height + 0.5))
        mouseDirection = vec2.fromValues(event.clientX / canvas.width - 0.5, event.clientY / canvas.height - 0.5)
    });

    canvas.addEventListener('touchmove', (event) => {
        // Prevent the default scrolling behavior
        console.log(event)
        event.preventDefault();
    
        // Get the touch point (we use the first touch point in case of multi-touch)
        const touch = event.touches[0];
    
        // Calculate normalized coordinates
        const normalizedX = 2*touch.clientX / canvas.width - 1.0;
        const normalizedY = -2*touch.clientY / canvas.height + 1.0;
    
        // Move the player based on the touch position
        player.move(vec2.fromValues(normalizedX, normalizedY));
    });
}

export function checkKeyboard(diff_time, camera){
    if(keyState['s']){
        camera.move(vec3.fromValues(-diff_time, 0, 0))
    }

    if(keyState['w']){
        camera.move(vec3.fromValues(diff_time, 0, 0))
    }

    if(keyState['a']){
        camera.move(vec3.fromValues(0, diff_time, 0))
    }

    if(keyState['d']){
        camera.move(vec3.fromValues(0, -diff_time, 0))
    }

    if(keyState[' ']){
        camera.move(vec3.fromValues(0, 0, diff_time))
    }

    if(keyState['shift']){
        camera.move(vec3.fromValues(0, 0, -diff_time))
    }

    if(keyState['r']){
        camera.reset()
    }

    camera.changeViewDirection(mouseDirection, diff_time)
}