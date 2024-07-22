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

    const canvas = document.getElementsByTagName('canvas')[0]
    canvas.addEventListener('mousemove', (event) => {
        changeViewDirection(event.clientX / canvas.width, event.clientY / canvas.height)
    });

    const listDraw = []

    const frag = await shaders["basic.frag.glsl"]
    const vert = await shaders["basic.vert.glsl"]

    const drawTest = regl({
        frag: await shaders["phong_shadow.frag.glsl"],

        vert: await shaders["phong_shadow.vert.glsl"],

        attributes: {
            vertex_position: objects["wall.obj"].vertex_positions,
            vertex_normal: objects["wall.obj"].vertex_normals
        },

        uniforms: {
            mat_mvp: regl.prop("u_mat_mvp"),
            mat_model_view: regl.prop("mat_model_view"),
            u_mat_mvp: regl.prop("u_mat_mvp"),
            mat_normals_to_view: mat3.create(),// no weird transformation
            u_color: regl.prop("u_color"),
            light_position: vec3.fromValues(3, 2, 0),
            light_color: colors.white.slice(0, 3)
        },

        elements: objects["wall.obj"].faces

    })

    Object.keys(objects).forEach(key => {
        const obj = objects[key];
        const draw = regl({
            frag: frag,

            vert: vert,

            attributes: {
                a_position: obj.vertex_positions
            },

            uniforms: {
                u_mat_mvp: regl.prop("u_mat_mvp"),
                u_color: regl.prop("u_color")
            },

            elements: obj.faces

        })
        listDraw.push(draw);
    });

    const model = mat4.multiplyMultiple(mat4.create(),
        // The axes in blender are not the same as here.
        mat4.fromXRotation(mat4.create(), Math.PI / 2),
    )

    let projection = perspective(
        mat4.create(),
        1.4,
        canvas.width / canvas.height,
        0.1,
        500
    )

    // Handle window resize to adjust canvas size
    window.addEventListener('resize', () => {
        projection = perspective(
            mat4.create(),
            1.4,
            window.innerWidth/ window.innerHeight,
            0.1,
            500
        )
    });

    // Set clear color to sky, fully opaque
    const skyColor = colors.sky;

    regl.frame(() => {

        const mv = mat4.mul(mat4.create(), getView(), model)
        const mvp = mat4.multiplyMultiple(mat4.create(), projection, mv);

        const barrier_props = {
            u_mat_mvp: mvp,
            u_color: colors.barrier,
        }

        const wall_props = {
            mat_model_view: mv,
            u_mat_mvp: mvp,
            u_color: colors.wall,
        }

        const floor_props = {
            u_mat_mvp: mvp,
            u_color: colors.floor
        }

        const sea_props = {
            u_mat_mvp: mvp,
            u_color: colors.sea
        }

        regl.clear({
            color: [...skyColor],
        });

        listDraw[0](barrier_props)

        listDraw[2](sea_props)
        listDraw[3](floor_props)
        drawTest(wall_props)
    });
}
