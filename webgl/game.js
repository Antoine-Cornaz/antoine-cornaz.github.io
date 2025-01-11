// Import necessary modules and dependencies
import { createREGL } from "../lib/regl.js"; // REGL for WebGL rendering
import { COLORS } from "./colors.js"; // Color definitions

import { load_resources } from "./helper.js"; // Resource loader
import { addListener } from "./control.js"; // Input controls
import { Player } from "./player.js"; // Player class
import { LevelController } from "./levelController.js"; // Level management
import { ScreenManager } from "./ScreenManager.js";
import { Enemy } from "./enemy.js";
import { mat3 } from "../lib/gl-matrix/index.js";
import { Frame } from "./frame.js";

// Game class encapsulates the entire game logic and rendering
export class Game {
    constructor() {
        // Initialize REGL for WebGL rendering
        this.regl = createREGL();

        // Initialize player instance
        this.player = new Player();

        // Intialize frame
        this.frame = new Frame();

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
    }

    // Initialize the game by loading resources and setting up the environment
    async init() {


        let image_hen = new Image();
        image_hen.src = "texture/chicken.webp";
        image_hen.onload = () => {
            this.texture_hen = this.regl.texture(image_hen);
            this.hen_width = image_hen.width
            this.hen_height = image_hen.height
        };

        let image_wingsuit = new Image();
        image_wingsuit.src = "texture/wings2.webp";
        image_wingsuit.onload = () => {
            this.texture_wingsuit = this.regl.texture(image_wingsuit);
            this.wingsuit_width = image_wingsuit.width
            this.wingsuit_height = image_wingsuit.height
        };


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
        this.drawPlayer = this.regl(Player.createDraw(this.regl, this.shaders, this.texture_wingsuit));

        // Define a draw command for enemies using basic shaders
        this.drawEnnemie = this.regl(Enemy.createDraw(this.regl, this.shaders, this.texture_hen));
        this.drawFrame = this.regl(Frame.createDraw(this.regl, this.shaders, this.texture_background));
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
        // Current time in milliseconds since the start
        const now = frame.time;

        // Calculate the time difference since the last frame
        let diff_time = now - this.old_time;
        this.old_time = now;

        // If the game is stopped, do not proceed with updates or rendering
        //if (this.stop) return;

        // If it's the first frame, reset the time difference to avoid large jumps
        if (this.firstFrame){
            diff_time = 0;
            this.firstFrame = false;
        }

        // Update the level controller with the elapsed time
        this.levelController.update(diff_time, this.player.getPosition()[1]);

        // Display the debug overlay
        this.updateDebugInfo();

        // Clear the canvas with the sky blue color
        this.regl.clear({
            color: COLORS.blueSky,
        });

        // Draw the background
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

        // Iterate over each enemy and render them
        this.levelController.getEnemies().forEach((ennemie) => {
            // Define properties for the enemy's rendering
            let transformation = mat3.create();
            mat3.multiply(transformation, this.screenManager.getTransformMatrix(), ennemie.getTransform());
            const propertiesEnnemie = {
                color: ennemie.getColor(),
                transform: transformation,
            };

            // Draw the enemy using the defined draw command
            this.drawEnnemie(propertiesEnnemie);

            // Check for collision between the player and the enemy
            if (this.player.checkCollision(ennemie)) {
                // If collision occurs, trigger the lose condition
                this.lose();
            }
        });

        
    }

    // Update method to set debug info
    updateDebugInfo() {
        const debugText = document.getElementById('score');
        if (debugText) {
            debugText.textContent = `Score: ${this.levelController.getScore().toFixed(0)}`;
        }
    }
}


