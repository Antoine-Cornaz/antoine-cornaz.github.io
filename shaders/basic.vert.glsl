precision mediump float;
attribute vec2 position;
uniform mat3 transform;
void main() {

    vec3 pos = transform * vec3(position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
}
