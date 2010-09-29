/**
 * Script containing common usability functions for the site.
 * Requires jQuery
 */
var normal = { 
			 "p":"0.9", 
			"td":"0.9",
			"h1":"3", 
			"h2":"1.5", 
			"th":"1.5",
			"h3":"1.2",
	  "#cv-head":"1.1"
}

function setFonts (m) {
	for (var j in normal) {
		$(j).each(function(el) { 
			$(this).get(0).style.fontSize = (normal[j] * m) + "em"
		});
	}
}

function getUrlVars() {
	var v = window.location.href.split('#');
	v.shift();
	if (v.length == 0) {
		return;
	}
	
	var args = v.shift().split('/');
	return args;
}


function loadContent(page) {
	$('#content').hide()
				 .load('innhold/' + page + '.html')
				 .fadeIn();
				 
	// Recurse and fallback to home if the page is not found.
	if (status == 'error') {
		loadContent('hjem');
	}
}

$(document).ready(function() {
	var ul = document.createElement('ul');
	ul.id = 'font-sizer';
	var style = { "font-normal":"", "font-large":"", "font-huge":"" }
	for (var id in style) {
		var li = document.createElement('li');
		ul.appendChild(li);
		var a = document.createElement('a');
		a.id = id;
		a.href = "#";
		a.innerHTML = 'A';
		li.appendChild(a);
	}
	
	$('#wrap').get(0).insertBefore(ul, $('#wrap').get(0).firstChild);
		
	$('#font-sizer li a').click(function(e) {
		e.preventDefault();
		if (this.id == 'font-normal') {
			setFonts(1);
		} else if (this.id == 'font-large') {
			setFonts(1.3);
		} else if (this.id == 'font-huge') {
			setFonts(1.5);
		}
	});
	
	// Make the menu actually do something, except the langauge
	$('#menu li a:not(#language)').click(function(e) {
		// Load based on content
		loadContent(this.innerHTML.toLowerCase());
	});
	
	$('#language').click(function(e) {
		e.preventDefault();
		alert("This is where we change the language, but we're fast forwarding to when you are changing back to Norwegian again.");
	});
	
	
	
	var args = getUrlVars();
	
	loadContent(args != undefined && args[0] != '' ? args[0] : 'hjem');
});

 