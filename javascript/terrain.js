var bools = [true, false]

function buildSystem(){
	system.name = systemName;
	system.binary = Math.floor(Math.random()*bools.length);
	system.suns = [];

	if(system.binary){
		system.suns[0]= {};
		var radius1 = 1000+Math.random()*2000;
		system.suns[0].object = buildBinarySun(radius1);
		system.suns[0].offset = 500 + (Math.random()*(radius1*2));
		var radius2 = (radius1) -  Math.random()*(radius1/3);
		system.suns[1]= {};
		system.suns[1].object = buildBinarySun(radius2);
		system.suns[1].offset = -(system.suns[0].offset+(radius2+Math.random()*radius2));
		sRad = -(system.suns[1].offset)*2;
	}else{
		system.suns[0] = {};
		system.suns[0].radius = sRad = 1000+Math.random()*2000;
		system.suns[0].object = buildSun(sRad);
	    system.suns[0].offset = 0;
		sRad = sRad*2 + Math.random()*sRad;
	}
	
	system.starfields = starField();
	system.planets = [];
	system.asteroids = {};
	system.update = updateSystem;
	
	var numPlanets = 1 + Math.floor(Math.random()*7);
	var af = 1+Math.floor(Math.random()*(numPlanets-1));
	console.log(af);
	var asDist = 0;
	for(var p = 0; p < numPlanets; p++){
		system.planets[p] = {};
		system.planets[p].planet = {};
		system.planets[p].planet.radius = pRad = 50+Math.floor(Math.random()*750);
		
		if(p==0){
			system.planets[p].planet.distance = pDis = sRad+1500;
		}else if(p==af){
			system.planets[p].planet.distance = pDis = system.planets[p-1].planet.distance + (10000+Math.floor(Math.random()*15000));
			asDist = system.planets[p-1].planet.distance + (system.planets[p].planet.distance-system.planets[p-1].planet.distance)/2;
			system.asteroids = buildAsteroids(asDist);
		}else{
			system.planets[p].planet.distance = pDis = system.planets[p-1].planet.distance+ (3333+Math.floor(Math.random()*5000));
		}
		
		system.planets[p].planet.rotation = (pRad*2.5)/100;
		system.planets[p].planet.object = buildPlanet(pRad, pDis);
		system.planets[p].planet.spin = {x:Math.floor(Math.random()*10)/1000,y:Math.floor(Math.random()*10)/1000,z:Math.floor(Math.random()*10)/1000};
		system.planets[p].planet.moons = [];
		
		var numMoons = Math.floor(Math.random()*5);
		for(var m = 0; m < numMoons; m++){
			system.planets[p].planet.moons[m] = {};
			system.planets[p].planet.moons[m].moon = {};
			system.planets[p].planet.moons[m].moon.radius = mRad = pRad/50 + Math.random()*pRad/10;
			system.planets[p].planet.moons[m].moon.orbit = Math.random()*10;
			
			if(m==0){
				system.planets[p].planet.moons[m].moon.distance = mDis = pRad*2;
			}else{
				system.planets[p].planet.moons[m].moon.distance = mDis = system.planets[p].planet.moons[m-1].moon.distance 
					+ system.planets[p].planet.moons[m-1].moon.radius * 4;
			}

			system.planets[p].planet.moons[m].moon.rotation = mRad/75;
			system.planets[p].planet.moons[m].moon.object = buildMoon(mRad,mDis,system.planets[p].planet.object);
			system.planets[p].planet.moons[m].moon.path = buildPath(system.planets[p].planet,system.planets[p].planet.moons[m].moon)
		}
	}
	
	displayName();
	console.log("Solar System Created:");
	console.log(system);
}

