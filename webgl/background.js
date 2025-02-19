import {Displayed} from "./displayed.js";
import {vec2, mat3} from "../lib/gl-matrix/index.js";
import {Cloud} from "./cloud.js";
import {HEIGHT, WIDTH} from "./ScreenManager.js";


const DISTANCE_CLOUD_MIN = 3
const DISTANCE_CLOUD_MAX = 8

export class Background{

    constructor() {
        this.reset();
    }

    reset() {
        this.position = vec2.fromValues(0, 0);

        this.clouds = new Set()

        this.lastCloudY = -HEIGHT
        this.totalDisplacement = 0;

        this.createCloud(10)
    }

    update(displacementY, diffTimeS) {
        // Update all clouds
        this.clouds.forEach(cloud => {cloud.update(displacementY, diffTimeS)});
        this.totalDisplacement += displacementY;
        this.updateCloudCreationDestruction()
    }

    updateCloudCreationDestruction(){
        let toRemoveSet = new Set()

        this.clouds.forEach(cloud => {

            if (HEIGHT - cloud.position[1] < this.totalDisplacement * cloud.rising_speed){
                toRemoveSet.add(cloud)
            }
        })

        // We remove all clouds and add the same amount.
        this.clouds = this.clouds.difference(toRemoveSet)
        this.createCloud(toRemoveSet.size)
    }

    createCloud(amount = 1){
        for (let i = 0; i < amount; i++) {
            this.lastCloudY += DISTANCE_CLOUD_MIN + Math.random() * (DISTANCE_CLOUD_MAX - DISTANCE_CLOUD_MIN);
            const x = (WIDTH - 3) * (Math.random() * 2 - 1);
            this.clouds.add(new Cloud(x, -this.lastCloudY))
        }
    }

    draw(properties, cameraPosition) {


        this.clouds.forEach(cloud => {

            const transform = cloud.getTransform(vec2.fromValues(cameraPosition[0], cameraPosition[1]), true)
            const propertiesBackground = {
                transform: transform
            }

            properties(propertiesBackground)
        });

    }

}