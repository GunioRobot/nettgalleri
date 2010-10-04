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
	fclose($handler);

	// Get all text that should be translated
	preg_match_all('/\${([^}]+)}/', $contents, $matches);

	// Look up matches and dictionary and perform translation
	for($i = 0;$i < sizeof($matches[0]);$i++) {
		$contents = str_replace($matches[0][$i], $dictionary[$matches[1][$i]][$lang], $contents);
	}

	return $contents;
}

function loadContent() {
	$request = $_SERVER['SERVER_URI'];

	print "req: $request";
	

}

?>
