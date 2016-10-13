// JavaScript Document
// Based on an online tutorial
// RequestAnimFrame: a browser API for getting smooth animations Callback: 30fps-----------------------------> 
window.requestAnimFrame = (function(){ return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
function( callback ){ return window.setTimeout(callback, 1000 / 30); }; })();

window.cancelRequestAnimFrame = ( function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();
//Helper End------------------------------------------------------------------------------->>

// Initialize canvas and required variables 
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"), // Create canvas context
	background=document.getElementById("background"),
    bkCtx=background.getContext("2d"),
	myDate = new Date(),
	lastLoop = new Date, 
	thisLoop,
	LT = false,
	RT = false,
	P2LT = false,
	P2RT = false,
	Bck = false,
	P2 = false,
	Snd = true,
	NHS = false,
	IsIE = !!(window.ActiveXObject || "ActiveXObject" in window); //To check whether localStorage is supported or not
	
var	W = 600, // Window's width
	H = 540, // Window's height
	points = 0,
	P2points = 0,
	over = 0, // flag varialbe, cahnged when the game is over
	offsetLeft=0,
	help = 0, // 0 = off | 1 = on
	CurrentColour = 6,
	filterStrength = 20,
	frameTime = 0,
	pStep = 5,
	Info="JPong v1.01 by Haaris Osman Mehmood"
	xoff = document.getElementById('container').offsetLeft,
	yoff = document.getElementById('container').offsetTop,
	init = null, // variable to initialize animation
	bkinit = null, //variable to initialize back
	bktimer = null,
	spdtimer = null,
	paddleHit = null;
	
var ball = {}, // Ball object 
	mouse = {},
	startBtn = {}, // Start button object
	restartBtn = {}, // Restart button object
	helpBtn = {},
	sndBtn = {},
	P1Btn = {},
	P2Btn = {},
	paddles = [2], // Array containing two paddles
	ColourArray = ["#f5ff00", "#ff00ff", "#00ff00", "#ff00cc", "#3bff20", "#0ff", "#ffffff"],
	P2CommentLoss = ["Sorry!","Better luck next time.", "Shame on you!", "Didn't expect this from you.", "You can do it too!"],
	CommentLow = ["Sorry! :P","Better luck next time! :(", "Shame on you! :P", "Didn't expect this from you :'(", "Oops! :P"],
	CommentMid = ["Try again!","Come on! :|", "Is that it?", "Nooooooooooo! :/", "Try harder!","You can do better..."],
	CommentHigh = ["Almost there :)","You are improving :)","That was pretty decent! :)", "You're starting to get hang of it! :)", "Better luck next time! ;)"],
	CommentTop = ["You're a champ! :D", "", "Wow! :D", "Was that a new high score?", "Unbeatable! 👍", "Unbelievable! :D", "You're awesome! :D"];
var	backImage=RandomStarsImage();

canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
		case 37: // Left --> Next Page
		LT = true;
		//console.info(LT); 
        break;

        case 39: // Right --> Prev Page
		RT = true
        break;
		
		case 65: // A --> Next Page
		P2LT = true;
		//console.info(LT); 
        break;

        case 68: // D --> Prev Page
		P2RT = true
        break;
        default: return; // Exit Handler If Any Other Key
    }
    e.preventDefault(); // Prevent Default Action (DISABLED)
}

document.onkeyup = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
		case 37: // Left --> Next Page
		LT = false;
		//console.info(LT); 
        break;

        case 39: // Right --> Prev Page
		RT = false;
        break;
		
		case 65: // Left --> Next Page
		P2LT = false;
        break;

        case 68: // Right --> Prev Page
		P2RT = false;
        break;
        default: return; // Exit Handler If Any Other Key
    }
    e.preventDefault(); // Prevent Default Action (DISABLED)
}


// Push two new paddles into the paddles[] array 
paddles.push(new Paddle("bottom")); 
paddles.push(new Paddle("top"));

//Start Title
function Header() {
	ctx.fillStyle = "white"; 
	ctx.font = "20px Arial, sans-serif"; 
	ctx.textAlign = "center"; 
	ctx.textBaseline = "middle"; 
	ctx.fillText(Info, W/2, 40 );
    paintBck();
}

