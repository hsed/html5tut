// JavaScript Document
// RequestAnimFrame: a browser API for getting smooth animations Callback: 30fps-----------------------------> 
window.requestAnimFrame = (function(){ return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
function( callback ){ return window.setTimeout(callback, 1000 / 33); }; })();

window.cancelRequestAnimFrame = ( function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();
//Helper End------------------------------------------------------------------------------->>
var init;
var disdel; //The delay timer for disabling the animation
var canvas = document.getElementById("matrixbg");
var ctx = canvas.getContext("2d");

//making the canvas full screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var fps = 25;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

//characters
var char = "01";
//converting the string into an array of single characters
char = char.split("");

var font_size = 7;
var columns = canvas.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
	drops[x] = canvas.height; //1 

//drawing the characters
function draw()
{
	//Request fram for next paint
	init = requestAnimFrame(draw); //Currently fast, add '-10' in api to slow down.
	//Black BG for the canvas
	//translucent BG to show trail
	now = Date.now();
	delta = now - then;
	//console.log(delta);
	
	if (delta > interval) {
		then = now - (delta % interval);
	
	
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#0F0"; //green text
	ctx.font = font_size + "px arial";
	//looping over drops
	for(var i = 0; i < drops.length; i++)
	{
		//a random character to print
		var text = char[Math.floor(Math.random()*char.length)];
		//x = i*font_size, y = value of drops[i]*font_size
		ctx.fillText(text, i*font_size, drops[i]*font_size);
		
		//sending the drop back to the top randomly after it has crossed the screen
		//adding a randomness to the reset to make the drops scattered on the Y axis
		if(drops[i]*font_size > canvas.height && Math.random() > 0.975)
			drops[i] = 0;
		
		//incrementing Y coordinate
		drops[i]++;
	}
	
	}
}

function ResizeMatrix(){
            cancelRequestAnimFrame(init);
			if (localStorage.anim == false) clearTimeout(disdel);
			canvas = document.getElementById("matrixbg");
            if (canvas.width  < window.innerWidth)
            {
                canvas.width  = window.innerWidth;
            }

            if (canvas.height < window.innerHeight)
            {
                canvas.height = window.innerHeight;
            }
			columns = canvas.width/font_size; 
			for(var x = 0; x < columns; x++) drops[x] = 1;
			init = requestAnimFrame(draw);
			if (localStorage.anim == false) disdel = setTimeout(function() { cancelRequestAnimFrame(init); }, 10000);
        }
