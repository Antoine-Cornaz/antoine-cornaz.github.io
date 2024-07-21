import { createREGL } from "../lib/regl.js"
import { colors } from "./colors.js";

import {DOM_loaded_promise, load_text, register_keyboard_action} from "../icg/icg_web.js"
import {icg_mesh_load_obj} from "../icg/icg_mesh.js"
import {deg_to_rad, mat4_to_string, vec_to_string, mat4_matmul_many} from "../icg/icg_math.js"
import { mesh_preprocess } from "../icg/normal_computation.js"
import {mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import {lookAt} from "../lib/gl-matrix/mat4.js";



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
    const i = mat4.create();

    const drawCube = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(0.3, 0.6, 0, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            //[0.5, -0.5], [-0.8, -0.9], [0, 0.5]
            position: resources['cube.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: resources['cube.obj'].faces

    })


    const drawTriangle = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(1, 0, 0, 1);
              }`,

        vert: `
              attribute vec2 position;
              void main() {
                gl_Position = vec4(position, 0, 1);
              }`,

        attributes: {
            position: [[0.5, -0.5], [-0.5, -0.5], [0, 0.5]]
        },

        count: 3
    })



    // Set clear color to sky, fully opaque
    const skyColor = colors.sky.concat(1.0);




    regl.frame((frame) => {

        const x = Math.cos(frame.time/100)
        const y = Math.sin(frame.time/100)

        const eye = vec3.fromValues(0.8, 1.5, 1.2)
        const center = vec3.fromValues(0, 0, 0)
        const up = vec3.fromValues(0, 0.0,0.8)



        const look = mat4.lookAt(
            mat4.create(),
            eye,
            center,
            up
        )

        let a = mat4.fromScaling(mat4.create(), vec3.fromValues(0.3,0.5,0.5))
        mat4.rotateX(a, a, 1)
        mat4.rotateY(a, a, frame.time)
        const cube_meshes_props = []
        cube_meshes_props.push({
            u_mat_mvp: a
        })

        regl.clear({
            color: [...skyColor],
        });


        drawTriangle()
        drawCube(cube_meshes_props)
    });
}
