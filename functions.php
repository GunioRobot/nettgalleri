<?php

include "dictionary.php";

$lang = "no";

if(isset($_COOKIE['language'])) {
	global $lang;
	$lang = $_COOKIE['language'];
}

function get_file_content($filename) {
	$handler = fopen($filename, "r");
	$contents = fread($handler, filesize($filename));
	fclose($handler);

	return $contents;	
}


function translate($filename) {
	global $lang, $dictionary;

	// Get all keywords
	$contents = get_file_content($filename);

	// Get all text that should be translated
	preg_match_all('/\${([^}]+)}/', $contents, $matches);

	// Look up matches and dictionary and perform translation
	for($i = 0;$i < sizeof($matches[0]);$i++) {
		$contents = str_replace($matches[0][$i], $dictionary[$matches[1][$i]][$lang], $contents);
	}

	return $contents;
}

function load_content($file) {

	if($file == "bilder.php") {

	
	} else if($file == "language.php") {
		if(!isset($_COOKIE['language'])) {
			setcookie("language", "en");	
		} else if($_COOKIE['language'] == "no") {
			$_COOKIE['language'] = "en";
		} else {
			$_COOKIE['language'] = "no";
		}

		$returl = $SERVER['PHP_SELF'];
		header("Location: $returl");

	} else {
		$file = "/innhold/$file.html";

		if(file_exists($file)) {
			$contents = get_file_content($filename);
			return $contents;
		}
	}
	return;
}

?>
