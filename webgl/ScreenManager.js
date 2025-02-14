import { mat3, mat4, vec3, vec4, vec2 } from "../lib/gl-matrix/index.js";

export const WIDTH = 9
export const HEIGHT = 16
export const OPTIMAL_RATIO = WIDTH/HEIGHT;

export class ScreenManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.aspectRatio = this.height / this.width;
        this.transformMatrix = mat3.create();
        this.listeners = [];

        // Initialize size and matrix
        this.updateCanvasSize();
        this.updateTransformMatrix();

        // Add a resize listener to update the canvas and inform listeners
        window.addEventListener("resize", this.onResize.bind(this));
    }

    // Update canvas dimensions and aspect ratio
    updateCanvasSize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.aspectRatio = this.height / this.width;
    }

    // Update the transformation matrix
    updateTransformMatrix() {
        // Calculate the aspect ratio based on the width and height
        this.aspectRatio = this.width / this.height;

        // Initialize scale factors
        let scaleX = 1/WIDTH;
        let scaleY = 1/HEIGHT;

        // Check if the screen is wider or taller than the optimal aspect ratio (16:9)
        if (this.aspectRatio > OPTIMAL_RATIO) {
            // If the screen is wider, we scale to fit height
            scaleX = scaleX / this.aspectRatio * OPTIMAL_RATIO;
        } else {
            // If the screen is taller, we scale to fit width
            scaleY = scaleY / OPTIMAL_RATIO * this.aspectRatio;
        }

        // Apply the scaling factors to the transformation matrix
        mat3.identity(this.transformMatrix); // Clear the existing matrix
        mat3.scale(this.transformMatrix, this.transformMatrix, [scaleX, scaleY]);

        // Set the scaling factors
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    getScaleX() {
        return this.scaleX;
    }

    getScaleY() {
        return this.scaleY;
    }

    // Getter for the canvas height
    getHeight() {
        return this.height;
    }

    // Getter for the canvas width
    getWidth() {
        return this.width;
    }

    // Get the transformation matrix for rendering
    getTransformMatrix() {
        return this.transformMatrix;
    }

    // Add a listener for screen size changes
    addResizeListener(callback) {
        if (typeof callback === "function") {
            this.listeners.push(callback);
        }
    }

    // Handle resize events
    onResize() {
        // Update the canvas size and transformation matrix
        this.updateCanvasSize();
        this.updateTransformMatrix();

        // Notify all listeners about the change
        this.listeners.forEach((callback) => callback(this.width, this.height));
    }
}
