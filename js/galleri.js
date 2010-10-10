/**
 * Gallery functions. 
 */

// Global variables 
var image = 0; // The current image shown
var images = {}; // A new JSON object, to contain information about all available images.
var args = getUrlVars();

/*
 * Helper function to simplify the API.
 * Goes to the next image or to the first if we're at the end
 */
function next() {
	image++;
	if (image >= images.bilde.length) {
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

	// Current language with fallback to Norwegian
	var lang = $.cookie("language") || "no"; 
	
	// Updates the page elements with the image data.
	$('#imgtitle').get(0).innerHTML = images.bilde[image].tittel[lang];
	$('#imgnum').get(0).innerHTML = parseInt(image) + 1 + " / " + images.bilde.length;
	$('#description').get(0).innerHTML = images.bilde[image].beskrivelse[lang];
	
	// We have to update the selection text if the image is added in our selection.
	var selText = $.cookie("language") == "en" ? "Add to selection" : "Legg til utvalg";
	if (isImageInSelection()) {
		selText = $.cookie("language") == "en" ? "Remove from selection" : "Fjern fra utvalg";
	}
	$('#favourite').get(0).innerHTML = selText;
	
	// Fix the URL to provide a nice 
	writeURL();
	
	// Call for the waiter function to load the image fully before displaying it.
	_display(img);
}

function writeURL() {
	location.href = location.href.split("#").shift() + "#" + args[0];
	var filename = getFilename(image);
	if (filename == undefined) {
		return;
	}
	location.href += "/" + filename;
	if (args[0] == 'utvalg') {
		var code = generateShareURL();
		if (code != '') {
			location.href += "/" + code;
		}
		setShareURLs();
	}
}

function getFilename(img) {
	if (images.bilde[img] == undefined) {
		return;
	}
	var filename = images.bilde[img].filnavn;
	return filename.substr(0, filename.length-4);
}

function getImagePositionByFilename(img) {
	for (var b in images.bilde) {
		if (getFilename(b) == img) {
			return b;
		}
	}
}

/*
 *
 *
 */
function toggleSelection() {
	var elements = _getSelectionElements();

	if (isImageInSelection(elements)) {
		// We have already added the image to the selection, remove it then.
		
		// index HAS to be > -1, or something's screwed with isImageInSelection
		var index = elements.indexOf(getFilename(image));
	
		// Remove the element
		elements.splice(index, 1);
		$.cookie("aweSelection", elements.join(":"));
		
		if (args[0] == 'utvalg') {
			// If we're in the selection, we have to remove it from the images array and go to the next image
			images.bilde.splice(image, 1);
			
			if (images.bilde.length > 0) {
				if (image == images.bilde.length) {
					previous();
				} else if (images.bilde.length > 0) {
					display();
				}
			} else {
				if (images.bilde.length == 0) {
					// If we have no images in the selection, we have to tell the user about it.
					$('#layout').hide();
					$('#info').show();
				}
			}
		} else {
			$('#favourite').get(0).innerHTML = $.cookie("language") == "en" ? "Add to selection" : "Legg til utvalg";
			
		}
	} else {
		// We have not added the image to the selection, add it.
		elements.push(getFilename(image));
		
		$('#favourite').get(0).innerHTML = $.cookie("language") == "en" ? "Remove from selection" : "Fjern fra utvalg";
		$.cookie("aweSelection", elements.join(":"));
	}
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
		if (elements[i] != '' && elements[i] == getFilename(image)) {
			return true;
		}
	}
	return false;
}

function loadSelection() {
	var code = $.base64Decode(args[2]);
	$.cookie("aweSelection", code); // ...
}

function generateShareURL() {
	var sel = $.cookie("aweSelection") || '';
	if (sel == '') {
		return '';
	}
	return $.base64Encode(sel);	
}

function setShareURLs() {
	var url = window.location.protocol + "//" + window.location.host + (window.location.pathname || '/') + "#utvalg/" + getFilename(image) + "/" + generateShareURL();
	$('#share a').attr('href', url).attr('innerHTML', url);
}

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

	// Let's load the image information in the page. 
	$.get("bilder.xml", function(xml) {
		images = $.xml2json(xml);
		if (args[0] == 'utvalg') {
			if (args[2] != undefined) {
				loadSelection();
			}
		
			var elements = _getSelectionElements();
			var i = 0;
			while (i < images.bilde.length) {
				var found = false;
				for (var e in elements) {
					if (getFilename(i) == elements[e]) {
						found = true;
					}
				}
				
				if (!found) {
					images.bilde.splice(i, 1);
				} else {
					i++;
				}
			}
		}
		
		if (images.bilde.length == 0) {
			// If we have no images in the selection, we have to tell the user about it.
			$('#layout').hide();
			$('#info').show();
		} else {
			if (args[1] != undefined && args[1] != '' && images.bilde[getImagePositionByFilename(args[1])] != undefined) {
				image = parseInt(getImagePositionByFilename(parseInt(args[1])));
			} else {
				image = 0;
			}
			display();
		}
	});
});
