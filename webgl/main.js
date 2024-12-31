import {createREGL} from "../lib/regl.js"
import {colors} from "./colors.js";

import {vec2, mat3, mat4, vec3, vec4} from "../lib/gl-matrix/index.js";
import {lookAt, perspective} from "../lib/gl-matrix/mat4.js";
import {load_resources} from "./helper.js";
import {Camera} from "./camera.js";
import {DOM_loaded_promise, register_keyboard_action} from "../icg/icg_web.js";
import {addListener, checkKeyboard} from "./control.js";
import { Player } from "./player.js";
import { Obstacle } from "./obstacle.js";

// Initialize the application when the DOM is loaded
DOM_loaded_promise.then(() => {
    // Create the REGL instance
    const regl = createREGL();

    const player = new Player();

    const canvas = document.getElementsByTagName('canvas')[0]
    addListener(window, canvas, player)

    // Define vertex and fragment shaders
    const vertexShader = `
        precision mediump float;
        attribute vec2 position;
        uniform mat3 transform;
        void main() {
            vec3 pos = transform * vec3(position, 1.0);
            gl_Position = vec4(pos.xy, 0.0, 1.0);
        }
    `;

    const fragmentShader = `
        precision mediump float;
        uniform vec3 color;
        void main() {
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Create the triangle data (player)
    const triangle = [
        [0.0, 0.2],
        [-0.2, -0.2],
        [0.2, -0.2]
    ];

    // Create the square data (obstacles)
    const square = [
        [-0.1, 0.1],
        [-0.1, -0.1],
        [0.1, -0.1],
        [-0.1, 0.1],
        [0.1, -0.1],
        [0.1, 0.1]
    ];

    // Create obstacle positions
    const obstacles = [
        new Obstacle(vec2.fromValues(0.8, -3.0)),
        new Obstacle(vec2.fromValues(-0.2, -4.5)),
        new Obstacle(vec2.fromValues(0.0, -6.0)),
    ];

    // Define a draw command for the triangle (player)
    const drawPlayer = regl({
        vert: vertexShader,
        frag: fragmentShader,
        attributes: {
            position: triangle,
        },
        uniforms: {
            color: regl.prop("color"), // Red color
            transform: regl.prop("transform"),
        },
        count: 3,
    });

    // Define a draw command for the square (obstacles)
    const drawSquare = regl({
        vert: vertexShader,
        frag: fragmentShader,
        attributes: {
            position: square,
        },
        uniforms: {
            color: regl.prop('color'),
            transform: regl.prop('transform'),
        },
        count: 6,
    });


    let old_time = 0
    let stop = false;
    regl.frame((frame) => {
        const now = frame.time
        const diff_time = now - old_time;
        old_time = now;
        if (stop) diff_time = 0;

        // Clear the canvas
        regl.clear({
            color: [...colors.blueSky], // Sky background
        });

        

        // Draw the obstacles (squares)
        obstacles.forEach(obstacle => {

            obstacle.update(diff_time);
            const uniform = {
                color: obstacle.getColor(),
                transform: obstacle.getTransform()
            }

            drawSquare(uniform);

            // Check for collisions
            if(player.checkCollision(obstacle)){
                player.setColors([1.0, 1.0, 0.0]);
                stop = true;
            }

        });

        console.log(player.getColor());

        // Draw the triangle
        const transform = {
            transform: player.getTransform(),
            color: player.getColor(), 
        };
        drawPlayer(transform);
        
    });
});



/*
main();

async function main() {


    const regl = createREGL({})

    const resources = await load_resources(regl)
    const objects = resources[0]
    const shaders = resources[1]

    const camera = new Camera()


    const date = new Date();
    const canvas = document.getElementsByTagName('canvas')[0]




    addListener(window, canvas)
    const listDraw = []

    const drawSea = regl({
        frag: await shaders["phong_shadow.frag.glsl"],
        vert: await shaders["phong_shadow.vert.glsl"],

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
    const skyColor = colors.sky
    const lightPos = vec4.fromValues(4, 400, 2, 1);

    const mat_translation_boat1 = mat4.fromTranslation(mat4.create(), vec3.fromValues(-41, -13, -140))
    const mat_translation_boat2 = mat4.fromTranslation(mat4.create(), vec3.fromValues(-21, -13, -120))


    let old_time = 0
    regl.frame((frame) => {
        const now = frame.time
        const diff_time = now - old_time;
        old_time = now;

        checkKeyboard(diff_time, camera)



        const mv = mat4.mul(mat4.create(), camera.getView(), model)
        let mat_normals_to_view = mat3.create();
        mat3.invert(mat_normals_to_view,
            mat3.transpose(mat_normals_to_view,
                mat3.fromMat4(mat_normals_to_view,
                    mv)))

        const mat_rotation_boat = mat4.fromZRotation(mat4.create(), 0.2*Math.sin(frame.time));
        const mvp = mat4.multiplyMultiple(mat4.create(), projection, mv);

        const mv_boat = mat4.multiplyMultiple(mat4.create(), mv, mat_translation_boat1, mat_rotation_boat);
        const mvp_boat = mat4.multiplyMultiple(mat4.create(), projection, mv_boat);

        const mv_boat2 = mat4.multiplyMultiple(mat4.create(), mv, mat_translation_boat2, mat_rotation_boat);
        const mvp_boat2 = mat4.multiplyMultiple(mat4.create(), projection, mv_boat2);




        const l = vec4.transformMat4(vec4.create(), lightPos, mv)
        const lightPosFromCamera = vec3.fromValues(l[0], l[1], l[2]);


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

        let boat_wood_props = []
        boat_wood_props.push({
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat,
            u_mat_mvp: mvp_boat,
            u_color: colors.wood
        })
        boat_wood_props.push({
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat2,
            u_mat_mvp: mvp_boat2,
            u_color: colors.wood
        })

        const boat_sail_props = []
        boat_sail_props.push({
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat,
            u_mat_mvp: mvp_boat,
            u_color: colors.white
        })


        boat_sail_props.push({
            light_position: lightPosFromCamera,
            mat_normals_to_view: mat_normals_to_view,
            mat_model_view: mv_boat2,
            u_mat_mvp: mvp_boat2,
            u_color: colors.white
        })

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
*/

