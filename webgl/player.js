import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";
import { OPTIMAL_RATIO } from "./ScreenManager.js";

const HALF_PLAYER_HEIGHT = 0.10;
const HALF_PLAYER_DEFAULT_WIDTH = HALF_PLAYER_HEIGHT/OPTIMAL_RATIO;
const PLAYER_COLOR = COLORS.floor.slice(0, 3)
export class Player extends Displayed{

    constructor(){
        super(HALF_PLAYER_DEFAULT_WIDTH, HALF_PLAYER_HEIGHT, PLAYER_COLOR);
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

        const total_height = enemy.getHeight() + this.getHeight()
        const total_width = enemy.getWidth() + this.getWidth()

        // Check if the player is outside the square of the obstacle
        if (!(diff_x < total_width && diff_y < total_height)){
            return false
        }
        
        const y_increase = obstaclePosition[1] - playerPosition[1]

        if (OPTIMAL_RATIO*2*diff_x - y_increase >= 3*enemy.getHeight() + this.getHeight()){
            return false
        }

        return true
    }

}