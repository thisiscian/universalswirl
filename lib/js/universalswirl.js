var frustumSize = 10, aspect;
var camera, renderer, composer, renderTarget;
var scene, cube, sun;
var renderPass, pixelatePass;
var clock;

var pixelSize = 0.01;
var mouseDrag = false;


function animate(t) {
	dt = clock.getDelta();
	requestAnimationFrame(animate);
	cube.rotation.x += dt;
	cube.rotation.y += dt;

	var dv = dt * (2 + Math.sin(2 * Math.PI * clock.elapsedTime / 10.0));
	distanceDotPass.uniforms[ "warp" ].value += dv;
	warpPass.uniforms[ "warp" ].value += dv;

	renderer.clear();
	composer.render(performance.now() * 0.001);
	//renderer.render(scene,camera); // <- replaced by composer.render();
}

function onWindowResize() {
	aspect = window.innerWidth / window.innerHeight
	camera.aspect = aspect;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//pixelatePass.uniforms["pixelSize"].value.set(aspect * pixelSize/window.innerWidth,aspect * pixelSize/window.innerHeight);
	pixelatePass.uniforms["pixelSize"].value = pixelSize;
	pixelatePass.uniforms["aspect"].value = aspect;
	distanceDotPass.uniforms["aspect"].value = aspect;
	warpPass.uniforms["aspect"].value = aspect;
}

function onMouseDown() {
	mouseDrag = true;
}
function onMouseUp() {
	mouseDrag = false;
}

function onMouseMove(ev) {
	if(mouseDrag) {
		resizePixels(ev.x,ev.y);
	}
}

function resizePixels(xpos,ypos) {
	var X = 2 * xpos/window.innerWidth - 1;
	var Y = 2 * ypos/window.innerHeight - 1;
	pixelSize = Math.sqrt(X*X+Y*Y)*0.1;
	pixelatePass.uniforms["pixelSize"].value = pixelSize;
}

function onTouchMove(ev) {
	resizePixels(ev.targetTouches[0].clientX,ev.targetTouches[0].clientY);
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
	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'mouseup', onMouseUp, false );
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
	warpPass = new THREE.ShaderPass(WarpShader);
	distanceDotPass = new THREE.ShaderPass(DistanceDotShader);
	pixelatePass = new THREE.ShaderPass(PixelateShader);	
	
	warpPass.uniforms["aspect"].value = aspect;
	distanceDotPass.uniforms["aspect"].value = aspect;
	pixelatePass.uniforms["aspect"].value = aspect;
    pixelatePass.uniforms["pixelSize"].value = pixelSize;

	composer.addPass(renderPass);
	composer.addPass(distanceDotPass);
	composer.addPass(warpPass);
	composer.addPass(pixelatePass);

	var sun = new THREE.DirectionalLight(0xefefef,1.5);
	sun.position.set(1,1,1).normalize();
	scene.add(sun);
	clock = new THREE.Clock();
	composer.passes[composer.passes.length-1].renderToScreen = true;
	animate();
}