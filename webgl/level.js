
import {Enemy} from './enemy.js';

export function randomLevel(start_y){
    return new listLevels[Math.floor(Math.random() * listLevels.length)](start_y);
}

/**
    @constructor
    @abstract
 */
class Level{
    constructor(size) {
        if (this.constructor == Level) {
          throw new Error("Abstract classes can't be instantiated.");
        }
        this.size = size;
      }

    getSize() {
        return this.size;
    }

    getEndY(){
        return this.start_height + this.size;// go down
    }

    getEnemies() {
        return this.enemies;
    }
}

const SIZE_LEVEL_1 = 3.2;
const NORMAL_SPACE_ENNEMIES_CLOSE = 0.2;
const NORMAL_SPACE_ENNEMIES_FAR = 0.8;
class LevelBasic1 extends Level {
  constructor(start_y) {
    super(SIZE_LEVEL_1);
    this.enemies = new Set();
    this.start_height = start_y;

    const enemyByRow = Math.floor(Math.random()*3+2);

    this.enemies = createEnemiesLevel1(start_y, enemyByRow);
  }
}

function createEnemiesLevel1(start_y, count) {
    const enemies = new Set();
    const c = -(count-2)/ (count-1);
    const enemyRows = [
      { offsetX: -1, offsetY: 0 },
      { offsetX: c, offsetY: -NORMAL_SPACE_ENNEMIES_FAR },
      { offsetX: -1, offsetY: -2 * NORMAL_SPACE_ENNEMIES_FAR},
      { offsetX: c, offsetY: -3 * NORMAL_SPACE_ENNEMIES_FAR },
    ];

    enemyRows.forEach(({ offsetX, offsetY }) => {
      for (let i = 0; i < count; i++) {
        enemies.add(new Enemy(i / ((count-1)*0.5) + offsetX, -start_y + offsetY));
      }
    });

    return enemies;
}

const NUMBER_ENEMIES_START = 5;
const NUMBER_ENEMIES_SINUS = 15;

function createEnemiesLevel2(start_y) {
    const SPACE_PIPE = 1.15;
    
    const enemies = new Set();
    for (let i = 0; i < NUMBER_ENEMIES_START; i++) {
      const x = (SPACE_PIPE/2 - 1) / (NUMBER_ENEMIES_START) * i + 1;
      const y = -start_y - i * NORMAL_SPACE_ENNEMIES_CLOSE

      enemies.add(new Enemy(-x, y));
      enemies.add(new Enemy(x, y));
    }

    

    for (let i = 0; i < NUMBER_ENEMIES_SINUS; i++) {
      const x = Math.sin(i / NUMBER_ENEMIES_SINUS * 2 * Math.PI) * 0.6;
      const y = -start_y - (NUMBER_ENEMIES_START + i) * NORMAL_SPACE_ENNEMIES_CLOSE;

      enemies.add(new Enemy(x + SPACE_PIPE/2 , y));
      enemies.add(new Enemy(x - SPACE_PIPE/2 , y));
    }

    return enemies;
}

class Level2 extends Level {
  constructor(start_y) {
    super((NUMBER_ENEMIES_START + NUMBER_ENEMIES_SINUS) * NORMAL_SPACE_ENNEMIES_CLOSE);
    this.enemies = new Set();
    this.start_height = start_y;

    this.enemies = createEnemiesLevel2(start_y);
  }
}

const listLevels = [LevelBasic1, Level2];