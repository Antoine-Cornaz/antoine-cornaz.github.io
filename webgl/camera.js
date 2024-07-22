import {mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";

let view

export function changeViewDirection(x, y){

    const theta0 = 1.7
    const theta = -(x-0.5) + theta0
    const phi = -(y-0.5)

    const eye = vec3.fromValues(0.38, -12, 3.34)
    const direction = vec3.fromValues(Math.cos(theta)*Math.cos(phi), Math.sin(theta)*Math.cos(phi), Math.sin(phi))
    const center = vec3.add(vec3.create(), eye, direction);
    const up = vec3.fromValues(0, 0,1)


    view = mat4.lookAt(
        mat4.create(),
        eye,
        center,
        up
    )
}

export function getView(){
    return view
}