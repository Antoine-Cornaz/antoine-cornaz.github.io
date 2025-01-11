import { mat3, mat4, vec3, vec4, vec2 } from "../lib/gl-matrix/index.js";

const OPTIMAL_RATIO = 16.0 / 9.0;

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
        const OPTIMAL_RATIO = 16 / 9;
        this.scaleX = 1;
        this.scaleY = 1;
    
        // Clear the existing matrix
        mat3.identity(this.transformMatrix);
    
        // Calculate the current aspect ratio
        this.aspectRatio = this.width / this.height;
    
        if (this.aspectRatio > OPTIMAL_RATIO) {
            // If the screen is wider than 16:9
             this.scaleX = OPTIMAL_RATIO / this.aspectRatio; // Scale to fit width
        } else {
            // If the screen is taller than 16:9
            this.scaleY = this.aspectRatio / OPTIMAL_RATIO; // Scale to fit height
            
        }
        mat3.scale(this.transformMatrix, this.transformMatrix, [this.scaleX, this.scaleY]);
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
