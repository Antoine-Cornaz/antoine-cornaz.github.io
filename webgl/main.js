import { createREGL } from "../lib/regl.js"
import { colors } from "./colors.js";

import {DOM_loaded_promise, load_text, register_keyboard_action} from "../icg/icg_web.js"
import {icg_mesh_load_obj} from "../icg/icg_mesh.js"
import {deg_to_rad, mat4_to_string, vec_to_string, mat4_matmul_many} from "../icg/icg_math.js"
import { mesh_preprocess } from "../icg/normal_computation.js"


async function load_resources(regl) {


    // Start downloads in parallel
    const resource_promises = {}

    const shaders_to_load = []
    for(const shader_name of shaders_to_load) {
        resource_promises[shader_name] = load_text(`./src/${shader_name}`)
    }

    const meshes_to_load = [
        "cube.obj",
    ]
    for(const mesh_name of meshes_to_load) {
        resource_promises[mesh_name] = icg_mesh_load_obj(`./objects/${mesh_name}`)
    }

    // Wait for all downloads to complete
    const resources = {}
    for (const [key, promise] of Object.entries(resource_promises)) {
        resources[key] = await promise
    }

    // Compute normals for meshes
    for(const mesh_name of meshes_to_load) {
        resources[mesh_name] = mesh_preprocess(regl, resources[mesh_name])
    }

    return resources
}


main();

async function main() {


    const regl = createREGL({})

    const resources = await load_resources(regl)
    console.log(resources)


    // Set clear color to sky, fully opaque
    const skyColor = colors.sky.concat(1.0);
    regl.frame((frame) => {
        regl.clear({
            color: [...skyColor],
        });
    });
}
