import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";
import { OPTIMAL_RATIO } from "./ScreenManager.js";

export const HALF_ENEMY_HEIGHT = 0.07;
export const HALF_ENEMY_WIDTH = HALF_ENEMY_HEIGHT/OPTIMAL_RATIO;
const ENEMY_COLOR = COLORS.barrier.slice(0, 3);


export class Enemy extends Displayed{
    
    constructor(x, y){
        super(HALF_ENEMY_WIDTH, HALF_ENEMY_HEIGHT, ENEMY_COLOR);
        if (x === undefined){
            x = Math.random()*2 - 1
        }

        if (y === undefined){
            y = -1.3
        }

        this.setPosition(vec2.fromValues(x, y));
    }

    update(displacement_y){
        const position = this.getPosition();
        vec2.add(position, position, vec2.fromValues(0, displacement_y));
        this.setPosition(position);
    }

    getSize(){
        return this.size;
    }

}