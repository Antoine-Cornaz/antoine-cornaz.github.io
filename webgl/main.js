import {createREGL} from "../lib/regl.js"
import {colors} from "./colors.js";

import {mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import {lookAt, perspective} from "../lib/gl-matrix/mat4.js";
import {load_resources} from "./helper.js";
import {changeViewDirection, getView} from "./camera.js";


main();

async function main() {


    const regl = createREGL({})

    const resources = await load_resources(regl)
    const objects = resources[0]
    const shaders = resources[1]

    changeViewDirection(0.5, 0.5)

    const canvas_elem = document.getElementsByTagName('canvas')[0]
    canvas_elem.addEventListener('mousemove', (event) => {
        changeViewDirection(event.clientX / canvas_elem.width, event.clientY / canvas_elem.height)
    });
    canvas_elem.width

    //vec4(0.9, 0.96, 0.95, 1);
    const drawBarrier = regl({
        frag: await shaders["basic-frag.glsl"],

        vert: await shaders["basic-vert.glsl"],

        attributes: {
            position: objects['barrier.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
            u_color: regl.prop("u_color")
        },

        elements: objects['barrier.obj'].faces

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
            position: objects['wall.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: objects['wall.obj'].faces

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
            position: objects['sea.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: objects['sea.obj'].faces

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
            position: objects['floor.obj'].vertex_positions,
        },

        uniforms: {
            u_mat_mvp: regl.prop("u_mat_mvp"),
        },

        elements: objects['floor.obj'].faces

    })


    // Set clear color to sky, fully opaque
    const skyColor = colors.sky;

    regl.frame((frame) => {

        const model = mat4.multiplyMultiple(mat4.create(),

            // The axe in blender are not the same as here.
            mat4.fromXRotation(mat4.create(), Math.PI / 2),

            //mat4.fromYRotation(mat4.create(), frame.time/5),
            //mat4.fromTranslation(mat4.create(), vec3.fromValues(3, 0, 0))
        )

        const projection = perspective(
            mat4.create(),
            1.4,
            1,
            0.1,
            500
        )

        const mvp = mat4.multiplyMultiple(mat4.create(), projection, getView(), model);
        const cube_meshes_props = []
        cube_meshes_props.push({
            u_mat_mvp: mvp,
            u_color: vec4.fromValues(0.90, 0.96, 0.95, 1)
        })

        regl.clear({
            color: [...skyColor],
        });

        drawBarrier(cube_meshes_props)
        drawWall(cube_meshes_props)
        drawSea(cube_meshes_props)
        drawFloor(cube_meshes_props)
    });
}
