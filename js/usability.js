/*
 * Script containing common usability functions for the site.
 * Requires jQuery
 */

// Define default font sizes to be used with the setFonts
var normal = { 
			 "p":"0.9", 
			"td":"0.9",
			"h1":"3", 
			"h2":"1.5", 
			"th":"1.5",
			"h3":"1.2",
	  "#cv-head":"1.1"
}

/*
 * Takes argument m as multiplication. Iterates through defined 
 * font sizes to increase the size and readability at the site.
 */
function setFonts (m) {
	for (var j in normal) {
		$(j).each(function(el) { 
			$(this).get(0).style.fontSize = (normal[j] * m) + "em"
		});
	}
}

/*
 * Parses the URL parameters passed behind the #
 * Returns an array of arguments.
 */
function getUrlVars() {
	var v = window.location.href.split('#');
	v.shift(); // Remove the first element, the URL if any
	if (v.length == 0) {
		return;
	}
	
	var args = v.shift().split('/');
	return args;
}

/*
 * Loads the specified page into the content div. Falls back on loading the 
 * homepage if an error occurs (or the page doesn't exist).
 */
function loadContent(page) {
	// Not very pretty...
	$('#content').get(0).innerHTML = '';
	$('#content').attr('class', 'loading')
				 .load('innhold/' + page + '.php', function() {
				 	$(this).attr('class', '');
				 	$(this).fadeIn();
				 });
				 			 
	// Recurse and fallback to home if the page is not found.
	if (status == 'error') {
		return loadContent('hjem');
	}
	
	// Make the menu items highlight the section we're currently in
	$('.selected').attr('className', '');
	$('#' + page).attr('className', 'selected');
}

/*
 * Changes the language based on the set cookie.
 */
function changeLanguage() {
	var lang = $.cookie("language");
	if (lang == undefined) {
		lang = 'no';
	}
	$.cookie("language", lang == "no" ? "en" : "no");

	// Then reload the page.
	location.reload();
}

// Handler when document is loaded
$(document).ready(function() {
	// Create the font size changer. This isn't useful unless the user has JavaScript,
	// thus create it here.
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
	
	// Insert this first thing in the wrap div.
	$('#wrap').get(0).insertBefore(ul, $('#wrap').get(0).firstChild);
	
	// The same goes for the selection
	var li = document.createElement('li');
	var a = document.createElement('a');
	li.appendChild(a);
	a.id = "utvalg";
	a.innerHTML = $.cookie("language") == "en" ? "Your selection" : "Ditt utvalg";
	a.href = "";
	$('#menu').add(li);
	$('#menu').get(0).insertBefore(li, $('#menu li').get($('#menu').find('li').length-1)); // Hackish...
	$('#menu').css('width', '43em').css('padding-left', '1em');
		
	// Add on click handler for the font size changer.
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
	$('#menu li a').click(function(e) {	
		e.preventDefault();
		if (this.id == 'language') {
			changeLanguage();
		} else {
			// We don't want to jump to any anchors in the page, thus...
			location.href = location.href.split("#").shift() + "#" + this.id;
			// Load based on content
			loadContent(this.id);
		}
	});
	
	// Finally load content based on the specified arguments passed in the URL.
	var args = getUrlVars();
	loadContent(args != undefined && args[0] != '' ? args[0] : 'hjem');
});

 
