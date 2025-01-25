import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";
import { OPTIMAL_RATIO } from "./ScreenManager.js";

const HALF_PLAYER_HEIGHT = 0.10;
const HALF_PLAYER_DEFAULT_WIDTH = HALF_PLAYER_HEIGHT/OPTIMAL_RATIO;
const PLAYER_COLOR = COLORS.floor.slice(0, 3)

// number of vitesse to keep in memory
const LAST_VITESSE_RECORD = 10

export class Player extends Displayed{

    constructor(){
        super(HALF_PLAYER_DEFAULT_WIDTH, HALF_PLAYER_HEIGHT, PLAYER_COLOR);
        this.reset()
        this.old_position_y = 0
        this.vitesse_y = 0
        this.tick = 0
    }

    reset(){
        this.setPosition(vec2.fromValues(0.2, 0.4))
        this.setColors(PLAYER_COLOR)
    }

    
    update(diff_time){
        this.update_width(diff_time)
    }

    update_width(diff_time){
        diff_time = Math.max(diff_time, 0.01)
        const position_y = this.getPosition()[1]
        const old_position_y = this.old_position_y
        this.old_position_y = position_y
        let new_vitess_y = (position_y - old_position_y)/diff_time


        const alpha = 4
        const beta = Math.min(diff_time*alpha, 0.6)
        this.vitesse_y = (this.vitesse_y * (1-beta)) + (new_vitess_y * beta)


        let width = HALF_PLAYER_DEFAULT_WIDTH*3/4 + this.vitesse_y/30
        width = Math.min(Math.max(width, HALF_PLAYER_DEFAULT_WIDTH/4), HALF_PLAYER_DEFAULT_WIDTH)
        this.width = width
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