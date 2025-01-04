import { createREGL } from "../lib/regl.js";
import { colors } from "./colors.js";

import { vec2 } from "../lib/gl-matrix/index.js";
import { load_resources } from "./helper.js";
import { addListener } from "./control.js";
import { Player } from "./player.js";
import { LevelController } from "./levelController.js";
import { ENEMY_SIZE } from "./enemy.js";
import { PLAYER_SIZE } from "./player.js";



export class Game {
    constructor() {
        this.regl = createREGL();
        this.player = new Player();
        this.shaders = {};
        this.objects = {};
        this.old_time = 0;
        this.frameLoop = null;
        this.levelController = new LevelController();
        this.firstFrame = true;
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


        const canvas = document.getElementsByTagName("canvas")[0];
        addListener(window, canvas, this.player, this.restart.bind(this));

        // Create draw commands
        this.createDrawCommands();
    }


    createDrawCommands() {
        // Define a draw command for the player
        this.drawPlayer = this.regl({
            vert: this.shaders["basic.vert.glsl"],
            frag: this.shaders["basic.frag.glsl"],
            attributes: {
                position: [
                    [0.0, -PLAYER_SIZE],
                    [-PLAYER_SIZE, PLAYER_SIZE],
                    [PLAYER_SIZE, PLAYER_SIZE],
                ],
            },
            uniforms: {
                color: this.regl.prop("color"),
                transform: this.regl.prop("transform"),
            },
            count: 3,
        });

        

        // Define a draw command for the ennemies
        this.drawEnnemie = this.regl({
            vert: this.shaders["basic.vert.glsl"],
            frag: this.shaders["basic.frag.glsl"],
            attributes: {
                position: [
                    [-ENEMY_SIZE, ENEMY_SIZE],
                    [-ENEMY_SIZE, -ENEMY_SIZE],
                    [ENEMY_SIZE, -ENEMY_SIZE],
                    [-ENEMY_SIZE, ENEMY_SIZE],
                    [ENEMY_SIZE, -ENEMY_SIZE],
                    [ENEMY_SIZE, ENEMY_SIZE],
                ],
            },
            uniforms: {
                color: this.regl.prop("color"),
                transform: this.regl.prop("transform"),
            },
            count: 6,
        });
    }

    prepare() {
        this.frameLoop = this.regl.frame(this.update.bind(this));
        this.stopGame();
    }

    start() {
        this.stop = false;
        this.frameLoop = this.regl.frame(this.update.bind(this));
        this.firstFrame = true;
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
        this.levelController.restart();
        this.start();
    }

    update(frame) {
        const now = frame.time;
        let diff_time = now - this.old_time;
        this.old_time = now;
        if (this.firstFrame){
            diff_time = 0;
            this.firstFrame = false;
        }
        

        // Update the level
        this.levelController.update(diff_time);

        // Clear the canvas
        this.regl.clear({
            color: colors.blueSky, // Sky background
        });

        // Draw ennemies
        this.levelController.getEnemies().forEach((ennemie) => {
            const propertiesEnnemie = {
                color: ennemie.getColor(),
                transform: ennemie.getTransform(),
            };
            this.drawEnnemie(propertiesEnnemie);

            // Check for collisions
            if (this.player.checkCollision(ennemie)) {
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