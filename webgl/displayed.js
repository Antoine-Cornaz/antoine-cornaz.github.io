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
        this.rising = rising;

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

    getAbsolutePosition() {
        return vec2.fromValues(this.position[0], this.position[1] + this.screenMovingY)
    }

    /**
     * Get the transformation matrix for rendering.
     * @returns {mat3} Transformation matrix
     */
    getTransform() {
        const matrix = mat3.create();
        //mat3.translate(matrix, matrix, this.position);
        const pos = this.getAbsolutePosition();
        mat3.fromTranslation(matrix, pos)
        mat3.scale(matrix, matrix, vec2.fromValues(this.width, this.height));
        return matrix;
    }

    update(displacement_y, diffTime){
        this.screenMovingY += displacement_y*this.rising
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
