//http://www.html5rocks.com/en/tutorials/webgl/shaders/
//http://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
//http://www.physics.sfasu.edu/astro/ebstar/ebstar.html
//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js

//*****CHECK THIS******
//view-source:http://whiteflashwhitehit.com/content/2011/02/moon_webgl.html
//http://stackoverflow.com/questions/14084165/making-particles-twinkle-with-a-custom-shader

var bools = [true, false]

//Asteroid Belt variables
var numBelts = 25, beltWidthMin = 3333, beltInc = 750 + (Math.random()*750), astMaxSize=125, astMinSize = 50, 
minPerBelt = 25, maxPerBelt = 250, astColor = 0xD49528, beltMaxWidth = (beltInc*numBelts)+beltWidthMin, largeAstMinSize = astMaxSize*2,
largeAstMaxSize = astMaxSize * 4, numLargeAst = 9 + Math.random() * 9;

function buildSystem(){
	system.name = systemName;
	window.document.title = systemName;
	system.binary = Math.floor(Math.random()*bools.length);
	system.suns = [];

	if(system.binary){
		//TODO: do in a loop!
		system.suns[0]= {};
		var radius1 = 3333+Math.random()*9999;
		system.suns[0].radius = radius1;
		system.suns[0].object = buildBinarySun(radius1);
		system.suns[0].object.rotation.x = Math.random()*Math.PI;
		system.suns[0].object.rotation.y = Math.random()*Math.PI;
		system.suns[0].object.rotation.z = Math.random()*Math.PI;
		system.suns[0].offset = 500 + (Math.random()*(radius1*2));
		var radius2 = (radius1) -  Math.random()*(radius1/3);
		system.suns[1]= {};
		system.suns[1].radius = radius2;
		system.suns[1].object = buildBinarySun(radius2);
	    system.suns[1].object.rotation.x = Math.random()*Math.PI;
		system.suns[1].object.rotation.y = Math.random()*Math.PI;
		system.suns[1].object.rotation.z = Math.random()*Math.PI;
		system.suns[1].offset = -(system.suns[0].offset+(radius2+Math.random()*radius2));
		sRad = -(system.suns[1].offset)*2;
	}else{
		system.suns[0] = {};
		system.suns[0].radius = sRad = 5000+Math.random()*10000;
		system.suns[0].object = buildSun(sRad);
	    system.suns[0].offset = 0;
		system.suns[0].object.rotation.x = Math.random()*Math.PI;
		system.suns[0].object.rotation.y = Math.random()*Math.PI;
		system.suns[0].object.rotation.z = Math.random()*Math.PI;

		sRad = sRad*2 + Math.random()*sRad;
	}
	
	system.starfields = starField();
	system.planets = [];
	system.asteroids = {};
	system.update = updateSystem;
	
	var numPlanets = 1 + Math.floor(Math.random()*5);
	var af = 1+Math.floor(Math.random()*(numPlanets-1));
	var asDist = 0;
	for(var p = 0; p < numPlanets; p++){
		system.planets[p] = {};
		system.planets[p].planet = {};
		system.planets[p].planet.radius = pRad = 250+Math.floor(Math.random()*750);
		
		if(p==0){
			system.planets[p].planet.distance = pDis = sRad * 2;
		}else if(p==af){
			system.planets[p].planet.distance = pDis = system.planets[p-1].planet.distance + (45000+Math.floor(Math.random()*30000));
			asDist = system.planets[p-1].planet.distance + (system.planets[p].planet.distance-system.planets[p-1].planet.distance)/2;
			system.asteroids = buildAsteroids(asDist);
		}else{
			system.planets[p].planet.distance = pDis = system.planets[p-1].planet.distance + (15000+Math.floor(Math.random()*25000));
		}
		
		system.planets[p].planet.rotation = pDis/1500;//(pRad)/25;
		system.planets[p].planet.angle = angle = Math.random()*Math.PI*2;
		system.planets[p].planet.object = buildPlanet(pRad, pDis);
		system.planets[p].planet.spin = {x:Math.floor(Math.random()*10)/1000,y:Math.floor(Math.random()*10)/1000,z:Math.floor(Math.random()*10)/1000};
		system.planets[p].planet.moons = [];
		
		var numMoons = Math.floor(Math.random()*5);
		for(var m = 0; m < numMoons; m++){
			system.planets[p].planet.moons[m] = {};
			system.planets[p].planet.moons[m].moon = {};
			system.planets[p].planet.moons[m].moon.radius = mRad = pRad/40 + Math.random()*pRad/10;
			system.planets[p].planet.moons[m].moon.orbit = 5 + Math.random()*15;
			
			if(m==0){
				system.planets[p].planet.moons[m].moon.distance = mDis = pRad * (1.5 + Math.random());
			}else{
				system.planets[p].planet.moons[m].moon.distance = mDis = system.planets[p].planet.moons[m-1].moon.distance 
					+ (system.planets[p].planet.moons[m-1].moon.radius*(3+Math.random()*5))
					+ (system.planets[p].planet.moons[m].moon.radius*(3+Math.random()*5));
			}

			system.planets[p].planet.moons[m].moon.rotation = mDis/333;
			system.planets[p].planet.moons[m].moon.object = buildMoon(mRad,mDis,system.planets[p].planet.object);
			system.planets[p].planet.moons[m].moon.path = buildPath(system.planets[p].planet,system.planets[p].planet.moons[m].moon)
		}
	}
	
	displayName();
	console.log("Solar System Created:");
	console.log(system);
}
function buildMoon(radius, dist, object, orbit){
	var material = new THREE.ShaderMaterial( {
			uniforms: { 
				offset : { type: "f", value: Math.random()*20.0 },
				lVecs : { type: "v3v", value: [] },
				myColor: {  type: "c", value: new THREE.Color(0x9C9C9C) }
			},
		   vertexShader: document.getElementById('vertexShader_planet').textContent,
		   fragmentShader: document.getElementById('fragmentShader_planet').textContent
	});
	var moonGeo = new THREE.SphereGeometry(radius, 100, 100);
	moon = new THREE.Mesh(moonGeo, material);
	var points = randomSpherePoint(object.position.x,object.position.y,0,dist);
	moon.position.x = points[0];
	moon.position.y = points[1];
	scene.add(moon);
	return moon;

}

