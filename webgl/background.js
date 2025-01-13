import {Displayed} from "./displayed.js";
import {vec2, mat3} from "../lib/gl-matrix/index.js";


export class Background extends Displayed{

    constructor(width, height) {
        super(width, height);
        this.reset();
    }

    reset() {
        this.position = vec2.fromValues(0, 0);
    }

    update(displacementY){
        this.move(vec2.fromValues(0, displacementY/5.0));
    }

    getBackgroundMatrix() {
        const matrix = mat3.create();
        mat3.translate(matrix, matrix, this.position);
        mat3.scale(matrix, matrix, vec2.fromValues(this.width, this.height));
        return matrix;
    }

}