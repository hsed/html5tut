// JavaScript Document
//Navigation Helper created by Haaris Osman Mehmood v6.0
//Contains sample code and snippets from various programming websites

var sub = '';
var PageExists=new Boolean();
var BodyFontSize= 11;
var DisableHash = false;
var toggle = false;
var loc = location.pathname.split('/').pop(); //Name of file including .html
var sender;

//INIT FUNCTIONS START ----------------------------------------------------------------------------->>
function Init() {
  InitSettings();
  
  //Side-Menu Bar
  document.querySelector( "#nav-toggle" ).addEventListener( "click", function() {
    	this.classList.toggle( 'active' );
		document.querySelector('#main-nav').classList.toggle('active');
  });
  document.querySelector( ".md-trigger" ).addEventListener( "click", function() {
		document.querySelector(".md-settings").classList.toggle('md-show');
  });
  
  //Hashtag Handler
  window.onhashchange=HashSrc;
  if(window.location.hash!=''||window.location.hash!='#'){HashSrc();}
  
  //Init Time
  setTimeout(function(){ document.getElementById('DivTime').innerHTML=flash; }, 500);
  
  //Final Init
  if(loc != 'loader.html' && loc.indexOf('quiz') === -1) {
	  setTimeout(function() {
		  MonitorSlide();
		  Verify();
		  BkgSnd();
	  }, 1000);
  }
  else if(loc.indexOf('quiz') === -1) {
	  draw();
	  if (localStorage.anim == false) disdel = setTimeout(function() { cancelRequestAnimFrame(init); }, 10000); 
	  setTimeout(function(){Process(); document.body.classList.add('loaded');}, 500);
  } //All stuff to be done only on homepage
	
}


//INIT FUNCTIONS END ----------------------------------------------------------------------------->>

//MAIN OR NAV FUNCTIONS START ----------------------------------------------------------------------------->>
function HashSrc(e) {
	if(DisableHash){DisableHash=false; return;}
	var hash = window.location.hash.substring(1);
	var slash = '\\'
	if(hash!="" && hash.indexOf('\\')===-1){
		//e.preventDefault(); //Not required as everything is one page view
		var path = window.location.pathname;
		var sect = path.substring(path.lastIndexOf('/') + 1).split('.html')[0];
		var pg = (/\d+$/.test(hash)) ? parseInt(hash.match(/\d+$/)[0]) : '';
		sub = (/\d+$/.test(hash)) ? hash.slice(0, -((pg>=10) ? 2 : 1)) : hash;	
		
		var player = document.getElementById('reveal').animate(
		[ {opacity: 1}, {opacity: 0} ], {duration: 500, fill: 'forwards'}
);

	player.onfinish = function(e) {
 		loadXMLDoc(document.getElementById('reveal'), sect + '/' + sub + '.html', pg);
		setTimeout(function() {document.getElementById('reveal').animate(
			[ {opacity: 0},	{opacity: 1} ], {duration: 500, fill: 'forwards'}
		);
		}, 200);
	}
		console.log(sect + ' ' + sub + ' ' + pg);
		//loadXMLDoc(document.getElementById('reveal'), sect + '/' + sub + '.html', pg);
		//if pageno then change hash 
	}
}
//MAIN OR NAV FUNCTIONS END ----------------------------------------------------------------------------->>


//MISC FUNCT START---------------------------------->
function ChangeBkg(val) {
	//Use for new theme functions
	document.querySelector('span.cs-placeholder').style.backgroundImage = 'url(../../img/style/th'+val+'.gif)';
    document.querySelector('span.cs-placeholder').innerHTML = val;
	
	if (+localStorage.theme != val) return; //Exit function if settings not yet saved.
	
	var oldBkg = document.querySelector('.page-wrap').classList[1]; //Always the second classname
	if(oldBkg != null && oldBkg.split('bkg').pop() != val) {
		document.querySelector('.page-wrap').classList.remove(oldBkg);
		document.querySelector('.page-wrap').classList.add('bkg' + +val);
		document.querySelector('.main-nav').classList.add('bkg' + +val);
	}
	
	if (val > 4) {localStorage.opacity = 1;}
	else if(localStorage.opacity == 1) {localStorage.opacity = 0.5};
}


