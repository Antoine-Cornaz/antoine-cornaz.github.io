import {Displayed} from "./displayed.js";
import {vec2, mat3} from "../lib/gl-matrix/index.js";

export class Background extends Displayed{

    constructor() {
        super(3, 3, undefined, 0.4);
        this.reset();
    }

    reset() {
        this.position = vec2.fromValues(0, 0);
    }

}