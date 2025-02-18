import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";
import { OPTIMAL_RATIO } from "./ScreenManager.js";

const HALF_PLAYER_HEIGHT = 0.90;
const HALF_PLAYER_DEFAULT_WIDTH = HALF_PLAYER_HEIGHT/OPTIMAL_RATIO;
const PLAYER_COLOR = COLORS.floor.slice(0, 3)


export class Player extends Displayed{

    constructor(){
        super(HALF_PLAYER_DEFAULT_WIDTH, HALF_PLAYER_HEIGHT, PLAYER_COLOR, 0);
        this.reset()
        this.old_position_y = 0
        this.vitesse_y = 0
        this.tick = 0
    }

    reset(){
        this.setRelativePosition(vec2.fromValues(0.2, 0.4))
        this.setColors(PLAYER_COLOR)
    }

    /**
     * Set the position of the object.
     * @param {vec2} position - New position vector
     */
    setRelativePosition(position) {
        position[0] = Math.min(Math.max(position[0], -9), 9);
        position[1] = Math.min(Math.max(position[1], -16), 16);
        vec2.copy(this.position, position);
    }

    
    update(diff_time){
        super.update(diff_time);
        this.update_width(diff_time)
    }

    /***
      * The width of the player is smaller when the player go fast to mimic a free dive.
     */
    update_width(diff_time){
        diff_time = Math.max(diff_time, 0.01)
        const position_y = this.getRelativePosition()[1]
        const old_position_y = this.old_position_y
        this.old_position_y = position_y
        let new_speed_y = (position_y - old_position_y)/diff_time


        const alpha = 4
        const beta = Math.min(diff_time*alpha, 0.6)
        this.vitesse_y = (this.vitesse_y * (1-beta)) + (new_speed_y * beta)


        let width = HALF_PLAYER_DEFAULT_WIDTH*3/4 + this.vitesse_y/30
        width = Math.min(Math.max(width, HALF_PLAYER_DEFAULT_WIDTH/4), HALF_PLAYER_DEFAULT_WIDTH)
        this.width = width
    }


    checkCollision(enemy, cameraPosition){
        const playerPosition = this.getRelativePosition()
        let obstaclePosition = enemy.getRelativePosition()
        const finalPosition = vec2.create()
        vec2.add(finalPosition, obstaclePosition, cameraPosition)

        const diff_x = Math.abs(playerPosition[0] - finalPosition[0])
        const diff_y = Math.abs(playerPosition[1] - finalPosition[1])

        const total_height = enemy.getHeight() + this.getHeight()
        const total_width = enemy.getWidth() + this.getWidth()

        // Check if the player is outside the square of the obstacle
        if (!(diff_x < total_width && diff_y < total_height)){
            return false
        }
        
        const y_increase = finalPosition[1] - playerPosition[1]

        if (OPTIMAL_RATIO*2*diff_x - y_increase >= 3*enemy.getHeight() + this.getHeight()){
            return false
        }

        return true
    }

}