function InitSettings() {
	//Load or define default settings
	var settings = { 
		'name': '',
		'theme': '1',
		'opacity': '1',
		'lfont': 0,
		'mute': 0,
		'anim': 1, 
		'lvl': -1, 
		'lastmain': 'html5',
		'lastsub': '',
		'useva': 1,
		'set': 0
		};
	var name = Object.keys(settings); //Get each settings key only in an array
	for(var i = 0; i < name.length; i++) { //Set defaults if settings do not exsist
		if(!localStorage.getItem(name[i])) {localStorage.setItem(name[i], settings[name[i]]);}
	}
	if (localStorage.lvl < 3 && localStorage.useva == true && +localStorage.set != -1 && loc.indexOf('quiz') === -1) 
	{Notify("You can access the main menu by clicking on the 3-stripes icon in the top-left corner.", 8);}
	if (loc.indexOf('quiz') !== -1) return;//Do not proceed if on loader screen or quiz
	//Setup controls to reflect current settings
	//if(document.contains(document.querySelector('#mutetgl'))) <--not needed but useful
	document.querySelector('#nametb').value = localStorage.name;
	
	
	//theme settings here
	function toggleSelect() { document.querySelector('.cs-select').classList.toggle('cs-active'); }
	document.querySelector('.cs-placeholder').addEventListener( 'click', function() {toggleSelect();} );
	
	var liarr = document.querySelectorAll('.cs-options ul li');
	for(var i = 0; i < liarr.length; i++) { 
		liarr[i].addEventListener( 'click', function() {
			//alert(this.getAttribute('data-value'));
			ChangeBkg(this.getAttribute('data-value'));
			toggleSelect();
		 });
	}
	
	if(loc != 'loader.html') ChangeBkg(localStorage.theme);
	
	//Slider
	var item = document.getElementById('opacitysld');
	item.onchange = function () {
	value = (item.value - item.min)/(item.max - item.min)
	item.style.backgroundImage = [
		'-webkit-gradient(',
		'linear, ',
		'left top, ',
		'right top, ',
		'color-stop(' + value + ', #2BC037), ',
		'color-stop(' + value + ', #b8b7b8)',
	')'
	].join('');};
	document.querySelector('#opacitysld').value = (1 - +localStorage.opacity) * 100;
	document.querySelector('#main-header').style.background = ((localStorage.theme == 4 || localStorage.theme == 5) && loc != 'loader.html') ?     'rgba(243, 156, 18, ' + +localStorage.opacity + ')' : 'rgba(0, 112, 52, ' + +localStorage.opacity + ')';
	document.querySelector('#opacitysld').onchange();
	//document.querySelector('#DivContent').opacity = localStorage.opacity;
	
	
	
	document.querySelector('#fonttgl').checked = +localStorage.lfont;
	if (+localStorage.lfont == true) {
		//document.querySelector('.slides').style.zoom = +zoom + 0.3;
		//document.querySelector('.main-header').classList.remove('fade');
		Reveal.initialize({slideNumber: true, progress: true, width: 1280, height: 600});
		document.querySelector('.reveal').style.top = '-5%';
		document.querySelector('.main-header').classList.add('fade');
		document.querySelector('.font-toggle').classList.add('show');
	}
	
	document.querySelector('#mutetgl').checked = +localStorage.mute;
	
	document.querySelector('#animtgl').checked = +localStorage.anim;
	if (+localStorage.anim == false) {
		document.querySelector('.HeadingTxt').style.webkitAnimation = 'none';	
	}
	
	
	
	//Button Event Handlers
	document.querySelector( "#savebtn" ).addEventListener( "click", function() {
		ToggleSettings()
		SaveSettings();
		setTimeout(function() {window.location.reload();}, 500);
 	});
  	document.querySelector( "#discardbtn" ).addEventListener( "click", function() {
	  	ToggleSettings()
		//setTimeout(InitSettings, 1000); Auto-revert settings back to normal currently buggy
  	});
  	document.querySelector( "#resetbtn" ).addEventListener( "click", function() {
		var reply = confirm("Are you sure you want to reset settings?\nALL PROGRESS WILL BE LOST!");
		if (reply == true) {
   			ToggleSettings()
			setTimeout(function() {localStorage.clear(); localStorage.setItem('set', -1); window.location.reload();}, 500);
		} 
		else {
    		ToggleSettings()
		}
  	});
	
	if (+localStorage.set == 1) Notify("Your settings were saved and applied successfully.", 3);
	if (+localStorage.set == -1) Notify("All settings have been reset to default values.", 3);
	if (+localStorage.set != 0) localStorage.set = 0;
	if(+localStorage.lfont == 1) {
		setTimeout(function() {Notify("You can return back to normal view at any time by clicking the arrow in the top-left corner.", 5)} , 3500);
		setTimeout(function() {Notify("Click <a href='#' onClick='document.documentElement.webkitRequestFullscreen();'>here</a> to view this product in fullscreen.",5)} , 9000);
	}
}

