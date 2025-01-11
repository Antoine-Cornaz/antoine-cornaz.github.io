precision mediump float;
attribute vec2 position;
uniform mat3 transform;
varying vec2 uv;

void main() {
    // Apply the transform to the vertex position
    vec3 pos = transform * vec3(position, 1.0);

    // Normalize the vertex position to clip space
    gl_Position = vec4(pos.xy, 0.0, 1.0);

    // Adjust UV coordinates based on texture size
    uv = vec2((position.x /2.0) + 0.5, (-position.y /2.0) + 0.5);
}
