import {mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";


const theta0 = 1.7
export class Camera{
    position
    direction
    view
    theta
    phi

    constructor() {
        this.reset()
        this.updateView()
    }

    changeViewDirection(direction, time){

        const speed = 0.005;
        this.theta -= direction[0]*time * speed
        this.phi -= direction[1]*time * speed

        this.updateView()
    }

    reset(){
        this.position = vec3.fromValues(0.38, -12, 3.34)
        this.direction = vec3.fromValues(1, 0, 0)
        this.view = mat4.create();
        this.theta = theta0
        this.phi = 0
    }

    updateView(){
        const direction = vec3.fromValues(Math.cos(this.theta)*Math.cos(this.phi), Math.sin(this.theta)*Math.cos(this.phi), Math.sin(this.phi))
        const center = vec3.add(vec3.create(), this.position, direction);
        this.view = mat4.lookAt(
            mat4.create(),
            this.position,
            center,
            vec3.fromValues(0, 0,1)
        )
    }


    move(direction){
        const speed = 0.1
        const rotationToView = mat3.fromRotation(mat3.create(), this.theta)
        vec3.transformMat3(direction, direction, rotationToView)
        vec3.scale(direction, direction, speed)
        vec3.add(this.position, this.position, direction)
        this.updateView()
    }

    getView(){
        return this.view
    }
}

