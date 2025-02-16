// Import necessary modules and dependencies
import { createREGL } from "../lib/regl.js"; // REGL for WebGL rendering
import { COLORS } from "./colors.js"; // Color definitions

import { load_resources } from "./helper.js"; // Resource loader
import { addListener } from "./control.js"; // Input controls
import { Player } from "./player.js"; // Player class
import { LevelController } from "./levelController.js"; // Level management
import { ScreenManager } from "./ScreenManager.js";
import { mat3 } from "../lib/gl-matrix/index.js";
import { createDrawFrame, createDrawSquare, createDrawTriangle } from "./draw.js";

// Game class encapsulates the entire game logic and rendering
export class Game {
    constructor() {
        // Initialize REGL for WebGL rendering
        this.regl = createREGL();

        // Initialize player instance
        this.player = new Player();

        // Objects to hold shaders and game objects
        this.shaders = {};
        this.objects = {};

        // Time tracking for frame updates
        this.old_time = 0;

        // Reference to the frame loop for starting/stopping the game
        this.frameLoop = null;

        // Level controller to manage game levels and enemies
        this.levelController = new LevelController();

        // Flag to indicate if it's the first frame
        this.firstFrame = true;

        // Flag to control the game state (running or stopped)
        this.stop = false;

        this.texture_hen = null;
        this.texture_player = null;
        this.texture_background = null;
    }

    // Initialize the game by loading resources and setting up the environment
    async init() {

        try {
            const [henImg, wingsuitImg] = await Promise.all([
                loadImage("texture/hen_small.png"),
                loadImage("texture/wing.png"),
                //loadImage("texture/background_tall.png"),
            ]);
    
            this.texture_hen = this.regl.texture(henImg);
            this.texture_wingsuit = this.regl.texture(wingsuitImg);

            const clouds = await Promise.all([
                loadImage("texture/cloud/cloud1.png"),
                loadImage("texture/cloud/cloud2.png"),
                loadImage("texture/cloud/cloud3.png"),
                loadImage("texture/cloud/cloud4.png"),
                loadImage("texture/cloud/cloud5.png"),
                loadImage("texture/cloud/cloud6.png"),
                loadImage("texture/cloud/cloud7.png"),
                loadImage("texture/cloud/cloud8.png"),
                loadImage("texture/cloud/cloud9.png"),
                loadImage("texture/cloud/cloud10.png"),
                loadImage("texture/cloud/cloud11.png"),
                loadImage("texture/cloud/cloud12.png"),
                loadImage("texture/cloud/cloud13.png"),
                loadImage("texture/cloud/cloud14.png"),
                loadImage("texture/cloud/cloud15.png"),
            ]);

            // load all cloud textures
            this.texture_clouds = clouds.map(cloud => this.regl.texture(cloud));

    
            //console.log("All textures loaded and set.");
        } catch (error) {
            console.error("Failed to load one or more images:", error);
        }
        


        // Load all necessary resources (objects and shaders)
        const resources = await load_resources(this.regl);
        this.objects = resources[0];
        this.shaders = resources[1];

        // Await the loading of all game objects
        for (const key in this.objects) {
            if (this.objects.hasOwnProperty(key)) {
                this.objects[key] = await this.objects[key];
            }
        }

        // Await the loading of all shaders
        for (const key in this.shaders) {
            if (this.shaders.hasOwnProperty(key)) {
                this.shaders[key] = await this.shaders[key];
            }
        }
        
        

        // Get the first canvas element from the DOM
        const canvas = document.getElementsByTagName("canvas")[0];
        this.screenManager = new ScreenManager(canvas);

        // Add input listeners to the canvas for player controls and game state changes
        addListener(canvas, this.player, this.restart.bind(this), this.lose.bind(this), this.screenManager);

        // Create REGL draw commands for rendering objects
        this.createDrawCommands();
    }

