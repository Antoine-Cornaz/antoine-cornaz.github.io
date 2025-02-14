

const squareVert = [
    [-1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
]

const triangleVert = [
    [0, -1],
    [-1, 1],
    [1, 1],
]

const c = 200; // Max size of background frame
const h = 16;
const w = 9;
const frameVert = [
    [-c, -c],
    [-w, c],
    [-w, -c],
    [-c, -c],
    [-w, c],
    [-c, c],

    [c, -c],
    [w, c],
    [w, -c],
    [c, -c],
    [w, c],
    [c, c],

    [-c, c],
    [c, h],
    [-c, h],
    [-c, c],
    [c, h],
    [c, c],

    [-c, -c],
    [c, -h],
    [-c, -h],
    [-c, -c],
    [c, -h],
    [c, -c],
]


export function createDrawSquare(regl, shaders, texture){
    return createDrawTexture(regl, texture, squareVert, shaders["texture.vert.glsl"], shaders["texture.frag.glsl"], 6)
}

export function createDrawTriangle(regl, shaders, texture){
    return createDrawTexture(regl, texture, triangleVert, shaders["texture.vert.glsl"], shaders["texture.frag.glsl"], 3)
}

export function createDrawFrame(regl, shaders){
    return createDrawColor(regl, frameVert, shaders["basic.vert.glsl"], shaders["basic.frag.glsl"], 24)
}

function createDrawTexture(regl, texture, position, vert, frag, count){
    return {
        vert: vert, // Vertex shader
        frag: frag, // Fragment shader
        attributes: {
            // Define the enemy's shape (rectangle composed of two triangles)
            position: position,
        },
        uniforms: {
            // Uniform variables for color and transformation matrix
            color: regl.prop("color"),
            transform: regl.prop("transform"),
            texture: texture
        },
        count: count, // Number of vertices
    }
}

function createDrawColor(regl, position, vert, frag, count){
    return {
        vert: vert, // Vertex shader
        frag: frag, // Fragment shader
        attributes: {
            // Define the enemy's shape (rectangle composed of two triangles)
            position: position,
        },
        uniforms: {
            // Uniform variables for color and transformation matrix
            color: regl.prop("color"),
            transform: regl.prop("transform")
        },
        count: count, // Number of vertices
    }
}