function SaveSettings() {
	//Save all settings on exit	
	localStorage.name = document.querySelector('#nametb').value;
	localStorage.theme = document.querySelector('.cs-placeholder').innerHTML;
	localStorage.opacity = (1 - (+document.querySelector('#opacitysld').value / 100));
	localStorage.lfont = +document.querySelector('#fonttgl').checked;
	localStorage.mute = +document.querySelector('#mutetgl').checked;
	localStorage.anim = +document.querySelector('#animtgl').checked;
	localStorage.set = 1;
	//alert('setting: ' + document.querySelector('#opacitysld').value + '    storage: ' + localStorage.opacity );
}

function ToggleSettings() {
	document.querySelector(".md-settings").classList.toggle('md-show');
	document.querySelector( "#nav-toggle" ).classList.remove( 'active' );
	document.querySelector('#main-nav').classList.remove('active');
	setTimeout(function() {
			document.querySelector(".md-settings").classList.toggle('md-effect-13');
			document.querySelector(".md-settings").classList.toggle('md-effect-8');
	}, 300);
}

function MonitorSlide() {
	Reveal.addEventListener( 'slidechanged', 
	function( event ) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
		if (event.currentSlide.id == 'end-slide') {
			console.log("End of tutorial");
			var info = JSON.parse(document.getElementById('tutinfo').innerHTML);
			console.log('newlvl: ' + info.newlvl + '   lvl: ' + localStorage.lvl);
			if((+info.newlvl - +localStorage.lvl) >= 1 && localStorage.useva == true) {
				lvl = +info.newlvl;
				console.log("New Level: " + lvl);
				setTimeout(function() {
					//OPEN VA IN NEW POP UP RESIZED WINDOW NOT WITHIN THE CURRENT PAGE...
					//THEN LET IT AUTOCLOSE WHEN DONE
					var va = window.open('../va/va.html','targetWindow','toolbar=no, location=no, status=no, menubar=no,                    scrollbars=no, resizable=no, width=450, height=600');
					setTimeout(function() {va.postMessage('lvl|' + info.newlvl, '*');}, 2000);
					//loadXMLDoc(document.getElementById('reveal'), '../va/va.html', '' , false, false, true)
				}, 1000);
			} 
			else {
				  //load directly, only need to change hash cause VA is a must on section change
				  setTimeout(function() {window.location.hash = '#' + info.newurl}, 500);
				}
		};
	}
	);	
}

function Verify() {
	var info = JSON.parse(document.getElementById('tutinfo').innerHTML);
	//console.log(reqlvl + ' ' + localStorage.lvl);
	if(localStorage.useva == true) {
		if(+info.newlvl - +localStorage.lvl > 1) {
			loadXMLDoc(document.getElementById('reveal'), '../va/disable.html', '', false, false, false)
			}
		else {
			localStorage.lastmain = info.sect;
			localStorage.lastsub = info.url;
		}
	}
}

function DisableVA() {
	var p = prompt("Please enter the password to perform this action.\nSee the teacher's guide for help.");
	if (p != null && p == 'ICT@WGA') {
    	localStorage.useva = 0;
		alert("The Virtual Assistant has now been disabled, the page will now refresh.");
		window.location.reload();
	}
	else if(p != null) {
		alert('Wrong password, please try again!');
		DisableVA();
		return;
	}
	
}
//MISC FUNCT END---------------------------------->

//HELPER FUNC START------------------------------------------------------------------------------->>
// RequestAnimFrame: a browser API for getting smooth animations Callback: 30fps-----------------------------> 
window.requestAnimFrame = (function(){ return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
function( callback ){ return window.setTimeout(callback, 1000 / 30); }; })();

