import {Enemy} from "./enemy.js";
import {vec2} from "../lib/gl-matrix/index.js";

export class Enemy_circle extends Enemy{

    constructor(centerX, centerY, alpha_0, radius, angular_velocity) {
        super(centerX + Math.cos(alpha_0) * radius, centerY + Math.sin(alpha_0) * radius);
        this.centerX = centerX;
        this.centerY = centerY;
        this.alpha = alpha_0;
        this.radius = radius;
        this.angular_velocity = angular_velocity;
    }

    newX(){
        return this.centerX + Math.cos(this.alpha) * this.radius
    }

    newY(){
        return this.centerY + Math.sin(this.alpha) * this.radius
    }

    update(displacement_y, diffTime) {
        super.update(displacement_y, diffTime);

        this.alpha += diffTime*this.angular_velocity;

        const newX = this.newX();
        const newY = this.newY();

        this.setRelativePosition(vec2.fromValues(newX, newY));
    }

}