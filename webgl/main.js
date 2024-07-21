import { createREGL } from "../lib/regl.js"
import { colors } from "./colors.js";


main();

async function main() {


    const regl = createREGL({})

    // Set clear color to sky, fully opaque
    const skyColor = colors.sky.concat(1.0);
    regl.frame((frame) => {
        regl.clear({
            color: [...skyColor],
        });
    });
}
