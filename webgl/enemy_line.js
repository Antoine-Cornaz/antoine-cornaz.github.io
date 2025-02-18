import {Enemy} from "./enemy.js";
import {vec2} from "../lib/gl-matrix/index.js";

export class Enemy_line extends Enemy{

    constructor(initialX, initialY, t0, distance_x, distance_y, timeStop, timeMove) {
        super(initialX, initialY);
        this.initialX = initialX;
        this.initialY = initialY;
        this.totalTime = t0;
        this.distance_x = distance_x;
        this.distance_y = distance_y;
        this.timeStop = timeStop;
        this.timeMove = timeMove;
    }

    update(displacement_y, diffTime) {
        super.update(displacement_y, diffTime);

        const total_time_loop = this.timeStop + this.timeMove;

        this.totalTime += diffTime
        // Repetition of movement every 2 total time
        this.t = (this.totalTime + diffTime) % (2*total_time_loop)

        // Do same movement backward
        if (this.t > total_time_loop) {
            this.t = 2*total_time_loop - this.t;
        }

        // alpha is 0 beginning, 1 end of line.
        let alpha;
        if (this.t < this.timeStop / 2) {
            alpha = 0
        }else if (this.t - this.timeStop / 2 <  this.timeMove){
            // alpha between 0 and 1
            const x = (this.t - this.timeStop / 2) / this.timeMove
            alpha = sinusTransition(x)
        }else {
            alpha = 1
        }


        const x = this.initialX + alpha * this.distance_x
        const y = this.initialY + alpha * this.distance_y

        this.setRelativePosition(vec2.fromValues(x, y))

    }

}

function sinusTransition(x){
    return (1 + Math.sin(Math.PI * (x-1/2)))/2
}