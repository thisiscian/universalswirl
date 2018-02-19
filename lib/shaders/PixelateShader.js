PixelateShader = {

	uniforms: {

		"tDiffuse": null,
		"pixelSize":  new THREE.Uniform({value: 0.01}),
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

		"uniform float pixelSize;",
		"uniform float aspect;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",


		"void main() {",
			"vec2 uv = clamp(vUv - mod(vUv, pixelSize * vec2(1.0/aspect,1.0)) + pixelSize * 0.5,vec2(0.0,0.0),vec2(1.0,1.0));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};