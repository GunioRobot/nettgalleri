<?php

include "dictionary.php";

$lang = "no";

if(isset($_COOKIE['language'])) {
	global $lang;
	$lang = $_COOKIE['language'];
}

function translate($filename) {
	global $lang, $dictionary;

	// Get all data
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
	if($file == "galleri") {
		return get_gallery();
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


// This function parses the gallery xml and returns a gallery
// At the moment no navigation supported, but this is only a
// sollution for PHP fallback when JavaScript is not enabled
function get_gallery() {
	$file = "bilder.xml";
	
}

?>