function gameModeScr() {
	ctx.fillStyle = "white"; 
	ctx.font = "20px Arial, sans-serif"; 
	ctx.textAlign = "center"; 
	ctx.textBaseline = "middle"; 
	ctx.fillText(Info, W/2, 40 );
	ctx.textAlign = "left";
	ctx.fillText("Instructions:", 20, 260 );	
	ctx.fillText("➜ 1P: Move your mouse left/right to control both paddles.", 20, 290 );	
	ctx.fillText("➜ 2P: Player 1 controls bottom paddle with left and right keys.", 20, 320 );	
	ctx.fillText("➜ 2P: Player 2 controls top paddle with A and D keys.", 20, 350 );	
}

function showHelp() {
	ctx.clearRect(0,0,W,H);
	ctx.fillStyle = "white"; 
	ctx.font = "20px Arial, sans-serif"; 
	ctx.textAlign = "center"; 
	ctx.textBaseline = "middle"; 
	ctx.fillText(Info, W/2, 40 );	
	ctx.textAlign = "left";
	ctx.fillText("Instructions:-", 20, 130 );
	ctx.fillText("One Player:", 20, 160 );		
	ctx.fillText("➢ Move your mouse left/right to control both paddles.", 20, 190 );	
	ctx.fillText("➢ Hit the ball with the paddle before it exits the stage.", 20, 220 );	
	ctx.fillText("➢ Try to beat your own high score!", 20, 250 );	
	ctx.fillText("Two Players:", 20, 310 );	
	ctx.fillText("➜ Player 1 controls bottom paddle with left and right keys.", 20, 340 );	
	ctx.fillText("➜ Player 2 controls top paddle with A and D keys.", 20, 370 );	
	ctx.fillText("➜ The first player to reach 5 points wins.", 20, 400 );	
	helpBtn.y = 430;
	helpBtn.t = "← Back";
	helpBtn.draw();
}

// Start Button object
startBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 25,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font="22px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
    	ctx.fillStyle='#ffffff';
    	ctx.fillText("Start!",this.x + 50,this.y + 25); 
	}
};

// Restart Button object
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font = "20px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "#ffffff";
		ctx.fillText("Restart ↺", this.x + 50, this.y + 25);
	}
};

//Help Button
helpBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 + 50,
	t: "Help",
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font="22px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
    	ctx.fillStyle='#ffffff';
		ctx.fillText(this.t,this.x + 50, this.y + 25);
	}
};

sndBtn = {
	w: 120,
	h: 50,
	x: W/2 - 60,
	y: H/2 + 125,
	t: "Sound: On",
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font="22px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
    	ctx.fillStyle='#ffffff';
    	ctx.fillText(this.t,this.x + 60,this.y + 25); 
	}
};

P1Btn = {
	w: 50,
	h: 50,
	x: W/2 - 75,
	y: H/2 - 100,
	t: "1P",
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font="22px Arial, sans-serif";
    	ctx.fillStyle='#ffffff';
		ctx.fillText(this.t,this.x + 25, this.y + 25);
	}
};

P2Btn = {
	w: 50,
	h: 50,
	x: W/2 + 50,
	y: H/2 - 100,
	t: "2P",
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font="22px Arial, sans-serif";
    	ctx.fillStyle='#ffffff';
		ctx.fillText(this.t,this.x + 25, this.y + 25);
	}
};

// Ball object 
ball = { 
x: Math.floor(Math.random()*(W-30)),
y: 50, 
r: 5, 
c: "white", 
vx: 3,
vy: 6,

// Function for drawing ball on canvas
draw: function() {
	ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
    ctx.fill();
	}
};

function Paddle(pos) { 
// Height and width 
this.h = 5; this.w = 125;
// Paddle's position
var halfW = W/2;
var halfthis = this.w/2
this.x = +halfW - +halfthis;
this.y = (pos == "top") ? 0 : H - this.h;
}

// Draw everything on canvas
function draw() {
	//paintCanvas();
	ctx.clearRect(0,0,W,H);
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];		
		ctx.fillStyle = "white";
		
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}
	updateScore();
	ball.draw();
	update();
}

//Function to check collision between ball and one of the paddles
function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w && b.y < H) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0 && (b.y > -8 || b.y > 0)) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}


