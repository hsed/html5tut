// Virtual Assistant BackEnd Engine v0.40-a
//Created by Haaris Osman Mehmood
var name = "";
var lvl = -1;
var positive = /(y|yes|yeah|cool|good|great|fine|wonderful|thank|happy|joy)/i
var neutral = /(alright|ok|maybe|think|not sure|don't know|dont know|um)/i
var negative = /(n|no|never|bad|worse|cant|dont|can't|don't|not|sad|depressed)/i
var initlvl = true;
var text = "";
var delay = 50;
var currentChar = 1;
var destination="";

function Process(){
	var txt = document.getElementById("tb") || "";
	var lbl = document.getElementById("lbl");
	if(txt == "" && window.location.href.indexOf("index.html") == -1) {initlvl = false; return;} //Do not initialize settings load if not in index file
	input = txt.value
	var mood = CheckMood(input); //-1 == NEGATIVE, 0 == NEUTRAL, 1 == POSITIVE
	
	if(localStorage.name && initlvl) {lvl = -3;}
	if(localStorage.useva == false && initlvl) {lvl = -5;}
	initlvl = false;
	
	console.log('Mood: ' + mood + '     Level: ' + lvl);
	switch(+lvl) {
		case -5: 
			Speak("I have been disabled, please enter 'YES' to enable me.")
    		lvl++;
			break;
		case -4:
			switch(mood) {
				case 1:
					Speak("Now reloading..");
					localStorage.useva = 1;
					setTimeout(function() {window.location.reload()}, 3000);
					return;
				case 0:
					Speak("I didn't catch that.");
					return;
				case -1:
					Speak("OK :(");
					txt.value = '';
					return;
			}
			break;
		case -3: 
			Speak("Welcome back " + localStorage.name + ", continue from where you left off?")
			Gesture(0.4167, 2.4167, 2);
    		lvl++;
			break;
		case -2:
			switch(mood) {
				case 1:
					Speak("Resuming..");
					lvl = localStorage.lvl - 1; //+1 after this code
					if (lvl >= 3) {
					setTimeout(function() {window.location = 'content/tut/' + localStorage.lastmain + '.html#'  + localStorage.lastsub}, 3000);}
					else {setTimeout(Process, 2000);}
					break;
				case 0:
					Speak("Pardon?");
					break;
				case -1:
					Speak("Resetting in 10 seconds, ALL PROGRESS WILL BE LOST!");
					Gesture(4.4167, 5.4167, 1); //left
					setTimeout(function() {Gesture(5.4167, 6.9167, 1);}, 1000) //right
					setTimeout(function() {localStorage.clear(); window.location.reload();}, 10000);
					break;
			}
			lvl++;
			break;	
		case -1:
			Speak("Hello I'm Anna, please enter your name to continue.");
			Gesture(0.4167, 2.4167, 2);
    		lvl = 0;
			break;
		case 0:
			localStorage.name = input.charAt(0).toUpperCase() + input.slice(1);
			Speak("So " + localStorage.name + ", how do you do?");
			Gesture(5.4167, 6.9167, 1);
    		lvl++;
			break;
		case 1:
			switch(mood) {
				case 1:
					Speak("That's nice to hear!");
					break;
				case 0:
					Speak("Be positive!");
					break;
				case -1:
					Speak("Cheer up!");
					break;
				case -2:
					//Speak("Sorry, but my vocabulary is very limited. :(");
					break;
			}
			if (mood != -2) Gesture(4.4167, 5.4167, 1); //left
			lvl++;
			setTimeout(function() {
					Speak("Are you familiar with HTML tags? Please be honest.")
					Gesture(5.4167, 6.9167, 1); //right
					setTimeout(function() {Gesture(4.4167, 5.4167, 1);}, 1500); //left
				},3000);
			break;
		case 2:
			switch(mood) {
				case 1: //skip intro confirmation
					Speak("So, do you want to skip the Basics of HTML?");
					Gesture(2.4167, 3.4167, 1); //yes
					break;
				case 0:
					Speak("Is it a yes or no? Well I'll assume that was a no.");
					Gesture(6.9167, 8.41667, 1)
					setTimeout(function() {window.location = 'content/tut/html5.html'}, 4000);
					break;
				case -1: //Show Intro, don't skip it
					Speak("Don't worry I've got a easy to understand tutorial coming up!");
					Gesture(3.4167, 4.3567, 2); //no
					setTimeout(function() {window.location = 'content/tut/html5.html'}, 4000);
					break;
				case -2: //Fallback to level 1 if loaded from here
					Speak("Please wait...");
					lvl-= 2; //2-2+1 = 1 
					setTimeout(Process, 2000);
			}
			lvl++;
			break;	
		case 3:
			switch(mood) {
				case 1: //Definately Familiar with HTML Tags
					Speak("Let's recap with a short quiz then!");
					setTimeout(function() {window.location = 'content/quiz/quiz.html'},4000);
					//Show()
					break;
				case 0:
					Speak("Is it a yes or no? Well I'll assume that was a no.");
					setTimeout(function() {window.location = 'content/tut/html5.html'}, 4000);
					break;
				case -1: //Dont want to skip intro
					Speak("Don't worry, I've got a easy to understand tutorial coming up!");
					setTimeout(function() {window.location = 'content/tut/html5.html'}, 3000);
					break;
				case -2: //Fallback to level 1 if loaded from here
					Speak("I'm having a hiccup...");
					lvl-= 2; //2-2+1 = 1 
					setTimeout(Process, 2000);
			}
			Gesture(5.4167, 6.9167, 1); //right
			break;
		case 4: //After first tutorial --> Intro to html 
			Speak("So " + localStorage.name + ", how was your first tutorial?");
			Gesture(5.4167, 6.9167, 1); //right
			lvl++;
			break;
		case 5:
			switch(mood) {
				case 1: //Understood Basics --> Goto 1st quiz
					Speak("Let's recap with a short quiz!");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("I hope you'll like the others; let's take a quiz now.");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					break;
				case -1: //Repeat the tutorial
					Speak("Don't worry, I'll redirect you back to the intro.");
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html', '*'); window.close();},3000);
					break;
			}
			Gesture(4.4167, 5.4167, 1); //left
			lvl = 3;
			break;
		case 6:
			switch(mood) {
				case 1: //Understood Basics --> Goto 1st quiz
					Speak("Congratulations on a 100%! Get ready for your next tutorial.");
					Gesture(6.9167, 8.41667, 1) //suprised
					setTimeout(function() {Gesture(2.4167, 3.4167, 1);}, 1500) //yes
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html#intro', '*'); window.close();},6000);
					lvl = 8;
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("You passed but can do better. Want to retry?");
					Gesture(2.4167, 3.4167, 1); //yes
					setTimeout(function() {Gesture(5.4167, 6.9167, 1);}, 1000) //right
					lvl = 7
					break;
				case -1: //Repeat the tutorial
					Speak("You failed! You must repeat the tutorial now.");
					Gesture(3.4167, 4.3567, 2); //no
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html', '*'); window.close();},6000);
					lvl = 3;
					break;
			}
			break;
		case 7:
			switch(mood) {
				case 1: //Repeat the quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 3;
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 3;
					break;
				case -1: //Goto next tutorial/answer view, dont wanna repeat
					Speak("Get ready for your next tutorial.");
					Gesture(4.4167, 5.4167, 1); //left
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html#intro', '*'); window.close();},3000);
					lvl = 8;
					break;
			}
			break;
		case 8: //Standby as no purpose
			break;
		case 9: //After last tutorial --> Intro to html 
			Speak("Honestly, I find these tutorials very tiring!");
			Gesture(5.4167, 6.9167, 1); //right
			setTimeout(function() {
				Speak("Well, are you confident enough in HTML5?"); 
				Gesture(4.4167, 5.4167, 1);}, 4000)
			lvl++;
			break;
		case 10:
			switch(mood) {
				case 1: //Understood Basics --> Goto 2nd quiz
					Speak("Let's find out.. ;)");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					break;
				case 0: //Understood Basics --> Goto 2nd quiz
					Speak("Don't worry, you'll do good.");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					break;
				case -1: //Repeat the tutorial
					Speak("No worries, you can view the tutorials again.");
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html#intro', '*'); window.close();},3000);
					break;
			}
			Gesture(4.4167, 5.4167, 1); //left
			lvl = 8;
			break;
		case 11:
			switch(mood) {
				case 1: //Understood Basics --> Goto 1st quiz
					Speak("Congratulations on a 100%! Get ready for your next tutorial.");
					Gesture(6.9167, 8.41667, 1) //suprised
					setTimeout(function() {Gesture(2.4167, 3.4167, 1);}, 1500) //yes
					setTimeout(function() {sender.postMessage('goto|../tut/css3.html', '*'); window.close();}, 6000);
					localStorage.theme = 5;
					lvl = 13; //Standby
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("You passed but can do better. Want to retry?");
					Gesture(2.4167, 3.4167, 1); //yes
					setTimeout(function() {Gesture(5.4167, 6.9167, 1);}, 1000) //right
					lvl = 12;
					break;
				case -1: //Repeat the tutorial
					Speak("You failed! You must repeat the HTML5 section now.");
					Gesture(3.4167, 4.3567, 2); //no
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html#intro', '*'); window.close();}, 6000);
					lvl = 8;
					break;
			}
			break;
		case 12:
			switch(mood) {
				case 1: //Repeat the quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 8;
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 8;
					break;
				case -1: //Goto next tutorial/answer view, dont wanna repeat
					Speak("Get ready for your next tutorial.");
					Gesture(4.4167, 5.4167, 1); //left
					setTimeout(function() {sender.postMessage('goto|../tut/css3.html', '*'); window.close();},3000);
					localStorage.theme = 5;
					lvl = 13;
					break;
			}
			break;
		case 13: //Standby after starting CSS3 section
			break;
		case 14: //After last tutorial --> Intro to html 
			Speak("Nice to see you again " + localStorage.name + "!");
			Gesture(5.4167, 6.9167, 1); //right
			setTimeout(function() {
				Speak("Were you able to follow and understand these tutorials?"); 
				Gesture(4.4167, 5.4167, 1);}, 3000)
			lvl++;
			break;
		case 15:
			switch(mood) {
				case 1: //Understood Basics --> Goto 3rd quiz
					Speak("Let's test your true calibre.");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz2.html', '*'); window.close();},3000);
					break;
				case 0: //Understood Basics --> Goto 3rd quiz
					Speak("Don't worry, be confident in yourself!");
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz2.html', '*'); window.close();},3000);
					break;
				case -1: //Repeat the tutorial
					Speak("Well then, have a look at the CSS3 section again.");
					setTimeout(function() {sender.postMessage('goto|../tut/css3.html', '*'); window.close();},3000);
					break;
			}
			Gesture(4.4167, 5.4167, 1); //left
			lvl = 13;
			break;
		case 16:
			switch(mood) {
				case 1: //Understood Basics --> Goto 1st quiz
					Speak("Congratulations on a 100%!");
					Gesture(6.9167, 8.41667, 1) //suprised
					setTimeout(function() {
						Speak("Hats off to you " + localStorage.name+"! You have successfully completed all of the tutorials.");
						Gesture(2.4167, 3.4167, 1);}, 3000) //yes
					setTimeout(function() {
						Speak("Try out the Resources section, I'll redirect you to the home page.");
						Gesture(4.4167, 5.4167, 1);}, 6000) //yes	
					setTimeout(function() {sender.postMessage('goto|../../loader.html', '*'); window.close();}, 12000);
					lvl = 18; //Standby
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("You passed but can do better. Want to retry?");
					Gesture(2.4167, 3.4167, 1); //yes
					setTimeout(function() {Gesture(5.4167, 6.9167, 1);}, 1000) //right
					lvl = 17;
					break;
				case -1: //Repeat the tutorial
					Speak("You failed! You must repeat the HTML5 section now.");
					Gesture(3.4167, 4.3567, 2); //no
					setTimeout(function() {sender.postMessage('goto|../tut/html5.html#intro', '*'); window.close();}, 6000);
					lvl = 13;
					break;
			}
			break;
		case 17:
			switch(mood) {
				case 1: //Repeat the quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 8;
					break;
				case 0: //Understood Basics --> Goto 1st quiz
					Speak("Ok, better luck this time!");
					Gesture(2.4167, 3.4167, 1);
					setTimeout(function() {sender.postMessage('goto|../quiz/quiz.html', '*'); window.close();},3000);
					lvl = 8;
					break;
				case -1: //Goto next tutorial/answer view, dont wanna repeat
					Speak("Hats off to you " + localStorage.name+"! You have successfully completed all of the tutorials.");
					Gesture(4.4167, 5.4167, 1); //left
					setTimeout(function() {
						Speak("Try out the Resources section, I'll redirect you to the home page.");
						Gesture(4.4167, 5.4167, 1);}, 5000) //yes	
					setTimeout(function() {sender.postMessage('goto|../../loader.html', '*'); window.close();}, 12000);
					lvl = 18;
					break;
			}
			break;
		case 18: //Standby after finishing CSS3 section and CSS3 quiz
			break;
	}
	//if(mood == -2 && lvl > 1) {Speak("Sorry I did not get that.");} //<-- Required but buggy when loading
	txt.value = '';
	if(localStorage.lvl && lvl > -1) {localStorage.lvl = lvl;}
	//alert(lvl);
};
	
function Speak(message) {	
	var msg = new SpeechSynthesisUtterance(message);
	if (localStorage.mute == false) window.speechSynthesis.speak(msg);
	startTyping(message, 50, "lbl");
};

function CheckMood(str) {
	var type = -2;	//Default is cannot understand
	input = input.toLowerCase();
	if (positive.test(input)==true) {type = 1;}
	else {
		if (neutral.test(input)==true) {type = 0;}
			else {
				if (negative.test(input)==true) {type = -1;}
			};
	};
	return type;
};

function stopTimer () {
    Process(); //Contiue process after timer stopped
}

function type() //param with def vals
{
  if (document.getElementById)
  {
    var dest=document.getElementById(destination);
    if (dest)
    {
      dest.innerHTML='<p id="va">' + text.substr(0, currentChar) + '</p>';
      currentChar++
      if (currentChar>text.length)
      {
        currentChar=1;
      }
      else
      {
        setTimeout("type()", delay);
      }
    }
  }
}

function startTyping(textParam, delayParam, destinationParam)
{
  text=textParam;
  delay=delayParam;
  currentChar=1;
  destination=destinationParam;
  type();
}
//if (lvl == -1) {setTimeout(Process, 2000);}
