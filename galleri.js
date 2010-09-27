var isPlaying = false;
var image = 0;
var images = new Array();
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
}

function next() {
	image++;
	if (image == images.length) {
		image = 0;
	}
	display();
}

function previous() {
	image--;
	if (image < 0) {
		image = images.length - 1;
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
	img.src = "images/" + images[image];
	img.id = 'image';
	$('#imgwrap').get(0).appendChild(img);
	$('#image').hide();
	$('#imgnum').get(0).innerHTML = image + 1;
	
	_display(img);
}

var pos = 0;
$('html').keydown(function(e) {
	pos = document.documentElement.scrollTop; 
	var key = e.which;
	if (key == 32) {
		// Only prevent default for the space bar
		e.preventDefault();
		togglePlay();
	} else if (key == 27) {
		stop();	
	} else if (key == 39) {
		// Next image
		next();
	} else if (key == 37) {
		previous();
	} 
});

// Hack for Opera :(
$('html').keyup(function(e) {
	document.documentElement.scrollTop = window.pageYOffset = pos;	
});

$(document).ready(function() {
	// Let's load the images
	$.get("images.php", function(xml) {
			$(xml).find('bilde').each(function() {
				images.push($(this).text());
			});
			display();
	});
});
