import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { Displayed } from "./displayed.js";
import { ENEMY_SIZE } from "./enemy.js";

export const PLAYER_HEIGHT = 0.10;
export const PLAYER_DEFAULT_WIDTH = 0.10;
const PLAYER_COLOR = [0.4, 0.3, 0.2]
export class Player extends Displayed{

    constructor(){
        super(0.1, 0.1, PLAYER_COLOR)
        this.reset()
    }

    reset(){
        this.setPosition(vec2.fromValues(0.2, 0.4))
        this.setColors(PLAYER_COLOR)
    }


    checkCollision(enemy){
        const playerPosition = this.getPosition()
        const obstaclePosition = enemy.getPosition()

        const diff_x = Math.abs(playerPosition[0] - obstaclePosition[0])
        const diff_y = Math.abs(playerPosition[1] - obstaclePosition[1])

        const total_size = enemy.getHeight() + PLAYER_HEIGHT

        // Check if the player is outside the square of the obstacle
        if (!(diff_x < total_size && diff_y < total_size)){
            return false
        }
        
        const y_increase = obstaclePosition[1] - playerPosition[1]

        if (2*diff_x - y_increase >= 3*ENEMY_SIZE + PLAYER_HEIGHT){
            return false
        }

        return true
    }
}