function buildPath(planet, moon){
	var resolution = 500;
	var amplitude = moon.distance;
	var size = 1000 / resolution;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x454D05} );
	for(var i = 0; i <= resolution; i++) {
	    var segment = ( i * size ) * Math.PI / 180;
		    geometry.vertices.push(new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude));         
	}
	var line = new THREE.Line( geometry, material );
	line.rotation.x=Math.PI/2;
	planet.object.add(line);
	return line;
}

function buildSun(radius){
	var material = new THREE.ShaderMaterial( {
		uniforms: { 
			time: {
				type: "f", 
				value: 0.0 
			},
			myColor: {  type: "c", value: new THREE.Color(Math.random() * 0xffffff) }
		},
		   vertexShader: document.getElementById('vertexShader').textContent,
		   fragmentShader: document.getElementById('fragmentShader').textContent
	});
	var sunColor = rgbToHex(Math.floor(Math.random()*300), Math.floor(Math.random()*300), Math.floor(Math.random()*300));
	var sunGeo = new THREE.SphereGeometry(radius,150,150);
	var sunGeoGlow = new THREE.SphereGeometry(radius+1200,150,150);
	var sun = new THREE.Mesh(sunGeo, material);
	scene.add(sun);
	lookAtObject = sun.position;
	return sun;
}



