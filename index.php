<?php

	include "functions.php";

	$request = isset($_GET['page']) ? $_GET['page'] : "hjem";
	//$id = isset($_GET['id']) ? $_GET['id'] : "1";

	$dictionary['content'] =  array($lang => load_content($request));
	$file = "innhold/index.html";
	print translate($file);

?>
