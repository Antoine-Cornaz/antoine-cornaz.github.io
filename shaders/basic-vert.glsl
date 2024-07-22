attribute vec3 position;
uniform mat4 u_mat_mvp;
uniform vec4 u_color;

varying vec4 v2f_color;

void main() {
    v2f_color = u_color;
    vec4 pos = u_mat_mvp * vec4(position, 1.0);
    gl_Position = pos;
}