function buildBinarySun(radius){
	var material = new THREE.ShaderMaterial( {
		uniforms: { 
			time: { 
				type: "f", 
				value: 0.0 
			},
			myColor: {  type: "c", value: new THREE.Color(Math.random() * 0xffffff) }
		},
		   vertexShader: document.getElementById('vertexShader').textContent,
		   fragmentShader: document.getElementById('fragmentShader').textContent
	});
	var sunGeo = new THREE.SphereGeometry(radius,150,150);
	var sunGeoOuter = new THREE.SphereGeometry(radius+(radius/5),50,20);
	var sunColor = rgbToHex(Math.floor(Math.random()*300), Math.floor(Math.random()*300), Math.floor(Math.random()*300));
	var sun = new THREE.Mesh(sunGeo, material);
	scene.add(sun);
	lookAtObject = new THREE.Vector3(0,0,0);
	return sun;
}

function buildPlanet(radius,dist,angle){
	var pGeo = new THREE.SphereGeometry(radius,150,150);
	var planetColor = rgbToHex(Math.floor(Math.random()*300), Math.floor(Math.random()*300), Math.floor(Math.random()*300));
	
	//TODO: MOVE LINE TO OWN METHOD or CURRENT LINE METHOD
	var resolution = 1000;
	var amplitude = dist;
	var size = 1000 / resolution;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x454D05} );
	for(var i = 0; i <= resolution; i++) {
	    var segment = ( i * size ) * Math.PI / 180;
		geometry.vertices.push(new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) );         
	}
	var line = new THREE.Line( geometry, material );
	line.rotation.x=Math.PI/2;
	scene.add(line);
	
		var material = new THREE.ShaderMaterial( {
		uniforms: { 
			offset : { type: "f", value: Math.random()*15.0 },
		    lVecs : { type: "v3v", value:[]},
			myColor: {  type: "c", value: new THREE.Color(Math.random() * 0xffffff) }
		},
		   vertexShader: document.getElementById('vertexShader_planet').textContent,
		   fragmentShader: document.getElementById('fragmentShader_planet').textContent
	});

	var planet = new THREE.Mesh(pGeo, material);
	planet.position.x = Math.sin(angle)* dist;
	planet.position.y = Math.cos(angle)* dist;
	planet.receiveShadow = true;
	
	scene.add(planet)
	return planet;
}

function buildAsteroids(dist){
	var asteroidMat = new THREE.MeshLambertMaterial({color:astColor});

	var asteroids = [];
	for(var ast = 0; ast < numBelts; ast++){
		asteroids[ast] = {}
		var geo = new THREE.Geometry();
		var numAsteroids = minPerBelt + Math.floor(Math.random()* maxPerBelt)
		for(var a = 0; a< numAsteroids; a++){
			if(a==0){
				var asteroidGeo = new THREE.SphereGeometry(largeAstMinSize+Math.random()*largeAstMaxSize,3,3);
			}else{
				var asteroidGeo = new THREE.SphereGeometry(astMinSize+Math.random()*astMaxSize,1+Math.random()*3,1+Math.random()*3);
			}
			var asteroidMesh = new THREE.Mesh(asteroidGeo,asteroidMat);
			var angle = Math.random()*Math.PI*2;
			var beltWidth = beltWidthMin + Math.floor(Math.random()*(ast*beltInc));
			asteroids[ast].rotation = (Math.random()*5)/(3333+Math.random()*3333);
			asteroids[ast].ypos = -(beltWidth/2)+(Math.cos(angle)* dist + Math.random()*beltWidth);
			asteroids[ast].xpos = -(beltWidth/2)+(Math.sin(angle)* dist + Math.random()*beltWidth);
			asteroids[ast].zpos = -150 + (Math.random()*300)
			asteroidMesh.position.y = asteroids[ast].ypos
			asteroidMesh.position.x = asteroids[ast].xpos
			asteroidMesh.position.z = asteroids[ast].zpos
			THREE.GeometryUtils.merge(geo, asteroidMesh);
		}
		var geoMesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial([asteroidMat]));
		scene.add(geoMesh);
		asteroids[ast].object = geoMesh;
	}
	return asteroids;
}

