// JavaScript Document
var qSet1 = [
{
"q": "What is the full form of HTML?",
"ans1": "Hyper Text Markup Language",
"ans2": "Hyper Train Main Line",
"ans3": "Hyper Transform Markup Language"
},
{
"q": "Which tag format is correct?",
"ans1": "&lt;h1&gt;&lt;/h1&gt;",
"ans2": "&lt;h1/&gt;&lt;h1&gt;",
"ans3": "&lt;h1&gt;&lt;\h1&gt;"
},
{
"q": "Who founded the World Wide Web?",
"ans1": "Tim Berners",
"ans2": "Tim Cook",
"ans3": "Tim Burton"
},
{
"q": "Which tag is the most suitable parent of a header?",
"ans1": "Body",
"ans2": "Head",
"ans3": "Meta"
},
{
"q": "What is the correct content-type for a stylesheet?",
"ans1": "type='text/css'",
"ans2": "type='text/xml'",
"ans3": "type='text/txt'"
}
];

var qSet2 = [
{
"q": "What was not possible to do before HTML5?",
"ans1": "Play videos without plugins",
"ans2": "View images without plugins",
"ans3": "Use external plugins on a website"
},
{
"q": "Which tag is the most suitable container for graphics?",
"ans1": "Canvas",
"ans2": "Div",
"ans3": "Table"
},
{
"q": "What is the correct format of defining a video source?",
"ans1": "<x id='1' class='option' style='font-size:15px;'>&lt;video&gt;&lt;source src='vid.mp4'&gt;&lt;/video&gt;</x>",
"ans2": "<x id='2' class='option'style='font-size:15px;'>&lt;video&nbsp;src='vid.mp4'&gt;&lt;/video&gt;</x>",
"ans3": "<x id='3' class='option' style='font-size:15px;'>&lt;video&gt;&lt;src='vid.mp4'&gt;&lt;/video&gt;</x>"
},
{
"q": "Which tag is the most suitable parent of a title?",
"ans1": "Head",
"ans2": "Body",
"ans3": "Meta"
},
{
"q": "Which property name is used to define a tooltip?",
"ans1": "Title",
"ans2": "Tooltip",
"ans3": "Description"
}
];
var qSet3 = ['a','b','c','d','e'];

var qBank= (+localStorage.lvl < 8) ? qSet1 : qSet2; //Load set 1 if level less that 8 aka basics or load set 2
var qLock=false;
var qi=0;
var qTot=qBank.length;
var qPass =Math.round(0.5 * +qBank.length);
var score=0;
var isCSS=(location.pathname.split('/').pop()=='quiz2.html'); //Use dynamic if condition variable like above 
var dragSrcEl = null;
var array = [];
var myWindow;

function Compute() {
	for(i = 0; i < qTot; i++) {
		var rnd=Math.random()*3;
 		rnd=Math.ceil(rnd);
 		var opt1;
 		var opt2;
 		var opt3;
		
 		if(rnd==1){opt1=qBank[i].ans1, opt2=qBank[i].ans2, opt3=qBank[i].ans3;}
 		if(rnd==2){opt1=qBank[i].ans2, opt2=qBank[i].ans1, opt3=qBank[i].ans3;}
		if(rnd==3){opt1=qBank[i].ans3, opt2=qBank[i].ans2, opt3=qBank[i].ans1;}
		array.push(rnd);
		
		var qDivs = document.querySelectorAll(".question");
		qDivs[i].innerHTML = '<div class="questionText">'+qBank[i].q+'</div><div id="1" class="option">'+opt1+'</div><div id="2" class="option">'+opt2+'</div><div id="3" class="option">'+opt3+'</div>'
		
		document.querySelector('#progdiv').innerHTML = (qi + 1) + ' of ' + qTot;
	
	}
	
	
}

function ClickHandler(e)
{
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.className.match(/option/))
    {
	    if(target.id == array[qi]) { score++;}
		qi++;
		NextQ();
    }
}

function NextQ() {
	if (qi < qTot) {
	
		document.querySelectorAll( ".question" )[qi - 1].classList.toggle( "present" );
		document.querySelectorAll( ".question" )[qi - 1].classList.toggle( "past" );
	
		document.querySelectorAll( ".question" )[qi].classList.toggle( "present" );
		document.querySelectorAll( ".question" )[qi].classList.toggle( "future" );
		
		document.querySelector('#progdiv').innerHTML = (qi + 1) + ' of ' + qTot;
	}
	if (qi == 3 && isCSS) {
		var cols = document.querySelectorAll('#columns .column');
		[].forEach.call(cols, function(col) {
  			col.classList.toggle('hide');
    	});
		document.querySelector('#part').innerHTML = 'Part II';
		document.querySelectorAll('.questionText')[0].classList.toggle('hide');
		document.querySelectorAll('.questionText')[1].classList.toggle('hide');
	}
	if (qi >= qTot) {EndQuiz();}
}

