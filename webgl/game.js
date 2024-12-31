import { createREGL } from "../lib/regl.js";
import { colors } from "./colors.js";

import { vec2 } from "../lib/gl-matrix/index.js";
import { load_resources } from "./helper.js";
import { addListener } from "./control.js";
import { Player } from "./player.js";
import { Obstacle } from "./obstacle.js";

export const SQUARE_SIZE = 0.1;
export const TRIANGLE_SIZE = 0.2;

export class Game {
    constructor() {
        this.regl = createREGL();
        this.player = new Player();
        this.obstacles = [];
        this.shaders = {};
        this.objects = {};
        this.stop = false;
        this.old_time = 0;
        this.frameLoop = null;
    }

    async init() {
        // Load resources
        const resources = await load_resources(this.regl);
        this.objects = resources[0];
        this.shaders = resources[1];

        // Wait for all objects and shaders to load
        for (const key in this.objects) {
            if (this.objects.hasOwnProperty(key)) {
                this.objects[key] = await this.objects[key];
            }
        }

        for (const key in this.shaders) {
            if (this.shaders.hasOwnProperty(key)) {
                this.shaders[key] = await this.shaders[key];
            }
        }

        // Set up player and obstacles
        this.setupObstacles();

        const canvas = document.getElementsByTagName("canvas")[0];
        addListener(window, canvas, this.player, this.restart.bind(this));

        // Create draw commands
        this.createDrawCommands();
    }

    setupObstacles() {
        this.obstacles = [
            new Obstacle(vec2.fromValues(0.8, -3.0)),
            new Obstacle(vec2.fromValues(-0.2, -4.5)),
            new Obstacle(vec2.fromValues(0.0, -6.0)),
        ];
    }


    createDrawCommands() {
        // Define a draw command for the player
        this.drawPlayer = this.regl({
            vert: this.shaders["basic.vert.glsl"],
            frag: this.shaders["basic.frag.glsl"],
            attributes: {
                position: [
                    [0.0, -TRIANGLE_SIZE],
                    [-TRIANGLE_SIZE, TRIANGLE_SIZE],
                    [TRIANGLE_SIZE, TRIANGLE_SIZE],
                ],
            },
            uniforms: {
                color: this.regl.prop("color"),
                transform: this.regl.prop("transform"),
            },
            count: 3,
        });

        

        // Define a draw command for the obstacles
        this.drawObstacle = this.regl({
            vert: this.shaders["basic.vert.glsl"],
            frag: this.shaders["basic.frag.glsl"],
            attributes: {
                position: [
                    [-SQUARE_SIZE, SQUARE_SIZE],
                    [-SQUARE_SIZE, -SQUARE_SIZE],
                    [SQUARE_SIZE, -SQUARE_SIZE],
                    [-SQUARE_SIZE, SQUARE_SIZE],
                    [SQUARE_SIZE, -SQUARE_SIZE],
                    [SQUARE_SIZE, SQUARE_SIZE],
                ],
            },
            uniforms: {
                color: this.regl.prop("color"),
                transform: this.regl.prop("transform"),
            },
            count: 6,
        });
    }

    start() {
        this.stop = false;
        this.frameLoop = this.regl.frame(this.update.bind(this));
    }

    stopGame() {
        this.stop = true;
        if (this.frameLoop) {
            this.frameLoop.cancel();
            this.frameLoop = null; // Reset frameLoop after canceling
        }
    }

    restart() {
        if (!this.stop) return;
        this.stopGame();
        this.player.reset();
        this.setupObstacles();
        this.start();
    }

    update(frame) {
        const now = frame.time;
        const diff_time = now - this.old_time;
        this.old_time = now;

        // Clear the canvas
        this.regl.clear({
            color: colors.blueSky, // Sky background
        });

        // Draw obstacles
        const wasStop = this.stop;
        this.obstacles.forEach((obstacle) => {
            if (!wasStop) obstacle.update(diff_time);
            const propertiesObstacle = {
                color: obstacle.getColor(),
                transform: obstacle.getTransform(),
            };
            this.drawObstacle(propertiesObstacle);

            // Check for collisions
            if (this.player.checkCollision(obstacle)) {
                this.player.setColors([1.0, 1.0, 0.0]);
                this.stopGame();
            }
        });

        // Draw player
        const propertiesPlayer = {
            transform: this.player.getTransform(),
            color: this.player.getColor(),
        };
        this.drawPlayer(propertiesPlayer);
    }
}