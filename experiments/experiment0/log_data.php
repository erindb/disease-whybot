<html>
	<head>
		<title>experiment data logger</title>
	</head>
	<body>
		<?php
	    header("Access-Control-Allow-Origin: *");
		$input = $_GET["input"];
		$userid = $_GET["userid"];
		$file = "../../data/".$userid.'.txt';
		// The new person to add to the file
		$data = $input."\n";
		// Write the contents to the file, 
		// using the FILE_APPEND flag to append the content to the end of the file
		// and the LOCK_EX flag to prevent anyone else writing to the file at the same time
		file_put_contents($file, $data, FILE_APPEND | LOCK_EX);
		?>
	</body>
</html>
