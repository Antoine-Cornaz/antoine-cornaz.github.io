import { createREGL } from "../lib/regl.js"
import { colors } from "./colors.js";

import {DOM_loaded_promise, load_text, register_keyboard_action} from "../icg/icg_web.js"
import {icg_mesh_load_obj} from "../icg/icg_mesh.js"
import {deg_to_rad, mat4_to_string, vec_to_string, mat4_matmul_many} from "../icg/icg_math.js"
import { mesh_preprocess } from "../icg/normal_computation.js"
import {mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import {lookAt, perspective} from "../lib/gl-matrix/mat4.js";



async function load_resources(regl) {


    // Start downloads in parallel
    const resource_promises = {}

    const shaders_to_load = []
    for(const shader_name of shaders_to_load) {
        resource_promises[shader_name] = load_text(`./src/${shader_name}`)
    }

    const meshes_to_load = [
        "barrier.obj", "wall.obj", "sea.obj", "floor.obj"
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

function changeViewDirection(x, y){

    console.log('Mouse entered the canvas at:', { x: x, y: y });

    const theta = -(x-0.5)
    const phi = -(y-0.5)

    const eye = vec3.fromValues(50, 0, 0)
    const center = vec3.fromValues(Math.cos(theta)*Math.cos(phi), Math.sin(theta)*Math.cos(phi), Math.sin(phi))
    const up = vec3.fromValues(0, 0,1)


    view = mat4.lookAt(
        mat4.create(),
        eye,
        center,
        up
    )
}

// The view mat4
let view


main();

async function main() {


    const regl = createREGL({})

    const resources = await load_resources(regl)

    changeViewDirection(0.5, 0.5)

    console.log(colors.water)



    const canvas_elem = document.getElementsByTagName('canvas')[0]
    canvas_elem.addEventListener('mousemove', (event) => {
        changeViewDirection(event.clientX / canvas_elem.width, event.clientY / canvas_elem.height)
    });
    canvas_elem.width

    const drawBarrier = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(0.9, 0.96, 0.95, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            position: resources['barrier.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: resources['barrier.obj'].faces

    })

    const drawWall = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(0.8, 0.6, 0.8, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            position: resources['wall.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: resources['wall.obj'].faces

    })

    const drawSea = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(0, 0.41, 0.58, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            position: resources['sea.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: resources['sea.obj'].faces

    })

    const drawFloor = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(0.80, 0.48, 0.17, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            position: resources['floor.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: resources['floor.obj'].faces

    })

    const drawTriangle = regl({
        frag: `
              void main() {
                gl_FragColor = vec4(1, 0, 0, 1);
              }`,

        vert: `
              attribute vec3 position;
              uniform mat4 u_mat_mvp;
              void main() {
                vec4 pos = u_mat_mvp * vec4(position, 1.0);
                gl_Position = pos;
              }`,

        attributes: {
            position: [[1, -0.5, 2], [-0.5, -0.5, 3], [0, 0.5, 0]]
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        count: 3
    })




    // Set clear color to sky, fully opaque
    const skyColor = colors.sky.concat(1.0);

    regl.frame((frame) => {

        const x = Math.cos(frame.time/2)
        const y = Math.sin(frame.time/2)


        const model = mat4.multiplyMultiple(mat4.create(),

            // The axe in blender are not the same as here.
            mat4.fromXRotation(mat4.create(), Math.PI/2),

            mat4.fromYRotation(mat4.create(), frame.time/5),
            mat4.fromTranslation(mat4.create(), vec3.fromValues(3, 0, 0))
        )

        const projection = perspective(
            mat4.create(),
            Math.PI/2.0,
            1,
            0.1,
            100
        )

        const mv = mat4.mul(mat4.create(), view, model);
        const mvp = mat4.mul(mat4.create(), projection, mv);
        const cube_meshes_props = []
        cube_meshes_props.push({
            u_mat_mvp: mvp
        })

        const triangle_meshes_props = []
        triangle_meshes_props.push({
            u_mat_mvp: mvp
        })

        regl.clear({
            color: [...skyColor],
        });


        drawTriangle(triangle_meshes_props)
        drawBarrier(cube_meshes_props)
        drawWall(cube_meshes_props)
        drawSea(cube_meshes_props)
        drawFloor(cube_meshes_props)
    });
}
