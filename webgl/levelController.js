// Import the Enemy class from enemy.js
import { Enemy } from "./enemy.js";

// Constants
const DISTANCE_ENEMIES = 0.3;             // Distance between enemies to spawn
const SPEED_FALLING_BEGINNING = 2;        // Initial falling speed
const ACCELERATION_FALLING = 0.5;            // Acceleration of falling speed (set to 0 for constant speed)

export class LevelController {
    constructor() {
        this.enemies = [];                     // Array to hold enemy instances
        this.clearEnemies();                   // Initialize enemies array
        //this.oldDisplacement = 0;              // Track cumulative displacement
        //this.totalTime = 0;                    // Total elapsed time
        this.speed = Math.log(SPEED_FALLING_BEGINNING); // Initial speed based on logarithm
        //this.score = 0;                        // Score based on displacement, how far the player can go
        this.restart();                        // Restart the level
    }

    /**
     * Restart the level by clearing enemies and resetting counters.
     */
    restart() {
        this.clearEnemies();
        this.oldDisplacement = 0;
        this.totalTime = 0;
        this.score = 0;
    }

    /**
     * Update the level state based on the elapsed time.
     * @param {number} diffTime - Time difference since the last update (in seconds)
     */
    update(diffTime, playerHeight) {
        this.totalTime += diffTime;

        // Update speed based on total time and acceleration
        this.speed = Math.log(this.totalTime * ACCELERATION_FALLING + SPEED_FALLING_BEGINNING);

        // Calculate vertical displacement for this update
        const displacementY = this.speed * diffTime;

        // Update each enemy's position and remove it if it's above the screen
        this.enemies.forEach(enemy => {
            enemy.update(displacementY);
            if (enemy.isAboveScreen()) {
                this.removeEnemy(enemy);
            }
        });

        // Determine and add new enemies based on displacement
        this.updateEnemyList(displacementY);

        // Update the cumulative displacement
        this.oldDisplacement += displacementY;
        this.updateScore(playerHeight);
    }

    updateScore(playerHeight){
        const newScore = 1000 * (this.oldDisplacement - playerHeight + 1);

        if (newScore > this.score){
            this.score = newScore;
        }
    }

    /**
     * Get the list of current enemies.
     * @returns {Array} Array of enemy instances
     */
    getEnemies() {
        return this.enemies;
    }

    /**
     * Clear all enemies from the level.
     */
    clearEnemies() {
        this.enemies = [];
    }

    getScore(){
        return this.score;
    }

    /**
     * Add a new enemy to the level.
     * @param {Enemy} enemy - The enemy instance to add
     */
    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    /**
     * Remove an enemy from the level.
     * @param {Enemy} enemy - The enemy instance to remove
     */
    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * Update the enemy list by adding new enemies based on displacement.
     * @param {number} displacementY - The vertical displacement since the last update
     */
    updateEnemyList(displacementY) {
        const newEnemiesCount = this.getNumberOfNewEnemies(displacementY);
        for (let i = 0; i < newEnemiesCount; i++) {
            this.addEnemy(new Enemy());
        }
    }

    /**
     * Calculate the number of new enemies to add based on displacement.
     * @param {number} displacementY - The vertical displacement since the last update
     * @returns {number} Number of new enemies to add
     */
    getNumberOfNewEnemies(displacementY) {
        const newAmountEnemy = Math.floor((this.oldDisplacement + displacementY) / DISTANCE_ENEMIES);
        const oldAmountEnemy = Math.floor(this.oldDisplacement / DISTANCE_ENEMIES);
        const enemiesToAdd = newAmountEnemy - oldAmountEnemy;

        return enemiesToAdd;
    }
}
