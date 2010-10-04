<?php
	
	include "functions.php";
	
	$request = substr($_SERVER['REQUEST_URI'], 1);
	$dictionary['content'] =  array($lang => load_content($request));
	$file = "innhold/index.html";
	print translate($file);
?>
