<?php
	
	include "functions.php";
	
	$request = $_SERVER['PHP_SELF'];
	$dictionary['content'] = loadContent($request);
	$file = "innhold/index.html";
	print translate(translate($file));

	$content = translate("innhold/index.html");
	
	print $content;

?>
