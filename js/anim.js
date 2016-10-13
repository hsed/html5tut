/* Original Filename: animations.js */
/* Copyright © Microsoft Corporation. All Rights Reserved. */
/* Demo Author: Charilaos "Harris" Papadopoulos, Microsoft Corporation */
/* EDITED VERSION BY HAARIS */

/*
This script (FullPageAnimations.js) and the accompanying CSS file (FullPageAnimationsPrefixed.js)
can be used to easily and transparently add full-page animations to your webcontent. The functionality
behind this script is explained in the IE Test Drive demo.

To use, include FullPageAnimations.js in your HTML file (preferably right at the beginning of <body> as
explained in the Test Drive Demo). You do not need to include FullPageAnimationsPrefixed.css, just make sure
that XHRCSSFiles() can get to it so it can be appropriately vendor-prefixed.

This script exposes a few functions to provide you with more fine-grained control over triggering animations.


----SetupBodyBringToViewAnimation(animationName): This function will attach an animation to the <body> element.
If animationName is not passed, then it will randomly select an animation from the BringToViewAnimations array.

----TriggerBodyRemoveFromViewAnimation(action, animationName): This function will trigger animationName (or choose an
animation from the RemoveFromViewAnimations array). At the end of the animation, it will change window.location.href
to action, thus trigerring a navigation. Add this function as an onclick event to your document's elements to trigger
transitions.

----SetPerspectiveForHTMLTag(perspectiveValue): This function will set a perspective value on the HTML element which is
going to be used by your browser for projective transforms (in 3D).

----AddBodyClickListener(): This function will add a listener for clicks on the <body> element. As a result, all clicks
will be originally handled by our listener function. If a click is detected on an anchor, or an element that is under an
anchor, and the click target DOES NOT have an onclick event, then it will call TriggerBodyRemoveFromViewAnimation() 
with a random animation and the anchor's href as the action. Use this to easily add transitions to all anchors in your document.
*/



//--------------------------BEGIN HELPERS-------------------------------//

// Helper for adding an event listener to an element
function addListener(obj, eventName, listener, capture) {
	if (obj.addEventListener) {
		obj.addEventListener(eventName, listener, capture);
	} else {
		obj.attachEvent("on" + eventName, listener, capture);
	}
}


var animationName;
var transformName;
var perspectiveName;
var animationStartName;
var animationIterationName;
var animationEndName;

// Simple function used to detect support for properties from a list of strings

var FirstSupportedPropertyName = function(prefixedPropertyNames) {
	var tempDiv = document.createElement("div");
	for (var i = 0; i < prefixedPropertyNames.length; ++i) {
		if (typeof tempDiv.style[prefixedPropertyNames[i]] != 'undefined')
			return prefixedPropertyNames[i];
	}

	return null;
};
// Fetches CSS files from the webserver and returns the plaintext
var XHRCSSFiles = function() {
	var request = new XMLHttpRequest();
	request.open("GET", "FullPageAnimationsPrefixed.css", false);
	request.send("");

	// For the Test Drive demo we also want to vendor prefix animations/transforms utilized for demonstration purposes
	// When you use this script on your site, you probably want to remove this
	var request2 = new XMLHttpRequest();
	request2.open("GET", "DemoTransformsAnimations.css", false);
	request2.send("");

	return request.responseText + "\n" + request2.responseText;
};

function injectCSS(cssString) {
	var ele = document.createElement("style");
	ele.type = "text/css";
	if (ele.styleSheet) {
		ele.styleSheet.cssText = cssString;
	} else {
		ele.appendChild(document.createTextNode(cssString));
	}
	document.getElementsByTagName("head")[0].appendChild(ele);
}

// Since CSS Animations and Transforms are not always supported in their unprefixed form, we have to perform some feature detection
var DetectPrefixes = function() {

	// First we figure out the attribute names for usage with bracket style attribute access notation
	transformName = FirstSupportedPropertyName(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]);
	animationName = FirstSupportedPropertyName(["animation", "msAnimation", "MozAnimation", "WebkitAnimation", "OAnimation"]);
	perspectiveName = FirstSupportedPropertyName(["perspective", "msPerspective", "MozPerspective", "WebkitPerspective", "OPerspective"]);
	// The event names are a bit more tricky to handle due to capitalization
	animationEndName = (animationName + "End").replace(/^ms/, "MS").replace(/^Webkit/, "webkit").replace(/^Moz.*/, "animationend").replace(/^animationEnd$/, "animationend");
	animationStartName = (animationName + "Start").replace(/^ms/, "MS").replace(/^Webkit/, "webkit").replace(/^Moz.*/, "animationstart").replace(/^animationStart$/, "animationstart");
	animationIterationName = (animationName + "Iteration").replace(/^ms/, "MS").replace(/^Webkit/, "webkit").replace(/^Moz.*/, "animationiteration").replace(/^animationIteration/, "animationiteration");

	// We also have some declarative markup that we need to patch up (@keyframes rules and various CSS used in our Test Drive Demo)
	var prefix = "";
	// First we detect the proper prefix
	if (animationName == "msAnimation") {
		prefix = "-ms-";
	} else if (animationName == "MozAnimation") {
		prefix = "-moz-";
	} else if (animationName == "WebkitAnimation") {
		prefix = "-webkit-";
	} else if (animationName == "OAnimation") {
		prefix = "-o-";
	}
	// Then we fetch the CSS files (that have been composed using the -ms- prefix)
	//var CSSFileString = XHRCSSFiles();
	// Following we do a simple String.replace of -ms- with the actual vendor prefix
	//CSSFileString = CSSFileString.replace(/-ms-/gi, prefix);
	// And finally we inject the CSS
	//injectCSS(CSSFileString);
};
//--------------------------END HELPERS-------------------------------//

