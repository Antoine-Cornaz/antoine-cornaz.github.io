// Vertex attributes, specified in the "attributes" entry of the pipeline
attribute vec3 vertex_position;
attribute vec3 vertex_normal;
attribute vec2 vertex_tex_coords;

// Per-vertex outputs passed on to the fragment shader
varying vec3 v3f_frag_pos;
varying vec3 v3f_normal;
varying vec2 v2f_uv;

// Global variables specified in "uniforms" entry of the pipeline
uniform mat4 mat_mvp;
uniform mat4 mat_model_view;
uniform mat3 mat_normals_to_view;

void main() {
    v2f_uv = vertex_tex_coords;

    v3f_frag_pos = vec3(mat_model_view * vec4(vertex_position, 1.0));
    v3f_normal = normalize(mat_normals_to_view * vertex_normal);

    gl_Position = mat_mvp * vec4(vertex_position, 1);
}