function buildMoon(radius, dist, object, orbit){
	var moonGeo = new THREE.SphereGeometry(radius, 50, 50);
	var red = rgbToHex(197,197,197);
	var moonMat = new THREE.MeshLambertMaterial({color: red,ambient:red});
	moon = new THREE.Mesh(moonGeo, moonMat);
	moon.position.x = dist;
	moon.position.y = dist;
	object.add(moon);
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

//http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js
var materials = [];
function buildSun(radius){
	var material = new THREE.ShaderMaterial( {
		uniforms: { 
			time: {
				type: "f", 
				value: 0.0 
			},
			myColor: { 
				type: "v3", 
				value: new THREE.Vector3(1+Math.random(),1+Math.random(),1+Math.random()) 
			}
		},
		   vertexShader: document.getElementById('vertexShader').textContent,
		   fragmentShader: document.getElementById('fragmentShader').textContent
	});
	var sunColor = rgbToHex(Math.floor(Math.random()*300), Math.floor(Math.random()*300), Math.floor(Math.random()*300));
	var sunGeo = new THREE.SphereGeometry(radius,125,125);
	var sunGeoOuter = new THREE.SphereGeometry(radius+(radius/5),50,20);
	var sun = new THREE.Mesh(sunGeo, material);
	scene.add(sun);
	lookAtObject = sun.position;
	materials.push(material);
	return sun;
}



function buildBinarySun(radius){
	var material = new THREE.ShaderMaterial( {
		uniforms: { 
			time: { 
				type: "f", 
				value: 0.0 
			},
			myColor: { 
				type: "v3", 
				value: new THREE.Vector3(1+Math.random(),.5+Math.random(),Math.random()) 
			}
		},
		   vertexShader: document.getElementById('vertexShader').textContent,
		   fragmentShader: document.getElementById('fragmentShader').textContent
	});
	var sunGeo = new THREE.SphereGeometry(radius,125,125);
	var sunGeoOuter = new THREE.SphereGeometry(radius+(radius/5),50,20);
	var sunColor = rgbToHex(Math.floor(Math.random()*300), Math.floor(Math.random()*300), Math.floor(Math.random()*300));
	var sun = new THREE.Mesh(sunGeo, material);
	scene.add(sun);
	lookAtObject = new THREE.Vector3(0,0,0);
	materials.push(material);console.log(materials);
	return sun;
}

var planetMats = [];
function buildPlanet(radius,dist){
	var pGeo = new THREE.SphereGeometry(radius,100,100);
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
				lVecs : { type: "v3v", value: [] }
			},
		   vertexShader: document.getElementById('vertexShader_planet').textContent,
		   fragmentShader: document.getElementById('fragmentShader_planet').textContent
	});
	planetMats.push(material);
	var planet = new THREE.Mesh(pGeo, material);
	var angle = Math.random()*Math.PI*2;
	planet.position.x = Math.sin(angle)* dist;
	planet.position.y = Math.cos(angle)* dist;
	planet.receiveShadow = true;

// 	var green = rgbToHex(0, (50+Math.floor(Math.random()*100)), 0);
// 	var brown = rgbToHex(91+Math.floor(Math.random()*10),63+Math.floor(Math.random()*10),16+Math.floor(Math.random()*10));
// 	var treeMats = [new THREE.MeshLambertMaterial({color: brown}),new THREE.MeshLambertMaterial({color: green})];
// 	var treeGeo = new THREE.Geometry();
// 	
// 	 for(var i = 0; i < 100; i++){
// 		var scale = 1+((Math.floor(Math.random()*50)/100));
// 		buildTree(scale,treeGeo,radius,treeMats);
// 	}
// 	
// 	var treeMesh = new THREE.Mesh(treeGeo);
// 	treeMesh.castShadow = true;
// 	planet.add(treeMesh);
// 	
// 	for(var j = 0; j<50; j++){
// 		var scale = 1+((Math.floor(Math.random()*50)/100));
// 		buildGrass(scale,sphere, radius);
// 	}

	scene.add(planet)
	return planet;
}