// Lists of supported animations (matches defined animations in the CSS file)
var BringToViewAnimations = ["rotateInLeft", "whirlIn", "fallFromTop", "slideInSkew", "tumbleIn", "expandIn", "LeftExpandIn", "noAnim"]; //fadeIn - causes bugs
var RemoveFromViewAnimations = ["rotateOutRight", "fadeOut", "whirlOut", "slideOutSkew", "tumbleOut"];

var GetRandomAnimation = function(animationArray) {
	var length = animationArray.length;
	var index = Math.round(Math.random() * (length - 1));
	return animationArray[index];
};
var ApplyAnimationToElement = function(element, animName) {
	if (element.style[animationName + "Name"] == animName) {
		// If we are reapplying an animation, we need to zero out the value and then reset the property after the function returns.
		element.style[animationName + "Name"] = "";
		setTimeout(function() { element.style[animationName + "Name"] = animName; });
	} else {
		element.style[animationName + "Name"] = animName;
	}
};
// Sets up animation-related parameters on the body element.
// Adjust to your liking for your application.

var SetupAnimationParameters = function(element) {
	element.style[animationName + "Delay"] = "0.0s";
	element.style[animationName + "Duration"] = "1s";
	element.style[animationName + "IterationCount"] = "1";
	// Setting animation-fill-mode to "forwards" will preserve the to{} keyframe values after the animation
	// is complete. As a result, we do not have to inject a transform on the body element to maintain the post-animation position
	element.style[animationName + "FillMode"] = "forwards";
	element.style[animationName + "TimingFunction"] = "linear";
	element.style[animationName + "PlayState"] = "running";
};
// Traverses the DOM hierarchy upwards from the element argument looking for an anchor tag.
// This function allows us detect patterns like <a><span>foo</span></a> and capture navigation events.

var FindAnchorTagForElement = function(element) {
	var curNode = element;
	while (curNode != null) {
		if (curNode.onclick) {
			// if we encounter an onclick handler, we return null
			// which makes BodyOnClickHandler return as well
			// and allows normal Javascript event handling
			return null;
		}
		if (curNode.tagName == "A" && curNode.href.indexOf('#') == -1) {
			return curNode;
		}
		curNode = curNode.parentNode;
	}
	return curNode;
};
// Captures any clicks in the document and checks whether they correspond to anchors (or belong to an anchor parent) that do not have onclick handlers on them
// if so, it intercepts the action, triggers an animation and then performs the default action
var BodyOnClickHandler = function(event) {
	var e = event || window.event;
	var tgt = e.target;

	var anchorTag = FindAnchorTagForElement(tgt);

	if (anchorTag != null) {
		// we found an anchor without an onClick handler
		e.stopPropagation();
		e.preventDefault();

		TriggerBodyRemoveFromViewAnimation(GetRandomAnimation(RemoveFromViewAnimations), anchorTag.href);
	}
};
// Adjusts the perspective-origin property of the HTML element in order to compensate for
// projections on really long (tall) content. This should somewhat mitigate the off-axis 
// projection effect that results from the user being scrolled away from the middle of the <body>
// element. It is not necessary for the Test Drive demo since we fix the size of the body element
// to the window dimensions and use a overflow:scroll instead.

var SetupProjectionOrigin = function () {

	var totalHeight = document.documentElement.scrollHeight;
	var scrollTop = document.documentElement.scrollTop;
	var windowHeight = window.innerHeight;
	var projOrig = (scrollTop + windowHeight / 2.0) / totalHeight;

	var elements = document.getElementsByTagName("HTML");
	elements[0].style[perspectiveName + "Origin"] = "50% " + (projOrig * 100).toString() + "%";

};
var VerifyTransformAnimationSupport = function() {
	if ((animationName != null) && (transformName != null)) {
		return true;
	}
	return false;
};
var SetupBodyBringToViewAnimation = function(animName) {
	if (!VerifyTransformAnimationSupport()) return;
	//document.body.style.visibility = "visible";
	if (animName == null) {
		animName = GetRandomAnimation(BringToViewAnimations);
	}
	SetupProjectionOrigin();
	SetupAnimationParameters(document.body);
	ApplyAnimationToElement(document.body, animName);
};
var AnimationEndCallback = function(action) {
	window.location.href = action;
};
var TriggerBodyRemoveFromViewAnimation = function(animName, action) {
	if (!VerifyTransformAnimationSupport()) {
		AnimationEndCallback(action);
		return;
	}
	var ele = document.body;

	// first we add a listener for the animationend event so we can perform a navigation once the transition is complete
	addListener(ele, animationEndName, function() { AnimationEndCallback(action); });

	// If you are not using the CSS wrapper pattern described in our article you may want to uncomment this
    // in order to mitigate visual skewing from perspective projection
	//SetupProjectionOrigin();
	SetupAnimationParameters(document.body);
	ApplyAnimationToElement(ele, animName);
};
var SetPerspectiveForHTMLTag = function(depth) {
	var elements = document.getElementsByTagName("HTML");
	elements[0].style[perspectiveName] = depth;
};
var AddBodyClickListener = function() {
	addListener(document.body, "click", BodyOnClickHandler, true);
};
DetectPrefixes();

SetPerspectiveForHTMLTag("500px");

// If you would like randomized animations to be automatically added to the body element, uncomment this line
// Alternatively, you can call "SetupBodyBringToViewAnimation(animName)" and pass your preferred animation
// after including this script in your markup
SetupBodyBringToViewAnimation();

// Adding a listener for click events so we can capture navigations and preface them with an animation
if (VerifyTransformAnimationSupport()) {
	AddBodyClickListener();
}