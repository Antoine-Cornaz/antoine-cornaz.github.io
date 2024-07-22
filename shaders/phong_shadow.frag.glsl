precision highp float;

varying vec3 v3f_frag_pos;
varying vec3 v3f_normal;
varying vec2 v2f_uv;

uniform vec3 light_position; // light position in camera coordinates
uniform vec3 light_color;
uniform samplerCube cube_shadowmap;
uniform sampler2D tex_color;

void main() {
    float material_ambient = 0.0;
    float material_shininess = 12.;
    vec3 material_color = vec3(texture2D(tex_color, v2f_uv));

    vec3 l_minus_p = light_position - v3f_frag_pos;
    float d = length(l_minus_p); // distance to light
    float attenuation_factor = 1. / (d * d);

    vec3 n = normalize(v3f_normal);
    vec3 l = normalize(l_minus_p);
    vec3 v = -normalize(v3f_frag_pos); // in camera space
    vec3 h = normalize(l + v);
    float nl = max(dot(n, l), 0.);
    float nh = max(dot(n, h), 0.);
    float diff = nl;
    // ceil(nl) is 1 if nl > 0, 0 otherwise, therefore has the effect of
    // setting `spec` to 0 if nl <= 0
    float spec = ceil(nl) * pow(nh, material_shininess);

    // ambient contribution
    vec3 color = light_color * material_color * material_ambient
    * attenuation_factor;

    if (d < textureCube(cube_shadowmap, -l_minus_p).x * 1.01) {
        // not in shadow, add diff and spec contributions
        color += light_color * material_color
        * attenuation_factor * (diff + spec);
    }

    gl_FragColor = vec4(color, 1.);
}
