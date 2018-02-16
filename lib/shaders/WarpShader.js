WarpShader = {

	uniforms: {

		"tDiffuse": null,
		"Warp":  {value: 0},
		"aspect": new THREE.Uniform({value: 1}),

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float Warp;",

		"uniform sampler2D tDiffuse;",
		"uniform float aspect;",

		"varying vec2 vUv;",

		"void main() {",
			"vec2 c = vUv - 0.5;",
			"float l = length(c);",
			"mat2 rot = mat2(cos(Warp*l),-sin(Warp*l),sin(Warp*l),cos(Warp*l));",
			"vec2 uv = clamp(0.5 + rot * c * normalize(vec2(aspect,1)), vec2(0,0), vec2(1,1));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};