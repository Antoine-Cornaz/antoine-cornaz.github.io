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

    const drawSea = regl({
        frag: await shaders["basic.frag.glsl"],
        vert: await shaders["basic.vert.glsl"],

        attributes: {
            vertex_position: objects["sea.obj"].vertex_positions,
            vertex_normal: objects["sea.obj"].vertex_normals
        },

        uniforms: {
            mat_mvp: regl.prop("u_mat_mvp"),
            mat_model_view: regl.prop("mat_model_view"),
            u_mat_mvp: regl.prop("u_mat_mvp"),
            mat_normals_to_view: regl.prop("mat_normals_to_view"),
            u_color: regl.prop("u_color"),
            light_position: regl.prop("light_position"),
            light_color: colors.lightingColor.slice(0, 3)
        },

        elements: objects["sea.obj"].faces

    })

    const frag = await shaders["phong_shadow.frag.glsl"]
    const vert = await shaders["phong_shadow.vert.glsl"]

    Object.keys(objects).forEach(key => {
        const obj = objects[key];
        const draw = regl({
            frag: frag,
            vert: vert,

            attributes: {
                vertex_position: obj.vertex_positions,
                vertex_normal: obj.vertex_normals
            },

            uniforms: {
                mat_mvp: regl.prop("u_mat_mvp"),
                mat_model_view: regl.prop("mat_model_view"),
                u_mat_mvp: regl.prop("u_mat_mvp"),
                mat_normals_to_view: regl.prop("mat_normals_to_view"),
                u_color: regl.prop("u_color"),
                light_position: regl.prop("light_position"),
                light_color: colors.lightingColor.slice(0, 3)
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
    const lightPos = vec4.fromValues(4, 6, 10, 1);

    const mat_translation_boat = mat4.fromTranslation(mat4.create(), vec3.fromValues(-41, -13, -140))

    const mv = mat4.mul(mat4.create(), getView(), model)
    let mat_normals_to_view = mat3.create();
    mat3.invert(mat_normals_to_view,
        mat3.transpose(mat_normals_to_view,
            mat3.fromMat4(mat_normals_to_view,
                mv)))

    const mv_boat = mat4.mul(mat4.create(), mv, mat_translation_boat)
    regl.frame(() => {


        const mvp = mat4.multiplyMultiple(mat4.create(), projection, mv);
        const mvp_boat = mat4.multiplyMultiple(mat4.create(), projection, mv_boat);



        const l = vec4.transformMat4(vec4.create(), lightPos, mv)
        const lightPosFromCamera = vec3.fromValues(l[0], l[1], l[2]);
        console.log("lc", lightPosFromCamera)

        const barrier_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv,
            u_mat_mvp: mvp,
            u_color: colors.barrier,
        }

        const wall_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv,
            u_mat_mvp: mvp,
            u_color: colors.wall,
        }

        const floor_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv,
            u_mat_mvp: mvp,
            u_color: colors.floor
        }

        const sea_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv,
            u_mat_mvp: mvp,
            u_color: colors.sea
        }

        const boat_wood_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat,
            u_mat_mvp: mvp_boat,
            u_color: colors.wood
        }

        const boat_sail_props = {
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat,
            u_mat_mvp: mvp_boat,
            u_color: colors.white
        }

        regl.clear({
            color: [...skyColor],
        });

        listDraw[0](barrier_props)
        listDraw[1](wall_props)
        drawSea(sea_props)
        listDraw[3](floor_props)
        listDraw[4](boat_sail_props)
        listDraw[5](boat_wood_props)
    });
}