function ShowAns() {
	var ansList = '<br><div class="answers"><h3 style="margin-left: -20px;">Answers</h3><ol>';
	if (isCSS) { 
		var hids = document.querySelectorAll('.column');
		document.querySelector('.maindiv').style.top = '60px';
		document.querySelector('#columns').classList.add('wide');
		[].forEach.call(hids, function(col) {
  		col.classList.remove('hide');
    	});
		ansList += '</ol></div>'
	} //EXPERIMENTAL SHOW ANS AS LINKS TO RESORCE
	else {
		document.querySelector('.maindiv').style.top = '20%';
		for(i = 0; i < qTot; i++) {
			ansList += '<li>' + qBank[i].ans1 + '</li>';
		}
		ansList += '</ol></div>'
	};
	document.querySelector('.maindiv').innerHTML += ansList
}


function DragInit() {
	//isCSS = true;	
	qTot = qSet3.length;
	
	var arr1 = Shuffle(qSet3.slice(0,3)); //Shuffle list
	var arr2 = Shuffle(qSet3.slice(3,5));
	  
	var cols = document.querySelectorAll('#columns .column');
	[].forEach.call(cols, function(col) {
  	col.addEventListener('dragstart', handleDragStart, false);
  	col.addEventListener('dragend', handleDragEnd, false);
    });

  	var qcols = document.querySelectorAll('.question .column');
  	[].forEach.call(qcols, function(qcol) {
  	qcol.addEventListener('dragenter', handleDragEnter, false);
  	qcol.addEventListener('dragover', handleDragOver, false);
  	qcol.addEventListener('dragleave', handleDragLeave, false);
  	qcol.addEventListener('dragend', handleDragEnd, false);
  	qcol.addEventListener('drop', handleDrop, false);
  	});
	
	for(var i = 0; i < arr1.length; i++) {
		document.querySelectorAll('#columns .column')[i].classList.add(arr1[i]);
	}
	for(j = i; j < (arr2.length + i); j++) { 
		document.querySelectorAll('#columns .column')[j].classList.add(arr2[(j-i)]);
		document.querySelectorAll('#columns .column')[j].classList.add('hide');
	}
}

function handleDragStart(e) {
  this.style.opacity = '0.4'; 
  this.style.transform = 'scale(0.8)';
   dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text', this.classList[1]);
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary to drop.
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}
function handleDragEnd(e) {
  this.style.opacity = '';
  this.style.transform = '';
}
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    
	this.classList.remove('over');
	this.classList.remove(this.classList[1]);
    this.classList.add(e.dataTransfer.getData('text'));
	if(e.dataTransfer.getData('text') == qSet3[qi]) { score++;}
	qi++;
	setTimeout(NextQ, 500);
  }

  return false;
}

function EndQuiz() {
	document.querySelector('.maindiv').innerHTML = '<div class="questionText"><h3>The quiz is over!</h3>Correct answers: '+score+ ' of ' + qTot +'</div><button id="finishbtn" class="">Finish Quiz</button>';
	
	var delay = 100;
	if (score >= qPass) {
		ShowAns();
		delay = (qTot * 2000) + 2000;
		
		var T = (delay / 1000) - 1;
		//T is time delay in seconds
		document.querySelector('.maindiv').innerHTML += "<div id='progdiv'></div>"
		var timer = setInterval(function() {
						T--;
						document.querySelector('#progdiv').innerHTML = 'Timeout: ' + T + 's';  	
						if (T == 0) { 
							clearInterval(timer);	
							document.querySelector('#progdiv').innerHTML = '';
							document.querySelector('#finishbtn').style.display = 'block';
						}
					}, 1000);
	}
	else {document.querySelector('#finishbtn').style.display = 'block';}
	
	var va;  
	var newlvl = (!isCSS) ? (+localStorage.lvl < 8) ? 6 : 11 : 16;	  
	
	document.querySelector('#finishbtn').addEventListener('click',function() {
		va = window.open('../va/va.html','targetWindow','toolbar=no, location=no, status=no, menubar=no,     	        scrollbars=no, resizable=no, width=450, height=600');
		delay = 2000;
		if (score == qTot) setTimeout(function() {va.postMessage('pass|good|' + newlvl, '*');}, delay);
		if (score >= qPass && score < qTot) setTimeout(function() {va.postMessage('pass|ok|' + newlvl, '*');},delay);
		if (score < qPass) setTimeout(function() {va.postMessage('pass|bad|' + newlvl, '*');}, delay);
		this.style.display = '';
	});
}


if (localStorage.useva == true && !isCSS) Compute(), document.body.addEventListener('click',ClickHandler,false);
if (localStorage.useva == true && isCSS) DragInit();
else if (localStorage.useva == false) {
	var reply = confirm("The quiz requires access to the Virtual Assistant.\nClick OK to enable it now.");
	if (reply == true) {
   			alert("Reloading in 3s...");
			localStorage.useva = 1;
		    setTimeout(function() {window.location.reload()}, 3000);
	} 
	else { alert('The window will now close.'); window.close(); }
	}; //enable virtual assistant using confirm dialog