window.cancelRequestAnimFrame = ( function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();
//Req End------------------------------------------------------------------------------->>

window.onmessage = function(e){
 //var type = 0 //0=va, 1=quizpass --> {1=100%, 0= <100% && >50%, -1= <50%}, 2=xmlload, 3=reserved
 var msg = event.data

 console.log('Data Recieved: ' + msg + '	Self: ' + window.location);
 if (msg.indexOf('lvl') >= 0) {sender = event.source; initlvl = false; lvl = msg.split('|').pop(); return;}
 if (msg.indexOf('pass') >= 0) {
	 sender = event.source;
	 initlvl = false;
	 lvl = msg.split('|').pop();
	 document.getElementById("tb").disabled = true; 
	 document.getElementById("tb").value = msg.split('|')[1]; 
	 return;
 }
 if (msg.indexOf('bkg') >= 0) {localStorage.theme = msg.split('|').pop();}
 if (msg.indexOf('goto') >= 0) {window.location = msg.split('|').pop();}
 // var size = event.data + 'pt';
 
}

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
  return '-' + pre + '-';
})();

document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
		//Most of this is handled by Reveal
		case 37: // Left --> Next Page
		//if (pageno>1) {window.location.hash = '#' + sub + (pageno-1);}
        break;

        case 38: // Up --> First Page
		//if (pageno>1) {window.location.hash = '#' + sub + 1;}
        break;

        case 39: // Right --> Prev Page
		//if (pageno<maxpageno) {window.location.hash = '#' + sub + (pageno+1);}
        break;

        case 40: // Down --> Last Page
        //if (pageno<maxpageno) {window.location.hash = '#' + sub + maxpageno;}
		break;

		case 13: // Enter --> For VA
        document.getElementById('btn').click()
		break;
		
		//case 72: // H --> Goto Home
        //document.getElementById('Home').click()
		//break;
		
		case 73: // I --> Open Settings
		if (e.ctrlKey) {
			document.querySelector(".md-settings").classList.toggle('md-show');
			setTimeout(function() {
				document.querySelector(".md-settings").classList.toggle('md-effect-13');
				document.querySelector(".md-settings").classList.toggle('md-effect-8');
			}, 700);
		}
		break;
		
        default: return; // Exit Handler If Any Other Key
    }
    //e.preventDefault(); // Prevent Default Action (DISABLED)
}


function loadXMLDoc(el, url, pg, rev, ver, va, pp) { //el=The element to parse content to, url=The RELATIVE url of the new content.
	pg = (typeof pg === "undefined") ? '' : pg;
	rev = (typeof rev === "undefined") ? true : rev;
	ver = (typeof ver === "undefined") ? true : ver;
	va = (typeof va === "undefined") ? false : va;
	pp = (typeof pp === "undefined") ? true : pp;
	
	var xmlhttp;
	if (window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}
	xmlhttp.onreadystatechange=function()  {
	if (xmlhttp.readyState==4) //if (xmlhttp.readyState==4 && xmlhttp.status==200)
    	{
			if(xmlhttp.responseText == '') {
				alert("Cannot load! Please make sure that Chrome is allowed 'file-access' (see user guide).");
				return;
			};
			console.log("Document loaded from: " + url);
    		el.innerHTML=xmlhttp.responseText;
			if (pg != '') {setTimeout(function() {window.location.hash = "\\" + pg}, 1500)}
			if (rev) {Reveal.initialize({slideNumber: true, progress: true, keyboard: {27:null}}); ZoomFix(); InitPics();}
			if (ver) {setTimeout(Verify, 1000);}
			if (va)  {setTimeout(function() {Process(); LoadObj();}, 1000);}
			if (pp)  {setTimeout(prettyPrint, 1000);}
			window.location.hash = '#';
    	}
  	}
	xmlhttp.open("GET", url, true); //example: url="html5/auct/auct1.html"
	xmlhttp.send();
}

function InitPics() {
	var imgarr = document.querySelectorAll('.imgbox img');
	var imgboxarr = document.querySelectorAll('.imgbox');
	for(var i = 0; i < imgarr.length; i++) { 
		imgboxarr[i].addEventListener( 'click', function() {
			if(this.classList.contains('zoom')) return;
			if(localStorage.lfont == 1) {Notify("Zoomed-in images are only allowed in normal view."); return;}
			
			this.classList.toggle('zoom');	
			
 			var img = this.querySelector('img'); //Select the image of a zoomed placeholder
			
			this.style.width = img.naturalWidth + 'px';
 			this.style.height = img.naturalHeight + 'px';
 			this.style.marginTop = '-' + (+img.naturalHeight/2 + +30.5) + 'px';
 			this.style.marginLeft = '-' + (+img.naturalWidth/2 + +0.5) + 'px';
 				
			this.querySelector('.details').innerHTML = "<h5>" + img.title + "</h5>";
            document.querySelector('#FadeDiv').classList.toggle('fade');
			document.querySelector('#main-header').classList.toggle('fade');;
			
			ZoomFix()
			img.title = '';
			setTimeout(function() {document.addEventListener( 'click', ResetPic, false);}, 1000);
		 });
	}	
}