function update() { 

ball.x += ball.vx; 
ball.y += ball.vy; 

if(P2==true){
	if(LT==true||RT==true){
		//console.info(LT); 
		p = paddles[1];
		p.x+= (LT == true) ? -pStep : +pStep;
		if (p.x <= 0-p.w/2) {p.x = 0-p.w/2;};
		if (p.x + p.w/2 >= W) {p.x = W - p.w/2;};
	};
	
	if(P2LT==true||P2RT==true){
		p = paddles[2];
		p.x+= (P2LT == true) ? -pStep : +pStep;
		if (p.x <= 0-p.w/2) {p.x = 0-p.w/2;};
		if (p.x + p.w/2 >= W) {p.x = W - p.w/2;};
	};
}

else{	
// Move the paddle on mouse move		
	if(mouse.x && mouse.y) {
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = mouse.x - p.w/2 - xoff;
		}		
	}
}

	// Collision with paddles
	p1 = paddles[1];
	p2 = paddles[2];


	if(collides(ball, p1)||collides(ball, p2)) {
    	ball.vy = -ball.vy;
		if(Snd){document.getElementById('collide').play();}
		ball.c = ColourArray[randomColour()]; //Add random colour for ball
		if(!P2){
			points++;
			incrSpeed();
		}
	}

	// Collide with walls, If the ball hits the top/bottom, walls, run gameOver() function
	else{
		if(ball.y > (H)) {
			ball.y = H + ball.r;
			if(!P2){var gameOverDelay = setTimeout(function() {gameOver();}, 100)}
			else{
				if(P2points<5 && points<5){
					P2points++;
					//ball.x = ball.x + 20;
					ball.y = H/2-200;
				}
				if(P2points==5){
					ball.y = H + ball.r;
					var gameOverDelay = setTimeout(function() {gameOver();}, 100)
				}
			};
			
		} 
		
		else if(ball.y < 0) {
			ball.y = 0 - ball.r;
			if(!P2){var gameOverDelay = setTimeout(function() {gameOver();}, 100)}
			else{
				if(points<5 && P2points<5){
					points++;
					//ball.x = W/2;
					ball.y = H/2+200;
				}
				if(points==5){
					ball.y = 0 - ball.r;
					var gameOverDelay = setTimeout(function() {gameOver();}, 100)
				}
			};
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
}

// Function for running the whole animation again and again
function animloop() {init = requestAnimFrame(animloop); draw(); gameLoop();}

function gameLoop(){
  // ...
  var thisFrameTime = (thisLoop=new Date) - lastLoop;
  frameTime+= (thisFrameTime - frameTime) / filterStrength;
  lastLoop = thisLoop;
}

// Report the fps only every second
var fpsOut = document.getElementById('log');
setInterval(function(){
  if(frameTime==0||over==1){return;}
  var thisdate = new Date()
  fpsOut.innerHTML = "Performance: " + (1000/frameTime).toFixed(1) + " fps " + "&nbsp;" + "Ball Speed: " + Math.abs(ball.vx) +  ((ball.vx < 0) ? "&larr;" : "&rarr;") + "&nbsp;" + Math.abs(ball.vy) +  ((ball.vy < 0) ? "&uarr;" : "&darr;") + "&nbsp;" + "Score: " + points + "&nbsp;" + "High Score: " + (IsIE ? "N/A" : localStorage.highscore) + "&nbsp;" + "Time Played: " + (thisdate.getSeconds() - myDate.getSeconds()) + "s";
},1000);


//Game Over
function gameOver() {
	if(over==1){return;}
	document.body.style.cursor = "";
	if(Snd){
		document.getElementById('mainsong').pause();
		document.getElementById('mainsong').currentTime = 0;
		document.getElementById('gameover').volume = 0.5;
		document.getElementById('gameover').play();
	}
	canvas.addEventListener("mousedown", btnClick, true);
	ctx.fillStyle = "red"; 
	ctx.font = "24px Arial, sans-serif"; 
	ctx.textAlign = "center"; 
	ctx.textBaseline = "middle"; 
	ctx.fillText("Game Over :(", W/2, H/2 + 25);
	ctx.fillStyle = "white"; 
	ctx.font = "20px Arial, sans-serif"; 
	if (P2) {
	    if(points>P2points){
			ctx.fillText("Player 1 Wins!", W/2, H/2 + 55 )
			ctx.fillText("Player 2 " + P2CommentLoss[Math.round(Math.random() * (P2CommentLoss.length - 1))], W/2, H/2 + 80 );
		};
	    if(points<P2points){
			ctx.fillText("Player 2 Wins!", W/2, H/2 + 55 )
			ctx.fillText("Player 1 " + P2CommentLoss[Math.round(Math.random() * (P2CommentLoss.length - 1))], W/2, H/2 + 80 );
		};
	}
	else{
	
	
	
	ctx.fillText("You Scored: " + points, W/2, H/2 + 55 );
	if(!NHS){
	if(points<=10){ctx.fillText(CommentLow[Math.round(Math.random() * (CommentLow.length - 1))], W/2, H/2 + 80 );}
	if(points<=15&&points>10){ctx.fillText(CommentMid[Math.round(Math.random() * (CommentMid.length - 1))], W/2, H/2 + 80 );}
	if(points<=20&&points>15){ctx.fillText(CommentMid[Math.round(Math.random() * (CommentMid.length - 1))], W/2, H/2 + 80 );}
	if(points<=30&&points>20){ctx.fillText(CommentHigh[Math.round(Math.random() * (CommentHigh.length - 1))], W/2, H/2 + 80 );}
	if(points>30){ctx.fillText(CommentTop[Math.round(Math.random() * (CommentTop.length - 1))], W/2, H/2 + 80 );}
	}
	if(NHS){ctx.fillText('Congratulations! New High Score! :D', W/2, H/2 + 80 ); NHS=false;}
	}
	var myDate2 = new Date();
	if(myDate.getMinutes() > myDate2.getMinutes()){
				if(myDate.getSeconds() >= myDate2.getSeconds()){
					sec = (60 - myDate.getSeconds()) + myDate2.getSeconds();
					min = (60 - myDate.getMinutes()) + myDate2.getMinutes() - 1;
				}
				else{
					sec = myDate2.getSeconds() - myDate.getSeconds();
					min = (60 - myDate.getMinutes()) + myDate2.getMinutes();
				}
				}
	else{
				if(myDate.getSeconds() > myDate2.getSeconds()){
					sec = (60 - myDate.getSeconds()) + myDate2.getSeconds();
					min = myDate2.getMinutes() - myDate.getMinutes() - 1;
				}
				else{
					sec = myDate2.getSeconds() - myDate.getSeconds();
					min = myDate2.getMinutes() - myDate.getMinutes();
				} 
				hr =myDate2.getHours() - myDate.getHours();       
		}
		
	var totalTime = min + 'm ' + sec + 's';	 				  
	if(!P2){ctx.fillText("You played for: " + totalTime, W/2, H/2 + 110);}
	if(P2){ctx.fillText("Total time played: " + totalTime, W/2, H/2 + 110);}
	// Stop the Animation
	cancelRequestAnimFrame(init);
	cancelRequestAnimFrame(bkinit);
	clearInterval(spdtimer);
	over = 1;
	restartBtn.draw();
	Bck = false;
	paintBck();
}



//Extras-------------------------------------------------------->
// Track the position of mouse cursor
function trackPosition(e) { mouse.x = e.pageX; mouse.y = e.pageY; }

// On button click (Restart and start)
function btnClick(e) {
	// Variables for storing mouse position on click
	mouse.x = e.pageX,
	mouse.y = e.pageY;
	
	// Click start button
	if(checkhit(startBtn)==true) {
		ctx.clearRect(0,0,W,H);
		startBtn = {};
		helpBtn = {};	
		sndBtn = {};
		P1Btn.draw();
		P2Btn.draw();
		gameModeScr();
	}
	
	if(checkhit(sndBtn)==true) {
		ctx.clearRect(sndBtn.x,sndBtn.y,sndBtn.w,sndBtn.h);
		if(Snd)
		{
			sndBtn.t = "Sound: Off";
			Snd=false;
		}
		else
		{
			sndBtn.t = "Sound: On";
			Snd=true;
		}
		sndBtn.draw();
		
	}
	
	if(checkhit(P1Btn)==true) {
		P1Btn = {};
		P2Btn = {};
		start();
	}
	
	if(checkhit(P2Btn)==true) {
		P1Btn = {};
		P2Btn = {};
		start(false, true);
	}
	
	// If the game is over, and the restart button is clicked
	if(over == 1) {
		if(checkhit(restartBtn)==true) {
			start(true,P2);
		}
	}
	
	if(help == 0) {
		if(checkhit(helpBtn)==true) {
			showHelp();
			help = 1;
		}
	}
	else{if(help == 1) {
		if(checkhit(helpBtn)==true) {
			helpBtn.y = H/2 + 50;
			helpBtn.t = "Help";
			startWindow();
			help = 0;
		}}
	}
	
}

function start(res, P2Mode) {
	res = res||false; //res=restart True||False
	P2Mode = P2Mode|| false;
	P2 = P2Mode;
	if(res){
		ball.x = Math.floor(Math.random()*(W-30)), ball.y = 20, ball.vx = 3, ball.vy = 6,
		points = 0, P2points = 0, pStep = 5, over = 0;	
	};
	if(P2){
		ball.x = W/2 - 100, ball.y = H/2, ball.vx = 3, ball.vy = 6; 
		spdtimer = setInterval(function(){
			if(Math.abs(ball.vy) < 13) {
				ball.vx += (ball.vx < 0) ? -0.5 : 0.5;
				ball.vy += (ball.vy < 0) ? -1 : 1;
				pStep += 0.1;
			}
		}, 5000);
		}
	myDate = new Date();
	animloop();
	panStars();
	if(Snd){document.getElementById('mainsong').play();}
	document.body.style.cursor = "none";
	if(res){};
	canvas.removeEventListener("mousedown", btnClick, true);
}
	

function checkhit(Btn){
	var mx = mouse.x,
		my = mouse.y,
		x = Btn.x,
		y = Btn.y,
		w = Btn.w,
		h = Btn.h;
	if(mx >= x + xoff && mx <= x + w + xoff && my >= y  + yoff && my <= y + h + yoff){return true;}
	return false;
}

function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "18px Arial, sans-serif";
	if(!IsIE) {if(!localStorage.highscore){localStorage.setItem("highscore", "0");}
	if(!P2 && points > Number(localStorage.highscore)) {
		localStorage.highscore = points;
		NHS = true; 
	}}
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	if(!IsIE) {ctx.fillText((P2 ? "" : "High Score: " + localStorage.highscore), W-135, H-20 );}
	ctx.fillText((P2 ? "P1 Score: " : "Score: ") + points, 20, H-20 );
	if(P2){
	ctx.textBaseline = "top";
	ctx.fillText("P2 Score: " + P2points, 20, 20 );
	}
}

