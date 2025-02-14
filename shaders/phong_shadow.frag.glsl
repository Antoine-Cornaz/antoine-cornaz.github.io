precision highp float;

varying vec3 v2f_frag_pos;
varying vec3 v2f_normal;

uniform vec3 light_position; // light position in camera coordinates
uniform vec3 light_color;


uniform vec4 u_color;

void main() {
    float material_ambient = 0.6;
    float material_shininess = 100.;
    vec3 material_color = u_color.xyz;

    vec3 l_minus_p = light_position - v2f_frag_pos;
    float d = length(l_minus_p); // distance to light

    // Change the factor to modifie the intensity of the light.
    float attenuation_factor = 70000. / (d * d);

    vec3 n = normalize(v2f_normal);
    vec3 l = normalize(l_minus_p);
    vec3 v = -normalize(v2f_frag_pos); // in camera space
    vec3 h = normalize(l + v);
    float nl = max(dot(n, l), 0.);
    float nh = max(dot(n, h), 0.);
    float diff = nl;
    // ceil(nl) is 1 if nl > 0, 0 otherwise, therefore has the effect of
    // setting `spec` to 0 if nl <= 0
    float spec = ceil(nl) * pow(nh, material_shininess);

    // ambient contribution
    vec3 color = light_color * material_color * material_ambient;

    // add diff and spec contributions
    color += light_color * material_color
        * attenuation_factor * (diff + spec);


    gl_FragColor = vec4(color, 1.);
}
