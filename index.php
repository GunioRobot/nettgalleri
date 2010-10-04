<?php
	
	include "functions.php";


	$req = $_SERVER['REQUEST_URI'];

	print "req: $req";


	//$dictionary['content'] = loadContent();

	print translate("innhold/index.html");

?>
