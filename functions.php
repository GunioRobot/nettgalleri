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
	// Parse the XML file
	if($file == "galleri") {
		return get_gallery();

	// Language switch
	// Set cookie and redirect
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

	// Return the data of the html file requested
	} else {
		$file = "innhold/$file.html";
		if(file_exists($file)) {
			$contents = file_get_contents($file);
			return translate($contents);
		}
	}
	return;
}


// This function parses bilder.xml and returns a gallery
// At the moment no navigation supported, but this is only a
// sollution for PHP fallback when JavaScript is not enabled

$bilder = array();

function get_gallery() {
	$file = "bilder.xml";
	global $xml_tittel_key, $xml_fil_key, $xml_beskrivelse_key;
	$xml_tittel_key = "*GALLERI*BILDE*TITTEL";
	$xml_fil_key = "*GALLERI*BILDE*FILNAVN";
	$xml_beskrivelse_key = "*GALLERI*BILDE*BESKRIVELSE";

	global $bilder;
	$counter = 0;

	class bilde {
		var $tittel, $filnavn, $beskrivelse;
	}		

	function startTag($parser, $data) {
		global $current_tag;
		$current_tag .= "*$data";
	}

	function endTag($parser, $data) {
		global $current_tag;
		$tag_key = strrpos($current_tag, "*");
		$current_tag = substr($current_tag, 0, $tag_key);
	}

	function contents($parser, $data) {
		global $current_tag, $xml_tittel_key, $xml_fil_key, $xml_beskrivelse_key, $counter, $bilder;
		$data = pro_charset_hax($data, false);
		switch($current_tag) {
			case $xml_tittel_key:
				$bilder[$counter] = new bilde();
				$bilder[$counter]->tittel = $data;
				break;
			case $xml_fil_key:
				$bilder[$counter]->filnavn = $data;
				break;
			case $xml_beskrivelse_key:
				$bilder[$counter++]->beskrivelse = $data;
				break;
		}
	}

	
	function pro_charset_hax ($data, $encode = true) {
		$STUPID = Array(
			"æ" => "__aelig__",
			"ø" => "__oslash__",
			"å" => "__aring__",
			"Æ" => "__Aelig__",
			"Ø" => "__Oslash__",
			"Å" => "__Aring__"
		);
		
		foreach ($STUPID as $from => $to) {
			$data = $encode ? str_replace($from, $to, $data) : str_replace($to, $from, $data);
		}

		return $data;
	}
	
	$parser = xml_parser_create();
	xml_set_element_handler($parser, "startTag", "endTag");
	xml_set_character_data_handler($parser, "contents");
	xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, 'UTF-8');	

	$fp = fopen($file, "r") or die("failed to open file");
	$data = fread($fp, filesize($file)) or die("failed to read file");
	$data = pro_charset_hax($data);
	if(!(xml_parse($parser, $data, feof($fp)))){ 
    	die("Error on line " . xml_get_current_line_number($parser) ."\n"); 
	}
	xml_parse($parser, $data);

	xml_parser_free($parser);
	fclose($fp);

	/*
	$html = "";
	foreach($bilder as $bilde) {
		$html .= "<h3>$bilde->tittel</h3>\n";
		$html .= "<p><img src=\"bilder/$bilde->filnavn\" alt=\"$bilde->tittel\" /></p>\n";
		$html .= "<p>$bilde->beskrivelse</p>\n\n\n";
	}

	return $html;
	*/

	print_r($bilder);
}

get_gallery();

?>
