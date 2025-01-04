import { Enemy } from "./enemy.js";
import { vec2 } from "../lib/gl-matrix/index.js";


const DISTANCE_ENEMIES = 0.2;
export class LevelController {

    constructor() {
        this.ennemies = [];
        this.clearEnemies();
        this.old_displacement = 0;
        this.speed = 1.2;
    }

    restart() {
        this.clearEnemies();
        this.old_displacement = 0;
    }

    update(diff_time){
        const displacement_y = this.speed * diff_time; 
        this.ennemies.forEach(ennemy => {
            ennemy.update(diff_time, displacement_y);
            if (ennemy.getPosition()[1] > 1.5){
                this.removeEnemy(ennemy);
            }
        });
        this.updateEnemyList(displacement_y);
        this.old_displacement += displacement_y;
    }

    getEnemies(){
        return this.ennemies;
    }

    clearEnemies() {
        this.ennemies = [];
    }

    addEnemy(ennemy){
        this.ennemies.push(ennemy);
    }

    removeEnemy(ennemy){
        const index = this.ennemies.indexOf(ennemy);
        this.ennemies.splice(index, 1);
    }

    updateEnemyList(time){
        const newEnnemies = this.getNumberOfNewEnemies(time)
        for(let i = 0; i < newEnnemies; i++){
            this.addEnemy(new Enemy());
        }
    }

    getNumberOfNewEnemies(displacement_y){
        const newAmountEnemy = Math.floor((this.old_displacement + displacement_y) / DISTANCE_ENEMIES);
        const oldAmountEnemy = Math.floor((this.old_displacement                 ) / DISTANCE_ENEMIES);
        return newAmountEnemy - oldAmountEnemy;
    }

}