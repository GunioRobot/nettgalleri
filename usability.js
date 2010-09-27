/**
 * Script containing common usability functions for the site.
 * Requires jQuery
 */
var normal = { "p":"0.9", "h1":"3", "h2":"1.5" }
function setFonts (m) {
	for (var j in normal) {
		$(j).each(function(el) { 
			$(this).get(0).style.fontSize = (normal[j] * m) + "em"
		});
	}
}

$(document).ready(function() {
	$('#font-sizer li a').click(function() {
		if (this.id == 'font-normal') {
			setFonts(1);
		} else if (this.id == 'font-large') {
			setFonts(1.3);
		} else if (this.id == 'font-huge') {
			setFonts(1.5);
		}
	});
	
	// Let's try something awesome
	$('#menu li a').click(function() {
		$('#content').hide().fadeIn();
	});
});

 