function ResetPic(e) {
	var xPos = e.clientX
	var yPos = e.clientY;			 
				 
	var img = document.querySelector('.imgbox.zoom img');
	var imgbox = document.querySelector('.imgbox.zoom');
	var detbox = document.querySelector('.imgbox.zoom .details h5');
	
	var r = imgbox.getBoundingClientRect();
	if (xPos >= r.left && xPos <= (r.width + r.left) && yPos >= r.top && yPos <= (r.height + r.top)) return; //img clicked
	
	document.removeEventListener( 'click', ResetPic, false);
	img.title = detbox.innerHTML;
 	detbox.innerHTML = "Click to zoom";
 	document.getElementById('FadeDiv').classList.toggle('fade');
 	document.getElementById('main-header').classList.toggle('fade');
 
 	imgbox.style.width= "";
 	imgbox.style.height = "";
	imgbox.style.marginTop = "";
	imgbox.style.marginLeft = "";
	imgbox.style.zoom = "";
	
	imgbox.classList.toggle('zoom');
}
	
function BkgSnd() {
	if (localStorage.mute == true) return;
	var snd = document.getElementById("bkgsnd");
	var sndFile = document.getElementById("bkgsnd-src");
	var str = "../../mp3/bkg";
	var end = ".mp3";
	var array = [1,2,3,4,5,6];
	var rndarr = Shuffle(array);
	var pos = 1;
	var vol = 0.3;
	
	snd.volume = vol;
	sndFile.src = str + array[0] + end;
	snd.load();
	
	snd.onended = function() {
								pos++;
								if (pos <= 6) {
									sndFile.src = str + array[pos] + end;
									snd.load();
									}
								else {return};
							}
							
	//snd.play(), snd.pause(), snd.currentTime += 10, snd.volume = 0.2;
}

function ToggleSnd() {
	var snd = document.getElementById("bkgsnd");
	
	if (snd.duration > 0 && !snd.paused && localStorage.mute == false) { snd.pause(); } 
	else if (snd.duration > 0 && snd.paused && localStorage.mute == false) {  snd.play(); }
}

function Shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

window.onresize = function() {
	(loc == 'loader.html') ? ResizeMatrix() : ZoomFix(); 
	}

function ZoomFix(){
	if(document.contains(document.querySelector('.slides')))
	//Fix dimensions of any video elements found
	setTimeout(function() {
		var vidarr = document.getElementsByTagName('video');
		var zoom = document.querySelector('.slides').style.zoom;
		if (zoom <= 1) {
			for(var i = 0; i < vidarr.length; i++) {
				vidarr[i].style.zoom = (1 / zoom);
			}
			
			if(document.contains(document.querySelector('.imgbox.zoom'))) {
				document.querySelector('.imgbox.zoom').style.zoom = (1 / zoom);
 
			}
		}
	}, 50);
	
}

function Notify(msg, ttl) {
	msg = (typeof msg === "undefined") ? 'Sample Text' : msg;
	ttl = (typeof ttl === "undefined") ? 3000 : +ttl * 1000;
	// create the notification
	var notification = new NotificationFx({
		wrapper : document.querySelector('.page-wrap'),
		message : msg,
		layout : 'growl',
		effect : 'genie',
		type : 'notice', // notice, warning or error
		ttl : +ttl
		});

	// show the notification
	notification.show();
	
	//play sound
	if (localStorage.mute == false) document.getElementById('notsnd').play();
	
}

function RsrcDownload() {
	if (localStorage.useva == false) { 
		Notify("ERROR: Please enable VA to gain access.", 2)
	}
	if (localStorage.lvl < 8 && localStorage.useva == true) { 
		Notify("This section is only available after you have completed all tutorials.", 5)
	}
	if (localStorage.lvl >= 8 && localStorage.useva == true) {
		Notify("A zip file containing resources from all of the tutorials has been downloaded.<br><br>" +
			   "The password to access the files is: <strong>ICT@WGA</strong>", 60);
		window.location = (loc == 'loader.html') ? 'content/rsrc/rsrc.zip':'../../content/rsrc/rsrc.zip';
	}
}
//HELPER END--------------------------------------------------------------------------------------------->>



