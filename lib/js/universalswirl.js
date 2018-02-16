var frustumSize = 10, aspect;
var camera, renderer, composer, renderTarget;
var scene, cube, sun;
var renderPass, pixelatePass;
var clock;

var pixelSize = 3;



function animate(t) {
	dt = clock.getDelta();
	requestAnimationFrame(animate);
	cube.rotation.x += dt;
	cube.rotation.y += dt;

	var dv = dt * (1 + Math.sin(2 * Math.PI * clock.elapsedTime / 10.0));
	distanceDotPass.uniforms[ 'Warp' ].value += dv;
	warpPass.uniforms[ 'Warp' ].value += dv;

	renderer.clear();
	composer.render(performance.now() * 0.001);
	//renderer.render(scene,camera); // <- replaced by composer.render();
}

function onWindowResize() {
	aspect = window.innerWidth / window.innerHeight
	camera.aspect = aspect;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//pixelatePass.uniforms["PixelSize"].value.set(aspect * pixelSize/window.innerWidth,aspect * pixelSize/window.innerHeight);
	pixelatePass.uniforms["PixelSize"].value.set(0.01 * pixelSize / aspect,0.01 * pixelSize / aspect);
}

function onMouseMove(ev) {
	pixelSize = 10 * (2*ev.x/window.innerWidth-1 + 2*ev.y/window.innerHeight -1);
	console.log(pixelSize);
	pixelatePass.uniforms["PixelSize"].value.set(pixelSize / aspect, pixelSize / aspect);
}

function onTouchMove(ev) {
	console.log(ev);
	pixelSize = (ev.targetTouches[0].clientX/window.innerWidth + ev.targetTouches[0].clientY/window.innerHeight -1 );
	pixelatePass.uniforms["PixelSize"].value.set(pixelSize / aspect, pixelSize / aspect);
	console.log(pixelSize / aspect, pixelSize / aspect);
}

function play() {
	aspect = window.innerWidth / window.innerHeight;
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera(
		frustumSize * aspect / - 2, 
		frustumSize * aspect / 2, 
		frustumSize / 2, 
		frustumSize / - 2, 
		1, 
		2000 
	);
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'touchmove', onTouchMove, false );

	var geometry = new THREE.BoxGeometry(1,1,1);
	var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	
	var backgroundTexture = new THREE.TextureLoader().load("textures/background.jpg");
	//backgroundTexture.wrapS = THREE.RepeatWrapping;
	//backgroundTexture.wrapT = THREE.RepeatWrapping;
	scene.background = backgroundTexture;
	
	composer = new THREE.EffectComposer(renderer);

	renderPass = new THREE.RenderPass(scene,camera);

	distanceDotPass = new THREE.ShaderPass(DistanceDotShader);
	warpPass = new THREE.ShaderPass(WarpShader);
	warpPass.uniforms["aspect"].value = aspect;

	pixelatePass = new THREE.ShaderPass(PixelateShader);
	var adjustedPixelSize = pixelSize/Math.min(window.innerWidth,window.innerHeight);
	pixelatePass.uniforms["PixelSize"].value.set(aspect * pixelSize/window.innerWidth, aspect * pixelSize/window.innerHeight);
	//pixelatePass.uniforms["MainTexture"].value = composer.readBuffer.texture;
	pixelatePass.renderToScreen = true;

	composer.addPass(renderPass);
	composer.addPass(distanceDotPass);
	composer.addPass(warpPass);
	composer.addPass(pixelatePass);

	var sun = new THREE.DirectionalLight(0xefefef,1.5);
	sun.position.set(1,1,1).normalize();
	scene.add(sun);
	clock = new THREE.Clock();
	animate();
}