import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import { COLORS } from "./colors.js";
import { Displayed } from "./displayed.js";
import { OPTIMAL_RATIO } from "./ScreenManager.js";

export const HALF_ENEMY_HEIGHT = 0.6;
export const HALF_ENEMY_WIDTH = HALF_ENEMY_HEIGHT/OPTIMAL_RATIO;
const ENEMY_COLOR = COLORS.barrier.slice(0, 3);


export class Enemy extends Displayed{
    
    constructor(x, y){
        super(HALF_ENEMY_WIDTH, HALF_ENEMY_HEIGHT, ENEMY_COLOR, 1);

        this.setRelativePosition(vec2.fromValues(x, y));
    }
}