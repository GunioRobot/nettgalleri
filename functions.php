<?php

include "dictionary.php";

$lang = "no";

if(isset($_COOKIE['language'])) {
	global $lang;
	$lang = $_COOKIE['language'];
}


function translate($filename) {
	global $lang, $dictionary;

	// Get all keywords
	$handler = fopen($filename, "r");
	$contents = fread($handler, filesize($filename));
	
	preg_match_all('/\${([^}]+)}/', $contents, $matches);

	for($i = 0;$i < sizeof($matches[0]);$i++) {
		$contents = str_replace($matches[0][$i], $dictionary[$matches[1][$i]][$lang], $contents);
	}

	return $contents;
}

?>