function buildAsteroids(dist){
	var asteroidMat = new THREE.MeshLambertMaterial({color:0xA36D0F});
	var asteroids = [];
	var numBelts = 33;
	for(var ast = 0; ast < numBelts; ast++){
		asteroids[ast] = {}
		var geo = new THREE.Geometry();
		var numAsteroids = 5 + Math.floor(Math.random()*55)
		for(var a = 0; a< numAsteroids; a++){	
			var asteroidGeo = new THREE.SphereGeometry(10+Math.random()*150,1+Math.random()*3,1+Math.random()*3);
			var asteroidMesh = new THREE.Mesh(asteroidGeo,asteroidMat);
			var angle = Math.random()*Math.PI*2;
			var beltWidth = 2000 + Math.floor(Math.random()*3000);
			asteroids[ast].rotation = (Math.random()*2)/(3333+Math.random()*3333);
			asteroids[ast].ypos = Math.cos(angle)* dist + Math.random();
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

function buildTree(scale, object, radius, mats){	
	var treeGroup = new THREE.Geometry();
	var treeMats = [];

	var tx = 20*scale;
	var ty = 20*scale;
	var tz = 60*scale;
	var bx = 25*scale;
	var by = 25*scale;
	var bz = 15*scale;
	var lx = 40*scale;
	var ly = 40*scale;
	var lz = 30*scale;
	
	var trunk = new THREE.CubeGeometry(tx, ty, tz);
	var base = new THREE.CubeGeometry(bx, by, bz)
	var leaves = new THREE.CubeGeometry( lx, ly, lz);
	
    var trunkMesh = new THREE.Mesh(trunk);
	trunkMesh.position.z = tz/2;		
	for ( var j = 0; j < trunk.faces.length; j ++ ) {
    	trunk.faces[ j ].materialIndex = 0;
  	}
	THREE.GeometryUtils.merge(treeGroup, trunkMesh);
		
    var baseMesh = new THREE.Mesh(base);
	baseMesh.position.z = bz/2;	
	for ( var j = 0; j < base.faces.length; j ++ ) {
    	base.faces[ j ].materialIndex = 0;
  	}	
	THREE.GeometryUtils.merge(treeGroup, baseMesh);
		
    var leavesMesh = new THREE.Mesh(leaves);
	leavesMesh.position.z = (lz/2)+(tz);	
	for ( var j = 0; j < leaves.faces.length; j ++ ) {
    	leaves.faces[ j ].materialIndex = 0;
  	}			
	THREE.GeometryUtils.merge(treeGroup, leavesMesh);
	
	var origin = new THREE.Object3D();
	var sPs = randomSpherePoint(0,0,0, radius);
	var treeMesh = new THREE.Mesh(treeGroup,new THREE.MeshFaceMaterial(mats));
	treeMesh.position.x = sPs[0];
	treeMesh.position.y = sPs[1];
	treeMesh.position.z = sPs[2];
	treeMesh.castShadow = true;
	treeMesh.receiveShadow = true;
	lookAwayFrom(treeMesh,origin);
	THREE.GeometryUtils.merge(object, treeMesh);
	
}

function buildGrass(scale, object, radius){	
	var lx = 5*scale;
	var ly = 5*scale;
	var lz = 30*scale;
	var grass = new THREE.CubeGeometry( lx, ly, lz);
	var green = rgbToHex(0, (50+Math.floor(Math.random()*100)), 0);
	var grassMat = new THREE.MeshLambertMaterial({color: green});
    var grassMesh = new THREE.Mesh(grass, grassMat);
	var origin = new THREE.Object3D();
	var sPs = randomSpherePoint(0,0,0, radius);
	grassMesh.position.x = sPs[0];
	grassMesh.position.y = sPs[1];
	grassMesh.position.z = sPs[2];
	grassMesh.castShadow = true;
	grassMesh.receiveShadow = true;
	lookAwayFrom(grassMesh,origin);
	object.add(grassMesh);
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

//http://www.physics.sfasu.edu/astro/ebstar/ebstar.html
function displayName(){
	var text2 = document.createElement('span');
	text2.style.position = 'absolute';
	text2.style.top = 0;
	text2.style.left = 0;
	text2.style["padding-left"] = "25px";
	text2.style["padding-top"] = "10px";
	text2.style.color = "white";
	text2.style["font-size"] = "33px";
	text2.style.backgroundColor = "transparent";
	text2.innerHTML = systemName;
	document.body.appendChild(text2);
}

var start = Date.now();
function updateSystem(){
	for(var mat in materials){
		materials[mat].uniforms[ 'time' ].value = .000025 * ( Date.now() - start );
	}
	
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
		planetMats[p].uniforms['lVecs'].value = sunLights;
		planet.object.position.x = (Math.sin(rotation/planet.rotation * (Math.PI /360)) * planet.distance);
		planet.object.position.y = (Math.cos(rotation/planet.rotation * (Math.PI / 360)) * planet.distance);
		for(var m in planet.moons){
			var moon = planet.moons[m].moon;
			moon.object.position.x = (Math.sin(rotation/moon.rotation * (Math.PI/moon.orbit/360)) * moon.distance);
			moon.object.position.y = (Math.cos(rotation/moon.rotation * (Math.PI/moon.orbit/360)) * moon.distance);
		}
	}
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}