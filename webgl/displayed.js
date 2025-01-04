import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";

export class Displayed{

    
    constructor(width, height, color){
        this.position = vec2.fromValues(0, 0)
        this.color = [0.4, 0.7, 0.2]
        this.width = width
        this.height = height
        this.color = color
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
        mat3.translate(matrix, matrix, this.position)
        mat3.scale(matrix, matrix, vec2.fromValues(this.width, this.height))
        return matrix
    }

    setColors(color){
        this.color = color
    }

    getColor(){
        return this.color
    }

    getWidth(){
        return this.width
    }

    getHeight(){
        return this.height
    }
}