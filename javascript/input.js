var mouseDown = false,midlookx,midlooky;

function bindKeys(){
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('keydown', onDocumentKeyDown, false);
	document.addEventListener('keyup', onDocumentKeyUp, false);
	document.onmousewheel = onMouseScrollButton;
}

function onDocumentMouseMove(event){
	event.preventDefault();
		
	mouse2D.x = (event.clientX/window.innerWidth) * 2 - 1;
	mouse2D.y = -(event.clientY/window.innerHeight) * 2 + 1;
	
	var dx = event.clientX - midlookx;
	var dy = event.clientY - midlooky;
	if(mouseDown){
		//TODO: Cant go too far!
		camera.position.x -= dx*3;
		camera.position.y += dy*3;
	}
	
}

function onDocumentMouseDown(event){
	mouseDown = true;
	event.preventDefault();
	midlookx = event.clientX;					
	midlooky = event.clientY;
}

function onDocumentMouseUp(event){
	mouseDown = false;
	event.preventDefault();

	var intersects = ray.intersectObjects(scene.children);
	if(intersects.length > 0){
		intersector = getRealIntersector(intersects);
		lookAtObject = intersector.object.position;
	}
	
	isMouseDown=false;
	isMouseDownAndMoving=false;
}

function onMouseScrollButton(event){
event.preventDefault();
	if(event.wheelDelta<0&&camera.position.z<=zoommax)
		camera.position.z += 333;
	else if(event.wheelDelta>0&&camera.position.z>=zoommin)
		camera.position.z -= 333;
}

function onDocumentKeyDown(event){
	switch(event.keyCode){
		case 17: ctrl=true;break;
	}
}

function onDocumentKeyUp(event){
	switch(event.keyCode){
		case 17: ctrl=false;break;	
	}
}