import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";

export const ENEMY_SIZE = 0.08;
const ENEMY_COLOR = COLORS.barrier.slice(0, 3);
export class Enemy extends Displayed{
    
    constructor(){
        super(ENEMY_SIZE, ENEMY_SIZE, ENEMY_COLOR);
        this.setPosition(vec2.fromValues(Math.random()*2 - 1, -1.3));
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