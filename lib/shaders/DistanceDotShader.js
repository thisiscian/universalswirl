DistanceDotShader = {

	uniforms: {

		"tDiffuse": null,
		"Warp":  {value: 0},

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

		"varying vec2 vUv;",

		"void main() {",
			"vec2 uv = clamp(vUv + 0.5 * sin(Warp * (vUv - 0.5)), vec2(0,0), vec2(1,1));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};