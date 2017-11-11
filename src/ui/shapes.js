//Index of shape
var shapeIndex = 0;

var shapes = {
	translate:".translate([params.x,params.y,params.z])",
	cube: "cube({size: params.size, center: true})",
	sphere: "sphere({r: params.r, center: true})",
	cylinder: "cylinder({r: params.r, h: params.h, center: true})",
	torus: "torus({ ri: params.ri, ro: params.ro,center:true })",
	polyhedron: "polyhedron({points: params.points,triangles: params.triangles})",
	getShape: function(name) {
		var params = paramsCode.keys[name];
		var str = this[name]+this.translate;
		params.forEach(function(p) {
			str = str.replace("params." + p, "params." + p + shapeIndex);
		})
		shapeIndex++;
		return str;
	}
}
var baseCode = ["function main(params) {\n\
	return [",
	"];\n\
    }"
]

var paramsCode = {
	base: ['function getParameterDefinitions() {\n\
  return [',
		'];\n\
	}\n\
	'
	],
	keys: {
		cube: ["size", "x", "y", "z"],
		sphere: ["r", "x", "y", "z"],
		cylinder: ["r", "h", "x", "y", "z"],
		torus: ["ri", "ro", "x", "y", "z"],
		polyhedron: ["points","triangles", "x", "y", "z"],
	},
	cube: [
		"{ name: 'size', caption: 'Size:', type: 'float', initial: 10 }",
		"{ name: 'x', caption: 'X:', type: 'float', initial: 0 }",
		"{ name: 'y', caption: 'Y:', type: 'float', initial: 0 }",
		"{ name: 'z', caption: 'Z:', type: 'float', initial: 0 }"
	],
	sphere: [
		"{ name: 'r', caption: 'R:', type: 'float', initial: 10 }",
		"{ name: 'x', caption: 'X:', type: 'float', initial: 0 }",
		"{ name: 'y', caption: 'Y:', type: 'float', initial: 0 }",
		"{ name: 'z', caption: 'Z:', type: 'float', initial: 0 }"
	],
	cylinder: [
		"{ name: 'r', caption: 'R:', type: 'float', initial: 5 }",
		"{ name: 'h', caption: 'H:', type: 'float', initial: 10 }",
		"{ name: 'x', caption: 'X:', type: 'float', initial: 0 }",
		"{ name: 'y', caption: 'Y:', type: 'float', initial: 0 }",
		"{ name: 'z', caption: 'Z:', type: 'float', initial: 0 }"
	],
	torus: [
		"{ name: 'ri', caption: 'Ri:', type: 'float', initial: 5 }",
		"{ name: 'ro', caption: 'Ro:', type: 'float', initial: 10 }",
		"{ name: 'x', caption: 'X:', type: 'float', initial: 0 }",
		"{ name: 'y', caption: 'Y:', type: 'float', initial: 0 }",
		"{ name: 'z', caption: 'Z:', type: 'float', initial: 0 }"
	],
	polyhedron: [
		"{ name: 'points', caption: 'Points:', type: 'text', initial: '[ [10,10,0],[10,-10,0],[-10,-10,0],[-10,10,0],[0,0,10] ]' }",
		"{ name: 'triangles', caption: 'Triangles:', type: 'text', initial: '[ [0,1,4],[1,2,4],[2,3,4],[3,0,4],[1,0,3],[2,1,3] ]' }",
		"{ name: 'x', caption: 'X:', type: 'float', initial: 0 }",
		"{ name: 'y', caption: 'Y:', type: 'float', initial: 0 }",
		"{ name: 'z', caption: 'Z:', type: 'float', initial: 0 }"
	],
	getShapeParams: function(name) {
		var params = this[name].join(",\n");
		var keys = this.keys[name];
		keys.forEach(function(p) {
			params = params.replace("'" + p + "'", "'" + p + shapeIndex + "'");
		})
		return params;
	}
}
module.exports = {
	shapes,
	baseCode,
	paramsCode
}

//hack string
String.prototype.insert = function(index, string) {
	return this.substr(0, index) + string + this.substr(index);
}