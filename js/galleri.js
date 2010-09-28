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
		$('#imgwrap').get(0).removeChild(img);
	}
	img = document.createElement('img');
	img.src = "bilder/" + images.bilde[image].filnavn;
	img.id = 'image';
	$('#imgwrap').get(0).appendChild(img);
	$('#image').hide();
	$('#imgtitle').get(0).innerHTML = images.bilde[image].tittel;
	$('#imgnum').get(0).innerHTML = (image + 1) + " av " + images.bilde.length;
	
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

$(document).ready(function() {
	// Let's load the images
	$.get("bilder.xml", function(xml) {
			images = $.xml2json(xml);
			display();
	});
});


// No sound yet
//var isPlaying = false;
/*
function togglePlay() {
	if (isPlaying) {
		soundManager.pause('lyd');
	} else {
		soundManager.play('lyd', 'audio/miracle.mp3');
	}
	isPlaying = !isPlaying;
}

function stop() {
	soundManager.pause('lyd');
	soundManager.setPosition(0);
	isPlaying = false;
} */
// No sound yet.
/*if (key == 32) {
	// Only prevent default for the space bar
	e.preventDefault();
	togglePlay();
} else if (key == 27) {
	stop();	
} else */

// Hack for Opera :(
/*$('html').keyup(function(e) {
	document.documentElement.scrollTop = window.pageYOffset = pos;	
}); */
