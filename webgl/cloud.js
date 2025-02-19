import {Displayed} from "./displayed.js";
import {mat3, vec2} from "../lib/gl-matrix/index.js";
import {uniformRandom} from "./utils.js";



const MIN_SIZE_CLOUD = 0.06
const MAX_SIZE_CLOUD = 0.15

export class Cloud extends Displayed{

    constructor(x, y) {

        const size = uniformRandom(MIN_SIZE_CLOUD, MAX_SIZE_CLOUD)
        console.log("size", size)

        super(size, size, null, size*3)
        this.position = vec2.fromValues(x, y)
    }


    getTransform(positionCamera = vec2.fromValues(0, 0)) {

        // Compute final position
        const pos = this.getRelativePosition();
        const finalPos = vec2.fromValues(pos[0] + positionCamera[0],
            pos[1] + positionCamera[1] * this.rising_speed);


        // Apply transformations
        const matrix = mat3.create();

        mat3.fromScaling(matrix, vec2.fromValues(this.width, this.height))
        mat3.translate(matrix, matrix, finalPos);

        return matrix;
    }

}