function starField(){
	var star_systems = []
	var stars1 = new THREE.Geometry();
    for (var i=0; i<3333; i++) {
	  var points = randomSpherePoint(0,0,0,zoommax*3)
      stars1.vertices.push(new THREE.Vector3(
        points[0],
        points[1],
        points[2]
      ));
    }
    var star_stuff = new THREE.ParticleBasicMaterial();
    var star_system1 = new THREE.ParticleSystem(stars1, star_stuff);
    scene.add(star_system1);
	star_systems.push(star_system1);
	
	var stars2 = new THREE.Geometry();
    for (var i=0; i<3333; i++) {
	  var points = randomSpherePoint(0,0,0,zoommax*3.3)
      stars2.vertices.push(new THREE.Vector3(
        points[0],
        points[1],
        points[2]
      ));
    }
    var star_stuff = new THREE.ParticleBasicMaterial();
    var star_system2 = new THREE.ParticleSystem(stars2, star_stuff);
    scene.add(star_system2);	
	star_systems.push(star_system2);

	return star_systems;
}

function lookAwayFrom(me, target) {
    var v = new THREE.Vector3();
    v.subVectors(me.position, target.position).add(me.position);
    me.lookAt(v);
}

function randomSpherePoint(x0,y0,z0,radius){
   var u = Math.random();
   var v = Math.random();
   var theta = 2 * Math.PI * u;
   var phi = Math.acos(2 * v - 1);
   var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
   var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
   var z = z0 + (radius * Math.cos(phi));
   return [x,y,z];
}

function displayName(){
	$("#name").html(systemName);
}

var start = Date.now();
function updateSystem(){

	if(follow){
		camera.position.x = lookAtObject.x;
		camera.position.y = lookAtObject.y;
	}
	
	rotation+=incr;
	system.starfields[0].rotation.z += .00005 
	system.starfields[0].rotation.x += .00006 
	system.starfields[0].rotation.y += .00007 
	system.starfields[1].rotation.z += .00009 
	system.starfields[1].rotation.x += .00000 
	system.starfields[1].rotation.y += .00000 
	
	for(var a in system.asteroids){
		system.asteroids[a].object.rotation.z -= (system.asteroids[a].rotation/2);
	}
	
	for(var s in system.suns){
 			system.suns[s].object.material.uniforms[ 'time' ].value = .000033 * ( Date.now() - start );
			system.suns[s].object.rotation.z += system.suns[s].radius/2000000;
			system.suns[s].object.position.x = (Math.sin(rotation/33 * (Math.PI/360)) * system.suns[s].offset);
			system.suns[s].object.position.y = (Math.cos(rotation/33 * (Math.PI/360)) * system.suns[s].offset);
	}
	
	for(var p in system.planets){
		var planet = system.planets[p].planet;
		var sunLights = [];
		for(var s in system.suns){
			var pl = planet.object.position.clone();
			var sl = system.suns[s].object.position.clone();
			sunLights.push(new THREE.Vector3(-(pl.x-sl.x),-(pl.y-sl.y),0));
		}
		planet.object.material.uniforms['lVecs'].value = sunLights;
		planet.object.position.x = (Math.sin(rotation/planet.rotation * (Math.PI /360)) * planet.distance);
		planet.object.position.y = (Math.cos(rotation/planet.rotation * (Math.PI / 360)) * planet.distance);
		//planet.object.rotation.z += .003;
		for(var m in planet.moons){
			sunLights = [];
			var moon = planet.moons[m].moon;
			for(var s in system.suns){
				var ml = moon.object.position.clone();
				var sl = system.suns[s].object.position.clone();
				var lightVec = new THREE.Vector3(-(ml.x-sl.x),-(ml.y-sl.y),-(ml.z-sl.z));
				sunLights.push(lightVec);
			}		
			moon.object.material.uniforms['lVecs'].value = sunLights;
			moon.object.position.x = planet.object.position.x + (Math.sin(rotation/moon.rotation * (Math.PI/360)) * moon.distance);
			moon.object.position.y = planet.object.position.y +(Math.cos(rotation/moon.rotation * (Math.PI/360)) * moon.distance);
		}
	}
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}