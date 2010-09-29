<?php

$lang = "no";

if(isset($_COOKIE['language'])) {
	global $lang;
	$lang = $_COOKIE['language'];
}


function translate($filename) {
	$handler = fopen($filename, "r");
	$contents = fread($handler, filesize($filename));
	
	preg_match_all("/\${([^}]+)}/", $contents, $matches);

	print_r($contents);

	print_r($matches);	
}


translate("/home/simen/skole/uu/test");

?>
