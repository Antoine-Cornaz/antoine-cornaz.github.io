import {Enemy} from "./enemy.js";
import {vec2} from "../lib/gl-matrix";

const ANGULAR_VELOCITY = -0.6;
export class Enemy_circle extends Enemy{

    constructor(centerX, centerY, alpha_0, radius) {
        super(centerX + Math.cos(alpha_0) * radius, centerY + Math.sin(alpha_0) * radius);
        this.centerX = centerX;
        this.centerY = centerY;
        this.alpha = alpha_0;
        this.radius = radius;
    }

    newX(){
        return this.centerX + Math.cos(this.alpha) * this.radius
    }

    newY(){
        return this.centerY + Math.sin(this.alpha) * this.radius
    }

    update(displacement_y, diffTime) {
        super.update(displacement_y, diffTime);

        this.alpha += diffTime*ANGULAR_VELOCITY;
        this.centerY += displacement_y;

        const newX = this.newX();
        const newY = this.newY();

        this.setPosition(vec2.fromValues(newX, newY));
    }

}