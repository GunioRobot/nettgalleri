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
	$contents = file_exists($filename) ? file_get_contents($filename) : $filename;

	// Get all text that should be translated
	preg_match_all('/\${([^}]+)}/', $contents, $matches);

	// Look up matches and dictionary and perform translation
	for($i = 0;$i < sizeof($matches[0]);$i++) {
		$contents = str_replace($matches[0][$i], $dictionary[$matches[1][$i]][$lang], $contents);
	}

	return $contents;
}

function load_content($file) {
	if($file == "bilder") {

	
	} else if($file == "language") {
		if(!isset($_COOKIE['language'])) {
			setcookie("language", "en");	
		} else if($_COOKIE['language'] == "no") {
			setcookie("language", "en"); 
		} else {
			setcookie("language", "no"); 
		}

		$returl = $_SERVER['HTTP_REFERER'];
		header("Location: $returl");

	} else {
		$file = "innhold/$file.html";
		if(file_exists($file)) {
			$contents = file_get_contents($file);
			return translate($contents);
		}
	}
	return;
}

?>
