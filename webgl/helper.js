import {load_text} from "../icg/icg_web.js";
import {icg_mesh_load_obj} from "../icg/icg_mesh.js";
import {mesh_preprocess} from "../icg/normal_computation.js";

export async function load_resources(regl) {


    // Start downloads in parallel
    const object = {}
    const shaders = {}

    const shaders_to_load = [
        "basic-vert.glsl", "basic-frag.glsl"
    ]
    for(const shader_name of shaders_to_load) {
        shaders[shader_name] = load_text(`../shaders/${shader_name}`)
    }

    const meshes_to_load = [
        "barrier.obj", "wall.obj", "sea.obj", "floor.obj"
    ]
    for(const mesh_name of meshes_to_load) {
        object[mesh_name] = icg_mesh_load_obj(`./objects/${mesh_name}`)
    }

    // Wait for all downloads to complete
    const resources = {}
    for (const [key, promise] of Object.entries(object)) {
        resources[key] = await promise
    }

    // Compute normals for meshes
    for(const mesh_name of meshes_to_load) {
        resources[mesh_name] = mesh_preprocess(regl, resources[mesh_name])
    }

    return [resources, shaders];
}