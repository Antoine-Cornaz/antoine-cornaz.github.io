// Import necessary modules from gl-matrix for vector and matrix operations
import {mat3, vec2} from "../lib/gl-matrix/index.js";

export class Displayed {
    /**
     * Constructor for the Displayed class.
     * @param {number} width - Width of the displayed object
     * @param {number} height - Height of the displayed object
     * @param {Array} color - RGB color array
     * @param {number} rising - how much it go up with the screen
     */
    constructor(width, height, color, rising = 1) {

        this.width = width;                      // Width of the object
        this.height = height;                    // Height of the object
        this.color = color || [0.4, 0.7, 0.2];   // Default color if none provided
        this.rising_speed = rising;

        this.position = vec2.fromValues(0, 0);  // Initial position at the origin, need to be changed by subclass
        this.screenMovingY = 0
    }

    /**
     * Set the position of the object.
     * @param {vec2} position - New position vector
     */
    setRelativePosition(position) {
        vec2.copy(this.position, position);
    }

    /**
     * Move the object by a given displacement.
     * Corrected to add displacement to the current position.
     * @param {vec2} displacement - Displacement vector
     */
    move(displacement) {
        vec2.add(this.position, this.position, displacement);
    }

    /**
     * Get the current position of the object.
     * @returns {vec2} Current position vector
     */
    getRelativePosition() {
        return this.position;
    }

    /**
     * Get the transformation matrix for rendering.
     * @param {vec2} positionCamera - Camera position (default: [0, 0])
     * @returns {mat3} Transformation matrix
     */
    getTransform(positionCamera = vec2.fromValues(0, 0)) {
        const matrix = mat3.create();
        const pos = this.getRelativePosition();

        // Compute final position
        const finalPos = vec2.fromValues(pos[0] + positionCamera[0],
            pos[1] + positionCamera[1] * this.rising_speed);


        // Apply transformations
        mat3.fromTranslation(matrix, finalPos);
        mat3.scale(matrix, matrix, vec2.fromValues(this.width, this.height));

        return matrix;
    }


    update(displacement_y, diffTime){
        // Do nothing, is override for movement
    }

    /**
     * Set the color of the object.
     * @param {Array} color - RGB color array
     */
    setColors(color) {
        this.color = color;
    }

    /**
     * Get the current color of the object.
     * @returns {Array} RGB color array
     */
    getColor() {
        return this.color;
    }

    /**
     * Get the width of the object.
     * @returns {number} Width of the object
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the height of the object.
     * @returns {number} Height of the object
     */
    getHeight() {
        return this.height;
    }
}
