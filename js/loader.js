// JavaScript Document
var main = document.body;
var xmlhttp;

//if (localStorage.mute === 'undefined' || localStorage.mute == 0){snd.play();}


	if (window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}
	xmlhttp.onreadystatechange=function()  {
	if (xmlhttp.readyState==4) //if (xmlhttp.readyState==4 && xmlhttp.status==200)
    	{
			//console.log("Document loaded from: " + url);
    		//var dat = xmlhttp.responseText;
			if(xmlhttp.responseText == '') {
				alert("Cannot load!\nPlease make sure that Chrome is allowed 'file-access' (see user guide).");
				return;
			};
			var loc = xmlhttp.responseText.indexOf('<nav class="main-nav" id="main-nav">');
			var dat = xmlhttp.responseText.substring(loc, xmlhttp.responseText.length);
			
			//document.querySelector('.title').style.webkitAnimation = "_blank"; //Fix to prevent restart
			document.body.innerHTML += dat;
			setTimeout(function() {Preload();}, 800);
    	}
  	}
xmlhttp.open("GET", 'index.html', true); //example: url="html5/auct/auct1.html"

xmlhttp.send();



var script = [];
var scrurl = ['three.min.js', 'main.js', '3d.js', 'time.js', 'matrix.js', 'assist.js', 'notify.js'];
var i = 0;

function Preload() {
for (i = 0; i <= (scrurl.length - 1); i++) {
	script[i] = document.createElement('script');	
	script[i].type = 'text/javascript';
	script[i].src = 'js/' + scrurl[i]; 
	script[i].onload = function(){ Next(); };
		
}

i = 0;
main.appendChild(script[i]);

}

function Next() {
	//alert('next fired');
	i++;	
	if (i <= (scrurl.length - 1)) {main.appendChild(script[i])};
	
	if(i == scrurl.length) {
			LoadObj();
		}
}
