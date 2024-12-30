import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { Displayed } from "./displayed.js";

export class Player extends Displayed{

    constructor(){
        super()
        this.setPosition(vec2.fromValues(0.2, 0.4))
        this.setColors([0.4, 0.3, 0.2])
    }

    checkCollision(obstacle){
        const playerPosition = this.getPosition()
        const obstaclePosition = obstacle.getPosition()
        return Math.abs(playerPosition[0] - obstaclePosition[0]) < 0.3 && Math.abs(playerPosition[1] - obstaclePosition[1]) < 0.3
    }
    

}