    // Define REGL draw commands for different game objects
    createDrawCommands() {

        // Define a draw command for the player using basic shaders
        this.drawPlayer = this.regl(createDrawTriangle(this.regl, this.shaders, this.texture_wingsuit));

        // Define a draw command for enemies using basic shaders
        this.drawEnemie = this.regl(createDrawSquare(this.regl, this.shaders, this.texture_hen));
        this.drawFrame = this.regl(createDrawFrame(this.regl, this.shaders));
        this.drawBackground = this.regl(createDrawSquare(this.regl, this.shaders, this.texture_clouds[0]));
    }

    // Prepare the game by setting up the frame loop
    prepare() {
        // Start the frame loop by binding the update method
        this.frameLoop = this.regl.frame(this.update.bind(this));

        this.stopGame();
    }

    // Start the game by initiating the frame loop
    start() {
        // If the game is already running, do nothing
        if (!this.stop) return;

        // Reset the stop flag to allow the game to run
        this.stop = false;

        // Start the frame loop and keep a reference to cancel it later
        this.frameLoop = this.regl.frame(this.update.bind(this));

        // Reset the firstFrame flag for the next game session
        this.firstFrame = true;
    }

    // Handle the player losing the game
    lose() {
        // Change the player's color to red to indicate loss
        this.player.setColors([1.0, 0.0, 0.0]);

        // Stop the game to prevent further updates and rendering
        this.stopGame();
    }

    // Stop the game by canceling the frame loop
    stopGame() {
        if (this.frameLoop) {
            // Cancel the ongoing frame loop
            this.frameLoop.cancel();
            this.frameLoop = null;
        }

        // Set the stop flag to true to indicate the game is stopped
        this.stop = true;
    }

    // Restart the game by resetting player and level, then starting the frame loop
    restart() {
        // Only restart if the game is currently stopped
        if (!this.stop) return;

        // Stop the game to ensure the frame loop is canceled
        this.stopGame();

        // Reset the player's state
        this.player.reset();

        // Restart the level controller to reset levels and enemies
        this.levelController.restart();

        // Start the game again by initiating the frame loop
        this.start();
    }

    // Update method called on each frame to handle game logic and rendering
    update(frame) {
        // Current time in seconds since the start
        const now = frame.time;

        // Calculate the time difference since the last frame
        let diff_time_S = now - this.old_time;
        this.old_time = now;

        // If it's the first frame, reset the time difference to avoid large jumps
        if (this.firstFrame){
            diff_time_S = 0;
            this.firstFrame = false;
        }

        // Update the level controller with the elapsed time
        this.levelController.update(diff_time_S, this.player.getRelativePosition()[1]);
        this.player.update(diff_time_S);

        // Display the debug overlay
        this.updateDebugInfo();

        // Clear the canvas with the sky blue color
        this.regl.clear({
            color: COLORS.blueSky,
        });

        // Draw the frame
        const propertiesFrame = {
            transform: this.screenManager.getTransformMatrix(),
            color: COLORS.sea.slice(0, 3),
        };
        this.drawFrame(propertiesFrame);

        // Define properties for the player's rendering
        let transformation = mat3.create();
        mat3.multiply(transformation, this.screenManager.getTransformMatrix(), this.player.getTransform());
        const propertiesPlayer = {
            transform: transformation,
            color: this.player.getColor(),
        };

        // Draw the player using the defined draw command
        this.drawPlayer(propertiesPlayer);

        this.levelController.draw(this.screenManager.getTransformMatrix(),
                                    this.drawEnemie, this.lose.bind(this),
                                    this.player.checkCollision.bind(this.player));
        

        let transformation2 = mat3.create();
        mat3.multiply(transformation2, 
                        this.screenManager.getTransformMatrix(), 
                        this.levelController.getBackgroundMatrix());
        
        const propertiesBackground = {
            transform: transformation2,
            color: COLORS.blueSky.slice(0, 3),
        }
        this.drawBackground(propertiesBackground);
    }

    // Update method to set debug info
    updateDebugInfo() {
        const debugText = document.getElementById('score');
        if (debugText) {
            debugText.textContent = `Score: ${this.levelController.getScore().toFixed(0)}`;
        }
    }
}


function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}