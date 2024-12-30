import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";

export class Displayed{

    
    constructor(){
        this.position = vec2.fromValues(0, 0)
        this.color = [0.4, 0.7, 0.2]
    }

    setPosition(position){
        this.position = position
    }

    move(position){
        vec2.add(this.position, position, position)
    }

    getPosition(){
        return this.position
    }

    getTransform(){
        const matrix = mat3.create()
        mat3.fromTranslation(matrix, this.position)
        return matrix
    }

    setColors(color){
        console.log(color)
        this.color = color
    }

    getColor(){
        return this.color
    }

}