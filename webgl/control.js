// Import necessary modules from gl-matrix for vector operations
import { vec2 } from "../lib/gl-matrix/index.js";

/**
 * Adds event listeners to the canvas to handle both mouse and touch inputs.
 * @param {HTMLCanvasElement} canvas - The canvas element to attach listeners to.
 * @param {Object} player - The player object with a move method.
 * @param {Function} restart - Function to restart the game.
 * @param {Function} lose - Function to handle losing the game.
 */
export function addListener(canvas, player, restart, lose) {
    // Handle mouse movements
    canvas.addEventListener('mousemove', (event) => {
        handleMouseMove(event, canvas, player);
    });

    // Handle mouse leaving the canvas area
    canvas.addEventListener('mouseout', () => {
        lose();
    });

    // Handle mouse button press (e.g., restart the game)
    canvas.addEventListener('mousedown', (event) => {
        // Prevent default behavior to avoid unintended side effects
        event.preventDefault();
        restart();
        // Optionally handle player movement on mousedown if needed
        handleMouseMove(event, canvas, player);
    });

    // Handle touch movements
    canvas.addEventListener('touchmove', (event) => {
        //handleTouchMove(event, canvas, player);
    }, { passive: false }); // passive: false allows preventDefault()

    // Handle touch start (e.g., restart the game)
    /*canvas.addEventListener('touchstart', (event) => {
        // Prevent default behavior to avoid scrolling or other touch actions
        event.preventDefault();
        restart();
        handleTouchMove(event, canvas, player);
    }, { passive: false });*/
}

/**
 * Handles mouse movement events to update the player's position.
 * @param {MouseEvent} event - The mouse event object.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Object} player - The player object with a move method.
 */
function handleMouseMove(event, canvas, player) {
    // Prevent default behavior (optional, depending on game requirements)
    event.preventDefault();

    // Get the bounding rectangle of the canvas to calculate relative positions
    const rect = canvas.getBoundingClientRect();

    // Calculate mouse position relative to the canvas
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;

    // Normalize coordinates to range [-1, 1] for both axes
    const normalizedX = (2 * clientX) / canvas.width - 1;
    const normalizedY = -((2 * clientY) / canvas.height - 1); // Invert Y-axis if necessary

    // Update the player's position
    player.setPosition(vec2.fromValues(normalizedX, normalizedY));
}

/**
 * Handles touch movement events to update the player's position.
 * @param {TouchEvent} event - The touch event object.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Object} player - The player object with a move method.
 */
function handleTouchMove(event, canvas, player) {
    // Prevent default touch actions like scrolling
    event.preventDefault();

    // Ensure there is at least one touch point
    if (event.touches.length === 0) return;

    // Use the first touch point for single-touch control
    const touch = event.touches[0];

    // Get the bounding rectangle of the canvas to calculate relative positions
    const rect = canvas.getBoundingClientRect();

    // Calculate touch position relative to the canvas
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;

    // Normalize coordinates to range [-1, 1] for both axes
    const normalizedX = (2 * clientX) / canvas.width - 1;
    const normalizedY = -((2 * clientY) / canvas.height - 1); // Invert Y-axis if necessary

    // Update the player's position
    player.setPosition(vec2.fromValues(normalizedX, normalizedY));
}
