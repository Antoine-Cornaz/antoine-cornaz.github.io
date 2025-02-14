precision mediump float;
varying vec2 uv;
uniform sampler2D texture;
void main() {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        discard;
    }
    gl_FragColor = texture2D(texture, uv);
}