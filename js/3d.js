// JavaScript Document
var AnimStart = 0.42;
var AnimEnd =  0.42;
var width  = 400, height = 500, clock = new THREE.Clock(), cameraTarget = new THREE.Vector3( 0, 10, 0 ), renderer, camera, scene, ambientLight, helper, miku, animation;

renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
renderer.shadowMapEnabled = true;
document.getElementById('Div3D').appendChild( renderer.domElement );

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 40, width / height, 1, 1000 );
var val = 0 / 100 * 2 * Math.PI;
camera.position.set( 30 * Math.sin( val ), 18, 30 * Math.cos( val )); //EDITED --> Y-POS
//camera.position.set( 30 * Math.sin( val ), 10, 30 * Math.cos( val ));
camera.lookAt( cameraTarget );

light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 ).normalize();
scene.add( light );

function LoadObj() {
var loader = new THREE.JSONLoader();
var url = (location.pathname.split('/').pop() == 'loader.html') ? 'al/al_new.js' : '../../al/al_new.js';
loader.load( url, function( geo, mat ) {
	miku = new THREE.SkinnedMesh(geo, new THREE.MeshFaceMaterial( mat ));
  	miku.material.materials.forEach(function ( mat ) {
    	mat.skinning = true;
		mat.shading = THREE.SmoothShading;
  	} );
	

  miku.scale.x = miku.scale.y = miku.scale.z = 12;
  scene.add( miku );

  THREE.AnimationHandler.add( miku.geometry.animations[ 0 ] );
  animation = new THREE.Animation(miku, miku.geometry.animations[ 0 ].name, THREE.AnimationHandler.CATMULLROM);
  
  ( function renderLoop (){
    requestAnimationFrame( renderLoop );
    var delta = clock.getDelta();
    var theta = clock.getElapsedTime();
    animation.update( delta );
     
	if (animation.currentTime > AnimEnd) {
    	animation.stop();
        animation.play(false, AnimStart); // play the animation not looped, from 0s
    }
			
    renderer.render( scene, camera );
  } )();
  
  setTimeout(Init, 1000);
  if (window.location.pathname.indexOf('va.html') >= 0) 
  	{setTimeout(function() {Process(); document.getElementById("tb").disabled = false;}, 1000);}
} );
}

function Gesture(start, end, loop) {
		var seconds = new Date().getTime() / 1000;
		var currentTime = seconds;
		
		AnimStart = +start, AnimEnd = +end, loop = +loop;
		animdur = end - start;
		totdur = animdur * loop;
		
		animation.stop();
		animation.play(true, start);
		
		setTimeout(function() {AnimStart = AnimEnd = 0.42;}, totdur*1000);
	};

//setTimeout( function() {Gesture(0.55, 1.5, 3);}, 5000);
//setTimeout( function() {Gesture(0.4167, 2.4167, 3);}, 10000); //Wave


//setTimeout( function() {Gesture(5.4167, 6.9167, 2);}, 20000); //Right Hand Move
/*
All Gesture Codes:-

Wave Hand: Gesture(0.55, 1.5, 3);
Default (Standing): AnimStart = AnimEnd = 1.5;


*/