import * as vec3 from "../lib/gl-matrix/vec3.js"

function get_vert(mesh, vert_id) {
	const offset = vert_id*3
	return mesh.vertex_positions.slice(offset, offset+3)
}

function compute_triangle_normals_and_angle_weights(mesh) {
	const num_faces     = (mesh.faces.length / 3) | 0
	const tri_normals   = []
	const angle_weights = []
	for(let i_face = 0; i_face < num_faces; i_face++) {
		const vert1 = get_vert(mesh, mesh.faces[3*i_face + 0])
		const vert2 = get_vert(mesh, mesh.faces[3*i_face + 1])
		const vert3 = get_vert(mesh, mesh.faces[3*i_face + 2])

		// Modify the way triangle normals and angle_weights are computed
        const v12 = vec3.sub(vec3.create(), vert2, vert1)
        const v13 = vec3.sub(vec3.create(), vert3, vert1)
        const v23 = vec3.sub(vec3.create(), vert3, vert2)
        const normal = vec3.cross(vec3.create(), v12, v13)
        vec3.normalize(normal, normal)
		tri_normals.push(normal)

        const angle1 = Math.abs(vec3.angle(v12,
                                           v13))
        const angle2 = Math.abs(vec3.angle(vec3.negate(v12, v12),
                                           v23))
        const angle3 = Math.abs(vec3.angle(vec3.negate(v23, v23),
                                           vec3.negate(v13, v13)))
        const angle_all = angle1 + angle2 + angle3
        const w1 = angle1 / angle_all
        const w2 = angle2 / angle_all
        const w3 = angle3 / angle_all
		angle_weights.push([w1, w2, w3])
	}
	return [tri_normals, angle_weights]
}

function compute_vertex_normals(mesh, tri_normals, angle_weights) {
	const num_faces    = (mesh.faces.length / 3) | 0
	const num_vertices = (mesh.vertex_positions.length / 3) | 0
	const vertex_normals = Array.from({length: num_vertices}, () => [0., 0., 0.]) // fill with 0 vectors

    // for each triangle, add contribution to vertex normal for each
    // of its vertices
	for(let i_face = 0; i_face < num_faces; i_face++) {
        // iv1, iv2, iv3 are indices into vertex_normals (idk man)
		const iv1 = mesh.faces[3*i_face + 0]
		const iv2 = mesh.faces[3*i_face + 1]
		const iv3 = mesh.faces[3*i_face + 2]
		const normal = tri_normals[i_face]
        const w1 = angle_weights[i_face][0]
        const w2 = angle_weights[i_face][1]
        const w3 = angle_weights[i_face][2]
        vec3.add(vertex_normals[iv1], vertex_normals[iv1], vec3.scale(vec3.create(), normal, w1))
        vec3.add(vertex_normals[iv2], vertex_normals[iv2], vec3.scale(vec3.create(), normal, w2))
        vec3.add(vertex_normals[iv3], vertex_normals[iv3], vec3.scale(vec3.create(), normal, w3))
	}

    // normalize all vertex normals
	for(let i_vertex = 0; i_vertex < num_vertices; i_vertex++) {
        vec3.normalize(vertex_normals[i_vertex], vertex_normals[i_vertex])
	}

	return vertex_normals
}

export function mesh_preprocess(regl, mesh) {
	const [tri_normals, angle_weights] = compute_triangle_normals_and_angle_weights(mesh)

	const vertex_normals = compute_vertex_normals(mesh, tri_normals, angle_weights)

	mesh.vertex_positions = regl.buffer({data: mesh.vertex_positions, type: 'float32'})
	mesh.vertex_normals = regl.buffer({data: vertex_normals, type: 'float32'})
	mesh.faces = regl.elements({data: mesh.faces, type: 'uint16'})

	return mesh
}
