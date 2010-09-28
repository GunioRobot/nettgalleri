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
/*	<ul id="font-sizer">
		<li><a href="#" id="font-normal">A</a></li>
		<li><a href="#" id="font-large">A</a></li>
		<li><a href="#" id="font-huge">A</a></li>
	</ul>*/

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

 