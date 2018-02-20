WarpShader = {

	uniforms: {

		"tDiffuse": null,
		"warp":  {value: 0},
		"aspect": new THREE.Uniform({value: 1}),
		"rotation":  {value: 0},

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float warp;",
		"uniform float rotation;",
		"uniform sampler2D tDiffuse;",
		"uniform float aspect;",

		"varying vec2 vUv;",

		"void main() {",
			"vec2 c = vUv - 0.5;",
			"float l = length(c);",
			"mat2 rot = mat2(cos(warp*l+rotation),-sin(warp*l+rotation),sin(warp*l+rotation),cos(warp*l+rotation));",
			"vec2 uv = clamp(0.5 + rot * c, vec2(0,0), vec2(1,1));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};