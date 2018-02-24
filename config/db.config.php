<?php

if ( isset( $_SERVER['HTTP_HOST'] ) && $_SERVER['HTTP_HOST'] === 'mariacollege-staging.cejqemk4-liquidwebsites.com' ) {
	return [
		'driver'   => 'mysql',
		'dbname'   => DB_NAME,
		'host'     => 'localhost',
		'user'     => DB_USER,
		'password' => DB_PASSWORD,
		'errmode'  => PDO::ERRMODE_EXCEPTION
	];
} else if ( isset( $_SERVER['HTTP_HOST'] ) && $_SERVER['HTTP_HOST'] === 'mariacollege.edu' ) {
	return [
		'driver'   => 'mysql',
		'dbname'   => DB_NAME,
		'host'     => 'localhost',
		'user'     => DB_USER,
		'password' => DB_PASSWORD,
		'errmode'  => PDO::ERRMODE_EXCEPTION
	];
}

return [
	'driver'   => 'mysql',
	'dbname'   => DB_NAME,
	'host'     => DB_HOST,
	'user'     => DB_USER,
	'password' => DB_PASSWORD,
	'errmode'  => PDO::ERRMODE_EXCEPTION
];