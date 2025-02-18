import {vec2} from "../lib/gl-matrix/index.js";


export class Camera {

    constructor() {
        this.reset()
    }

    reset(){
        this.position = vec2.fromValues(0, 0)
    }

    update(displacement_y, diffTime){
        this.position[1] += displacement_y
    }

    getPosition() {
        return this.position;
    }


}