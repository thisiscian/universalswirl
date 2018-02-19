DistanceDotShader = {

	uniforms: {

		"tDiffuse": null,
		"warp":   {value: 0.0},
		"aspect": new THREE.Uniform({value: 1.0}),

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
		"uniform float aspect;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",
			"vec2 uv = clamp(vUv + 0.5 * sin(warp * (vUv - 0.5)), vec2(0,0), vec2(1,1));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};