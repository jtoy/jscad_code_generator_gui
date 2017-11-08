var shapes = {
	cube: "cube({size: 10, center: true})",
	sphere: "sphere({r: 10, center: true})",
	cylinder: "cylinder({r: 1, h: 10, center: true})",
	torus: "torus({ ri: 1.5, ro: 3,center:true })",
	polyhedron: "polyhedron({      // openscad-like (e.g. pyramid)\n\
  points: [ [10,10,0],[10,-10,0],[-10,-10,0],[-10,10,0], // the four points at base\n\
            [0,0,10] ],                                  // the apex point \n\
  triangles: [ [0,1,4],[1,2,4],[2,3,4],[3,0,4],          // each triangle side\n\
               [1,0,3],[2,1,3] ]                         // two triangles for square base\n\
	})"
}
var baseCode = ["function main() {\n\
	return [",
	"];\n\
    }"
]
module.exports = {
	shapes,
	baseCode
}