function incrSpeed() {
	if(points % 4 == 0) {
		if(Math.abs(ball.vy) < 12) {
			ball.vx += (ball.vx < 0) ? -0.5 : 0.5;
			ball.vy += (ball.vy < 0) ? -1 : 1;
			pStep += 0.3;
		}
	}
}

function startWindow() {
	ctx.clearRect(0,0,W,H)
	startBtn.draw();
	helpBtn.draw();
	sndBtn.draw();
	Header();
}

function randomColour() {
	var ok = 0;
	var index = null;
	while(ok < 1) {
		index = Math.round(Math.random() * (ColourArray.length - 1));
		if(index!=CurrentColour) {
			 ok = 2;
			 CurrentColour=index;
		}
	}
	ok = 0;
	console.info(index); 
	return index;
}

function panStars() {   
    // increase the left offset
    offsetLeft+=1;
    if(offsetLeft>backImage.width){ offsetLeft=0; }
 	// draw the starfield image and draw it again 
   	// to fill the empty space on the right of the first image
    	bkCtx.clearRect(0,0,background.width,background.height);
     	bkCtx.drawImage(backImage,-offsetLeft,0);
     	bkCtx.drawImage(backImage,backImage.width-offsetLeft,0);
    	bkinit = requestAnimFrame(panStars);  
    }


 function RandomStarsImage(){
            // draw a random starfield on the canvas
            bkCtx.beginPath();
            bkCtx.fillStyle='#0E2B4B';
            bkCtx.rect(0,0,W,H);
            bkCtx.fill();
           
            for(var n=0;n<100;n++){
                var x=parseInt(Math.random()*canvas.width);
                var y=parseInt(Math.random()*canvas.height);
                var radius=Math.random()*5;
				var sides=Math.max(parseInt(Math.random()*8),4);
               	star(bkCtx, x, y, radius, sides, 0.3);
            }
            

            // create an new image using the starfield canvas
			var img=document.createElement("img");
          	img.src=background.toDataURL();
           	return(img);
        }

function star(c, x, y, r, p, m)
{
    c.save();
    c.beginPath();
    c.translate(x, y);
    c.moveTo(0,0-r);
    for (var i = 0; i < p; i++)
    {
        c.rotate(Math.PI / p);
        c.lineTo(0, 0 - (r*m));
        c.rotate(Math.PI / p);
        c.lineTo(0, 0 - r);
    }
	c.fillStyle = "gold";
    c.fill();
    c.restore();
}

function paintBck() { 
    if(Bck==false){
		bkCtx.fillStyle = "rgba(0,0,0," + 0.4 + ")"; 
		bkCtx.fillRect(0, 0, W, H);
		Bck=true; 
	}
}
		
//Start
startWindow();