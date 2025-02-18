import { Enemy } from './enemy.js';
import {OPTIMAL_RATIO, WIDTH} from "./ScreenManager.js";
import {Enemy_circle} from "./enemy_circle.js";
import {Enemy_line} from "./enemy_line.js";

// Level Constants
const NORMAL_SPACE_ENEMIES_CLOSE = 2.2;
const NORMAL_SPACE_ENEMIES_FAR = 7.2;
const NUMBER_ENEMIES_START = 3;
const NUMBER_ENEMIES_SINUS = 8;
const NUMBER_ENEMIES_CIRCLE = 16;
const RADIUS_ENEMIES_CIRCLE = 8.4;
const ANGULAR_VELOCITY = -0.6

// Utility function to create an array of enemies at specific positions
function createEnemies(positions, start_y, size = 1) {
    const enemies = new Set();
    positions.forEach(({ offsetX, offsetY, count }) => {
        for (let i = 0; i < count; i++) {
            const x = i * size / ((count - 1) * 0.5) + size * offsetX;
            const y = -start_y + offsetY;
            enemies.add(new Enemy(x, y));
        }
    });
    return enemies;
}

// Abstract Level Class
class Level {
    constructor(size, start_y) {
        if (new.target === Level) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.size = size;
        this.start_y = start_y;
    }

    getSize() {
        return this.size;
    }

    getStartY() {
        return this.start_y
    }

    getEndY() {
        return this.start_y + this.size;
    }

    getEnemies() {
        return this.enemies;
    }
}

// Level 1 Class
class Level1 extends Level {
    constructor(start_y) {
        super(3 * NORMAL_SPACE_ENEMIES_FAR, start_y);

        const enemyByRow = Math.floor(Math.random() * 3 + 2);
        const enemyRows = [
            { offsetX: -1, offsetY: 0, count: enemyByRow },
            { offsetX: -(enemyByRow - 2) / (enemyByRow - 1), offsetY: -NORMAL_SPACE_ENEMIES_FAR, count: enemyByRow },
            { offsetX: -1, offsetY: -2 * NORMAL_SPACE_ENEMIES_FAR, count: enemyByRow },
            { offsetX: -(enemyByRow - 2) / (enemyByRow - 1), offsetY: -3 * NORMAL_SPACE_ENEMIES_FAR, count: enemyByRow }
        ];

        this.enemies = createEnemies(enemyRows, start_y, 9);
    }
}

// Level 2 Class
class Level2 extends Level {
    constructor(start_y) {
        super((NUMBER_ENEMIES_START + NUMBER_ENEMIES_SINUS-1) * NORMAL_SPACE_ENEMIES_CLOSE, start_y);

        this.enemies = new Set();

        // Create start enemies
        const startEnemies = Array.from({ length: NUMBER_ENEMIES_START }).map((_, i) => {
            const x = (10.35 / 2) + (NUMBER_ENEMIES_START - i) * 2;
            const y = -start_y - i * NORMAL_SPACE_ENEMIES_CLOSE;
            return [
                new Enemy(-x, y),
                new Enemy(x, y)
            ];
        }).flat();

        // Create sinus enemies
        const sinusEnemies = Array.from({ length: NUMBER_ENEMIES_SINUS }).map((_, i) => {
            const x = Math.sin(i / NUMBER_ENEMIES_SINUS * 2 * Math.PI + 0.3) * 5;
            const y = -start_y - (NUMBER_ENEMIES_START + i) * NORMAL_SPACE_ENEMIES_CLOSE;
            return [
                new Enemy(x + 12.35 / 2, y),
                new Enemy(x - 12.35 / 2, y)
            ];
        }).flat();

        this.enemies = new Set([...startEnemies, ...sinusEnemies]);
    }
}

// Level 3 Class
class Level3 extends Level {
    constructor(start_y) {
        super(RADIUS_ENEMIES_CIRCLE * 2, start_y);

        // Create circular enemies, skipping two to allow player pass
        const enemyPositions = Array.from({ length: NUMBER_ENEMIES_CIRCLE }).map((_, i) => {
            if (i % (NUMBER_ENEMIES_CIRCLE / 2) === 0) return null; // Skip every other enemy
            const alpha = (i * 2 * Math.PI) / NUMBER_ENEMIES_CIRCLE;
            return new Enemy_circle(0, -start_y - RADIUS_ENEMIES_CIRCLE, alpha, RADIUS_ENEMIES_CIRCLE, ANGULAR_VELOCITY);
        }).filter(Boolean);

        this.enemies = new Set(enemyPositions);
    }
}

const NUMBER_LINE_OF_ENEMIES = 3
const SPACE_BETWEEN_ENEMIES_HORIZONTAL = 3.2
const SPACE_BETWEEN_ENEMIES_VERTICAL = 10
const NUMBER_ENEMIES_PER_LINE = 5
const TIME_MOVE_SEC = 0.4
const TIME_STOP_SEC = 1
const TOTAL_CYCLE_TIME = TIME_STOP_SEC + TIME_MOVE_SEC

class Level4 extends Level {
    constructor(start_y) {
        super((NUMBER_LINE_OF_ENEMIES - 1) * SPACE_BETWEEN_ENEMIES_VERTICAL, start_y);

        const oppositeDirection = Math.random() < 0.5 ? 0 : 1

        this.enemies = new Set();
        for (let i = 0; i < NUMBER_ENEMIES_PER_LINE; ++i){
            for (let j = 0; j < NUMBER_LINE_OF_ENEMIES; j++) {

                const startLeft = j%2 * oppositeDirection
                this.enemies.add(
                    new Enemy_line(-WIDTH + i * SPACE_BETWEEN_ENEMIES_HORIZONTAL,
                        -start_y - j*SPACE_BETWEEN_ENEMIES_VERTICAL,
                        startLeft * TOTAL_CYCLE_TIME,
                        2 * WIDTH - (NUMBER_ENEMIES_PER_LINE - 1) * SPACE_BETWEEN_ENEMIES_HORIZONTAL,
                        0,
                        TIME_STOP_SEC,
                        TIME_MOVE_SEC)
                );
            }
        }

    }
}

// Random Level Selector
export function randomLevel(start_y) {
    //const listLevels = [Level3]
    const listLevels = [Level1, Level2, Level3, Level4];
    return new listLevels[Math.floor(Math.random() * listLevels.length)](start_y);
}

