<?php
	
	include "functions.php";
<<<<<<< HEAD
	
	$request = $_SERVER['PHP_SELF'];
	$dictionary['content'] = loadContent($request);
	$file = "innhold/index.html";
	print translate(translate($file));
=======

	$content = translate("innhold/index.html");
	
	print $content;
>>>>>>> 0156f06f2da60099d0e1282c7f0058f87c94086c

?>