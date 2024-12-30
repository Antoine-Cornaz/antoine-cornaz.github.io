import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { Displayed } from "./displayed.js";
import { colors } from "./colors.js";


export class Obstacle extends Displayed{
    
    constructor(position){
        super();
        this.setPosition(position);
        this.FALLING_SPEED = 1.5;
        this.color = [0.4, 0.7, 0.2];
    }

    update(time){
        const position = this.getPosition();
        vec2.add(position, position, vec2.fromValues(0, this.FALLING_SPEED * time));
        this.setPosition(position);

        if(position[1] > 1.1){
            this.respawn();
        }
    }

    respawn(){
        this.setPosition(vec2.fromValues(Math.random()*2 - 1, -1));
    }

}