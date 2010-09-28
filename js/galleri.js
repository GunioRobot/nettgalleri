var image = 0;
var images = {}; //new Array();


function next() {
	image++;
	if (image == images.bilde.length) {
		image = 0;
	}
	display();
}

function previous() {
	image--;
	if (image < 0) {
		image = images.bilde.length - 1;
	}
	display();
}

		
function _display(img) {
	if (img.complete) {
		$('#image').show();
	} else {
		setTimeout(function() { 
			_display(img);
		}, 100);
	}
}

function display() {
	var img = $('#image').get(0);
	if (img) {
		$('#imgwrap a').get(0).removeChild(img);
	}
	img = document.createElement('img');
	img.src = "bilder/" + images.bilde[image].filnavn;
	img.id = 'image';
	$('#imgwrap a').get(0).appendChild(img);
	$('#image').hide();
	$('#imgtitle').get(0).innerHTML = images.bilde[image].tittel;
	$('#imgnum').get(0).innerHTML = (image + 1) + " / " + images.bilde.length;
	
	_display(img);
}

// Key navigation
$('html').keydown(function(e) {
	var key = e.which;
	if (key == 39) {
		next();
	} else if (key == 37) {
		previous();
	} 
});


var fullscreen = false;
$(document).ready(function() {
	$('#imgwrap a').click(function(e) {
		fullscreen = !fullscreen;
		$('#layout').get(0).className = fullscreen ? 'fullscreen' : 'normal';
	});
	
	$('#sidebar #next').click(function(e) { 
		e.preventDefault();
		next()
	});
	
	$('#sidebar #prev').click(function(e) {
		e.preventDefault();
		previous()
	});
	
	// Let's load the images
	$.get("bilder.xml", function(xml) {
		images = $.xml2json(xml);
		display();
	});
});