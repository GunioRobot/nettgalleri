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

function get_id() {
	preg_match("/id=(\d+)/", $_SERVER['REQUEST_URI'], $matches);
        return $matches[1] ? $matches[1] : 1; # Default to 1;
}

function load_content($file) {
	global $lang;
	// Get the array holding picture objects
	if($file == "galleri") {
		$pics = array();
		$pics = get_gallery();

		// Set upper and lower id
		$first_id = 1;
		$last_id = count($pics);

		// Get requested id
		//$requested_id = ($_GET['id'] != "") ? ($_GET['id']) : $first_id;
		$requested_id = get_id();

		$index = $requested_id-1;
	
		// Make navigation links
		$next_id = ($requested_id == $last_id) ? $first_id : ($requested_id+1);
		$prev_id = ($requested_id == $first_id) ? $last_id : ($requested_id-1);
		$next_text = ($lang == "no") ? "Neste bilde" : "Next picture";
		$prev_text = ($lang == "no") ? "Forrige bilde" : "Previous picture";

	
		$tittel = ($lang == "no") ? $pics[$index]->tittel_no : $pics[$index]->tittel_en;
		$fil = $pics[$index]->filnavn;
		$beskrivelse = ($lang == "no") ? $pics[$index]->beskrivelse_no : $pics[$index]->beskrivelse_en;

/*	
<div id="layout" class="normal">
	<div id="imghead"><h2 id="imgtitle"></h2><h3 id="imgnum">0 / 0</h3></div>
	<div id="imgwrap"><a href="#"></a></div>
	<div id="sidebar">
		<div id="nav">
			<a href="#" id="prev">&laquo; ${prev_img}</a>
			<a href="#" id="next">${next_img} &raquo;</a>
			<a href="#" id="zoomin">${zoomin}</a>
			<a href="#" id="favourite">${add_to_selection}</a>
		</div>
		<div class="clear"></div>
		<p id="description"></p>
	</div>
	<div class="clear"></div>
</div>
<div id="info">
	<h2>${no_img_selection}</h2>
	<p>${help_img_selection}</p>
</div>
*/

		$html = "<div class=\"picture\">\n";
		$html .= "<h4>$tittel</h4>\n";
		$html .= "<p><img src=\"bilder/$fil\" height=\"400\" width=\"300\" alt=\"$tittel\" /></p>\n";
		$html .= "<p>$beskrivelse</p>\n";
		
		$html .= "</div>\n";
		
		$html .= "<div class=\"navigate\">\n";
		$html .= "<p>$requested_id/" .count($pics) ."</p>";
		$html .= "<p>\n";
		$html .= "<a href=\"?id=$prev_id\">$prev_text</a>\n";
		$html .= "<a href=\"?id=$next_id\">$next_text</a>\n";
		$html .= "</p>\n";
		$html .= "</div>\n";
		
		return $html;	


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
	$file = "bilder2.xml";
	global $xml_tittel_no, $xml_tittel_en, $xml_fil_key, $xml_beskrivelse_no, $xml_beskrivelse_en;
	$xml_tittel_no = "*GALLERI*BILDE*TITTEL*NO";
	$xml_tittel_en = "*GALLERI*BILDE*TITTEL*EN";
	$xml_fil_key = "*GALLERI*BILDE*FILNAVN";
	$xml_beskrivelse_no = "*GALLERI*BILDE*BESKRIVELSE*NO";
	$xml_beskrivelse_en = "*GALLERI*BILDE*BESKRIVELSE*EN";

	global $bilder;
	global $counter;
	$counter = 0;

	class bilde {
		var $tittel_no, $tittel_en, $filnavn, $beskrivelse_no, $beskrivelse_en;
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
		global $current_tag, $xml_tittel_no, $xml_tittel_en, $xml_fil_key, $xml_beskrivelse_no, $xml_beskrivelse_en, $counter, $bilder;
		$data = pro_charset_hax($data, false);
		switch($current_tag) {
			case $xml_tittel_no:
				$bilder[$counter] = new bilde();
				$bilder[$counter]->tittel_no = $data;
				break;
			case $xml_tittel_en:
				$bilder[$counter]->tittel_en = $data;
				break;
			case $xml_fil_key:
				$bilder[$counter]->filnavn = $data;
				break;
			case $xml_beskrivelse_no:
				$bilder[$counter]->beskrivelse_no = $data;
				break;
			case $xml_beskrivelse_en:
				$bilder[$counter++]->beskrivelse_en = $data;
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

	return $bilder;

}


?>
