import { mat3, mat4, vec3, vec4 } from "../lib/gl-matrix/index.js";

export class ScreenManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.aspectRatio = this.canvas.width / this.canvas.height;
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
        this.aspectRatio = this.width / this.height;
    }

    // Update the transformation matrix
    updateTransformMatrix() {
        const scaleX = 2 / this.width;
        const scaleY = -2 / this.height; // Flip Y for WebGL coordinate system

        mat3.identity(this.transformMatrix);
        mat3.scale(this.transformMatrix, this.transformMatrix, [scaleX, scaleY]);
        mat3.translate(this.transformMatrix, this.transformMatrix, [-this.width / 2, -this.height / 2]);
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
