attribute vec3 vertex_position;
uniform mat4 u_mat_mvp;



void main() {
    gl_Position = u_mat_mvp * vec4(vertex_position, 1.0);
}