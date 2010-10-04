<?php
	
	include "functions.php";

	if(isset($_GET['page'])) {
		$request = $_GET['page'];
	} else {
		$request = "hjem";
	}	

	$dictionary['content'] =  array($lang => load_content($request));
	$file = "innhold/index.html";
	print translate($file);
?>
