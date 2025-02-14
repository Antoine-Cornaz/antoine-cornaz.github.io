// Import necessary modules from gl-matrix for vector and matrix operations
import { vec2, mat3 } from "../lib/gl-matrix/index.js";

export class Displayed {
    /**
     * Constructor for the Displayed class.
     * @param {number} width - Width of the displayed object
     * @param {number} height - Height of the displayed object
     * @param {Array} color - RGB color array
     */
    constructor(width, height, color) {
        this.position = vec2.fromValues(0, 0);  // Initial position at the origin
        this.width = width;                      // Width of the object
        this.height = height;                    // Height of the object
        this.color = color || [0.4, 0.7, 0.2];   // Default color if none provided
    }

    /**
     * Set the position of the object.
     * @param {vec2} position - New position vector
     */
    setPosition(position) {
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
    getPosition() {
        return this.position;
    }

    /**
     * Get the transformation matrix for rendering.
     * @returns {mat3} Transformation matrix
     */
    getTransform() {
        const matrix = mat3.create();
        mat3.translate(matrix, matrix, this.position);
        mat3.scale(matrix, matrix, vec2.fromValues(this.width, this.height));
        return matrix;
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

    /**
     * Check if the object is above the screen boundary.
     * @returns {boolean} True if above the screen, else false
     */
    isAboveScreen() {
        return this.position[1] > 1.5;
    }
}
