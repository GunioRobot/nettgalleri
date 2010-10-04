/**
 * Gallery functions. 
 */

// Global variables 
var image = 0; // The current image shown
var images = {}; // A new JSON object, to contain information about all available images.

/*
 * Helper function to simplify the API.
 * Goes to the next image or to the first if we're at the end
 */
function next() {
	image++;
	if (image == images.bilde.length) {
		image = 0;
	}
	display();
}

/*
 * Helper function to simplify the API.
 * Goes to the previous image or to the last if we're at the beginning
 */
function previous() {
	image--;
	if (image < 0) {
		image = images.bilde.length - 1;
	}
	display();
}

/*
 * When the image is loaded, display the image. Otherwise wait 0.1 seconds and try again.
 */
function _display(img) {
	if (img.complete) {
		$('#image').show();
	} else {
		setTimeout(function() { 
			_display(img);
		}, 100);
	}
}

/*
 * Function to load the image into the page
 */
function display() {
	var img = $('#image').get(0);

	// In order to correctly display the AJAX loader, we have to remove the image element
	// and create a new one in its place.
	if (img) {
		$('#imgwrap a').get(0).removeChild(img);
	}
	img = document.createElement('img');
	img.src = "bilder/" + images.bilde[image].filnavn;
	img.id = 'image';
	img.alt = images.bilde[image].beskrivelse;
	$('#imgwrap a').get(0).appendChild(img);

	// Hide the image to ensure that we see the AJAX loader.
	$('#image').hide();

	// Updates the page elements with the image data.
	$('#imgtitle').get(0).innerHTML = images.bilde[image].tittel;
	$('#imgnum').get(0).innerHTML = (image + 1) + " / " + images.bilde.length;
	$('#description').get(0).innerHTML = images.bilde[image].beskrivelse;
	
	// We have to update the selection text if the image is added in our selection.
	var selText = $.cookie("language") == "en" ? "Add to selection" : "Legg til utvalg";
	if (isImageInSelection()) {
		selText = $.cookie("language") == "en" ? "Remove from selection" : "Fjern fra utvalg";
	}
	$('#favourite').get(0).innerHTML = selText;
	
	// Fix the URL to provide a nice 
	location.href = location.href.split("#").shift() + "#galleri/" + image;
	
	// Call for the waiter function to load the image fully before displaying it.
	_display(img);
}

/*
 *
 *
 */
function addToSelection() {
	var elements = _getSelectionElements();

	elements.push(image),

	$.cookie("aweSelection", elements.join(":"));
}

function toggleSelection() {
	var elements = _getSelectionElements();
	var newText = '';
	if (isImageInSelection(elements)) {
		// index HAS to be > -1, or something's screwed with isImageInSelection
		var index = elements.indexOf(image);
	
		// Remove the element
		elements.splice(index, 1); 
		
		newText = $.cookie("language") == "en" ? "Add to selection" : "Legg til utvalg";
	} else {
		elements.push(image);
		
		newText = $.cookie("language") == "en" ? "Remove from selection" : "Fjern fra utvalg";
	}
	$('#favourite').get(0).innerHTML = newText;
	$.cookie("aweSelection", elements.join(":"));
}

function removeFromSelection() {
	var elements = _getSelectionElements();
}

function _getSelectionElements() {
	var sel = $.cookie("aweSelection") || '';
	var elements = sel.split(":");
	if (elements[0] == '') {
		elements.shift();
	}
	return elements;
}

function isImageInSelection(elements) {	
	elements = elements != undefined ? elements : _getSelectionElements();
	
	for (var i = 0; i < elements.length; i++) {
		if (elements[i] != '' && elements[i] == image) {
			return true;
		}
	}
	return false;
}


// TODO: Add possibility to remove images from selection. 

// Keyboard nagivation using the left and right keys.
$('html').keydown(function(e) {
	var key = e.which;
	if (key == 39) {
		next();
	} else if (key == 37) {
		previous();
	} 
});


// Global variable to be used with the "fullscreen" mode.
var fullscreen = false;

// Handler for when the page is loaded
$(document).ready(function() {
	// Handler for the zoom in function. 
	$('#imgwrap a, #zoomin').click(function(e) {
		fullscreen = !fullscreen;
		$('#layout').get(0).className = fullscreen ? 'fullscreen' : 'normal';
	});
	
	// Handler for when the next image button is clicked.
	$('#sidebar #next').click(function(e) { 
		e.preventDefault();
		next()
	});
	
	// Handler for when the previous image button is clicked
	$('#sidebar #prev').click(function(e) {
		e.preventDefault();
		previous()
	});
	
	$('#sidebar #favourite').click(function(e) {
		e.preventDefault();
		toggleSelection();
	});

	var args = getUrlVars();
	if (args[1] != undefined) {
		image = parseInt(args[1]);
	}

	// Let's load the image information in the page. 
	$.get("bilder.xml", function(xml) {
		images = $.xml2json(xml);
		display();
	});
});
