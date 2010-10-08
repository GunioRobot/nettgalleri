<?php
	
	include "functions.php";

	$request = isset($_GET['page']) ? $_GET['page'] : "hjem";

	$dictionary['content'] =  array($lang => load_content($request));
	$file = "innhold/index.html";
	print translate($file);

?>
