var spotLight, selectedType;
var container;
var zoommax = 50000, zoommin= 1000, tileamount =33, tilesize = 16, tilegap = 5, tileheight = 16, zlook=-2000;
var half=(tileamount*(tilesize+tilegap))/2;
var midx, midy, midlookx, midlooky;
var camera, scene, renderer, midbtn=false, ctrl=false;
var projector, plane, cube;
var mouse2D, ray, isMouseDown = false, isMouseDownAndMoving = false, adjmats;
var rollOverMesh, rollOverMaterial, lookat = new THREE.Vector3(half,half,zlook);
var cubeGeo, cubeMats;
var i, intersector, plane;
var textures = {}, va = [.5,1,1.5,2], lifeForms = new Array(), objects={}, sprite,group,  objGroup, materials = [];
var sphere, sunLight, sunPoint, system={};
//System Example
//{star:{}, planets:[{planet:PLANET,moons:[moon:MOON]},{{planet:PLANET,moons:[moon:MOON]}}]}
var debug = false, incr = 2;
var rotation = 0;
var lookAtObject;

function begin(){
	init();
	animate();
}

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,.1,zoommax*5);
	//camera = new THREE.OrthographicCamera( -window.innerWidth*10, window.innerWidth*10, -window.innerHeight*10, window.innerHeight*10, .1, zoommax*5 );

	camera.position.z = zoommax/2;				

	scene = new THREE.Scene();
	
	buildSystem();
	tempLight();
	projector = new THREE.Projector();
	mouse2D = new THREE.Vector3(0, 10000, 0.5);
	
	renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: false});
	//renderer.shadowMapEnabled = true;
    //renderer.shadowMapSoft = false;
    //renderer.shadowMapCullFrontFaces = true;
    renderer.setClearColor(0x000000, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);
	bindKeys();
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(){
		camera.aspect = window.innerWidth/window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
}

function getRealIntersector(intersects){
	for( i = 0; i < intersects.length; i++ ) {
		intersector = intersects[i];
		console.log(intersector);
		return intersector;
	}
	return null;
}

function animate(){
	requestAnimationFrame(animate);
	render();
}

function render(){
    system.update();
	ray = projector.pickingRay(mouse2D.clone(), camera);
	renderer.render(scene, camera);
}

var tmpLgt;
function tempLight(){
	tmpLgt = new THREE.PointLight(0xFFFFFF);
	tmpLgt.position.z = 10000;
	scene.add(tmpLgt);
}

function inc(){
	incr+=.5;
}