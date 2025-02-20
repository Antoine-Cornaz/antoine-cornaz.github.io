import {setMatrixArrayType} from "./common.js"
import {vec3, vec4, mat3, mat4} from "./index.js"

export const deg_to_rad = Math.PI / 180

/*
Converts a vector stored in array of numeric values to a string "[x, y, z]" with constant decimal places
*/
export function vec_to_string(v, decimals) {
	const prec = (decimals !== undefined) ? decimals : 1;
	return '[' + v.map((value) => value.toFixed(prec)).join(', ') + ']';
}

/*
Converts a 4x4 matrix stored in array of 16 numeric values to a string with constant decimal places
*/
export function mat4_to_string(m, decimals) {
	const prec = (decimals !== undefined) ? decimals : 2;
	const indices = [0, 1, 2, 3];

	return '[' + indices.map((r) => 
		indices.map((c) => m[r + 4*c].toFixed(prec)).join(', ')
	).join('\n') +']';
}

export class MyMatrix extends Array {
	constructor(size) {
		super(size);

		this.rank = 4; // by default its mat4

		if(size == 16) {
			this.rank = 4;
			mat4.identity(this);
		} else if (size == 9) {
			this.rank = 3;
			mat3.identity(this);
		}
	}

	get(r, c) {
		return this[r + c*this.rank];
	}
	set(r, c, value) {
		this[r + c*this.rank] = value;
	}

	toString() {
		return mat4_to_string(this);
	}
}
setMatrixArrayType(MyMatrix);

export function mat4_matmul_many(out, ...operands) {
	mat4.identity(out);
	operands.forEach((m) => {
		mat4.multiply(out, out, m);
	})
	return out;
}

// Equivalent to vec4(v, w) in GLSL
export function vec4FromVec3(v, w) {
	return vec4.fromValues(v[0], v[1], v[2], w);
}

// Truncate vec4 to vec3; equivalent to v.xyz in GLSL
export function vec3FromVec4(v) {
	return vec3.fromValues(v[0], v[1], v[2]);
}

export function transform3DPoint(M4, p3) {
	return vec3FromVec4(vec4.transformMat4(vec4.create(), vec4FromVec3(p3, 1.0), M4));
}
