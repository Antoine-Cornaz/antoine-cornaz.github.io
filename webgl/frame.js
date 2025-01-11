

export class Frame{


    static createDraw(regl, shaders){

        const c = 20; // Max size of background frame
    
    
        return {
            vert: shaders["basic.vert.glsl"], // Vertex shader
            frag: shaders["basic.frag.glsl"], // Fragment shader
            attributes: {
                // Define the enemy's shape (rectangle composed of two triangles)
                position: [
                    [-c, -c],
                    [-1, c],
                    [-1, -c],
                    [-c, -c],
                    [-1, c],
                    [-c, c],
    
                    [c, -c],
                    [1, c],
                    [1, -c],
                    [c, -c],
                    [1, c],
                    [c, c],
    
                    [-c, c],
                    [c, 1],
                    [-c, 1],
                    [-c, c],
                    [c, 1],
                    [c, c],
    
                    [-c, -c],
                    [c, -1],
                    [-c, -1],
                    [-c, -c],
                    [c, -1],
                    [c, -c],
                ],
            },
            uniforms: {
                // Uniform variables for color and transformation matrix
                color: regl.prop("color"),
                transform: regl.prop("transform"),
            },
            count: 24, // Number of vertices
        }
    }
}