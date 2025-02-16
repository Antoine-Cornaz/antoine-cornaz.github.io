// Import the Enemy class from enemy.js
import { Background } from "./background.js";
import { mat3 } from "../lib/gl-matrix/index.js";
import { randomLevel } from "./level.js";
import {HEIGHT, WIDTH} from "./ScreenManager.js";


const SPEED_FALLING_BEGINNING = 50;        // Initial falling speed
const ACCELERATION_FALLING = 3;            // Acceleration of falling speed (set to 0 for constant speed)
const SPACE_BETWEEN_LEVELS = 3.6;

export class LevelController {
    constructor() {
        this.enemies = new Set([]);                     // Array to hold enemy instances
        this.clearEnemies();                   // Initialize enemies array
        this.speed = Math.log(SPEED_FALLING_BEGINNING); // Initial speed based on logarithm

        this.background = new Background();
        this.restart();                        // Restart the level

        this.numberLevel = 0
    }

    /**
     * Restart the level by clearing enemies and resetting counters.
     */
    restart() {
        this.clearEnemies();
        this.oldDisplacement = 0;
        this.totalTime = 0;
        this.score = 0;
        this.background.reset();
        this.levels = new Set([]);
        this.levelEnd = HEIGHT;
        this.addLevel();
        
    }

    /**
     * Update the level state based on the elapsed time.
     * @param {number} diffTimeS - Time difference since the last update (in seconds)
     * @param {number} playerHeightPosition - The y position of the player (for the score)
     */
    update(diffTimeS, playerHeightPosition) {
        this.totalTime += diffTimeS;

        // Update speed based on total time and acceleration
        this.speed = Math.log(this.totalTime * ACCELERATION_FALLING + SPEED_FALLING_BEGINNING);

        // Calculate vertical displacement for this update
        const displacementY = this.speed * diffTimeS;

        // Update each enemy's position and remove it if it's above the screen
        this.allEnemies().forEach(enemy => {
            enemy.update(displacementY, diffTimeS);
            if (enemy.isAboveScreen()) {
                this.enemies.delete(enemy);
            }
        });

        this.background.update(displacementY, diffTimeS);

        // Update the cumulative displacement
        this.oldDisplacement += displacementY;
        this.updateSetLevel(this.oldDisplacement);
        this.updateScore(playerHeightPosition);
    }

    addLevel(){
        const level = randomLevel(this.levelEnd);
        this.levels.add(level);
        this.levelEnd = level.getEndY() + SPACE_BETWEEN_LEVELS;
    }

    cleanLevel(){
        for (const level of this.levels){
            if (level.getEndY() < -1.5){
                this.levels.delete(level);
            }
        }
    }

    *allEnemies() { for (const level of this.levels) { yield* level.getEnemies(); }}

    updateScore(playerHeight){
        const newScore = 100 * (this.oldDisplacement - playerHeight + HEIGHT);

        if (newScore > this.score){
            this.score = newScore;
        }
    }

    /**
     * Clear all enemies from the level.
     */
    clearEnemies() {
        this.enemies.clear();
    }

    getScore(){
        return this.score;
    }

    /**
     * Update the enemy list by adding new enemies based on displacement.
     * @param {number} totalDisplacement - The vertical displacement since the last update
     */
    updateSetLevel(totalDisplacement) {
        this.cleanLevel();

        if (totalDisplacement + 2*HEIGHT > this.levelEnd){
            this.numberLevel++
            this.addLevel();
        }
    }

    getBackgroundMatrix() {
        return this.background.getTransform();
    }

    draw(screenManagerMatrix, drawEnemy, lose_callback, collision_callback) {
        this.allEnemies().forEach((ennemie) => {
            // Define properties for the enemy's rendering
            let transformation = mat3.create();
            mat3.multiply(transformation, screenManagerMatrix, ennemie.getTransform());
            const propertiesEnnemie = {
                color: ennemie.getColor(),
                transform: transformation,
            };

            // Draw the enemy using the defined draw command
            drawEnemy(propertiesEnnemie);

            // Check for collision between the player and the enemy
            if (collision_callback(ennemie)) {
                // If collision occurs, trigger the loose condition
                lose_callback();
            }
        });
    }
}
