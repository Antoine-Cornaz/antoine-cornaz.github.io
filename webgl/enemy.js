import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { Displayed } from "./displayed.js";

export const ENEMY_SIZE = 0.08;
const ENEMY_COLOR = [0.4, 0.7, 0.1]
export class Enemy extends Displayed{
    
    constructor(){
        super(0.08, 0.08, ENEMY_COLOR);
        this.setPosition(vec2.fromValues(Math.random()*2 - 1, -2));
        this.FALLING_SPEED = 1.2;
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