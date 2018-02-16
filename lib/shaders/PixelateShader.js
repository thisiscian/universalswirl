PixelateShader = {

	uniforms: {

		"tDiffuse": null,
		"PixelSize":  new THREE.Uniform(new THREE.Vector2()),
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec2 PixelSize;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",
			
			"vec2 uv = clamp(vUv - mod(vUv, PixelSize) - PixelSize * 0.5,vec2(0.0,0.0),vec2(1.0,1.0));",
			"gl_FragColor = texture2D( tDiffuse, uv );",

		"}"

	].join( "\n" )

};