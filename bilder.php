<?php
	$files = Array();
	$dir = opendir("bilder/");
	$i = 0;
	while(($file = readdir($dir)) !== false) {
		if (!preg_match("/^\./", $file)) {
			array_push($files, $file); 
		}
	}
	sort($files);

	$doc = new DomDocument('1.0');
	$root = $doc->createElement('galleri');
	$root = $doc->appendChild($root);
	foreach($files as $file) {
		$s = $doc->createElement('bilde');
		$s = $root->appendChild($s);
		$name = $doc->createTextNode($file);
		$name = $s->appendChild($name);
	}
	header('Content-Type: application/xml; charset=UTF-8');
	print $doc->saveXML();
?>
