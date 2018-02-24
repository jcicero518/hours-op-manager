<?php

namespace Amorphous\Plugin\Database;

use Exception;
use PDOException;
use PDO;

/**
 * Class Connection
 * Main DB connection class
 *
 * @package PDOConnection
 */
class PDOConnection {

	/**
	 * const ERROR_UNABLE - used for exception message
	 */
	const ERROR_UNABLE = 'ERROR: Unable to create database connection';
	protected static $instance;
	/**
	 * @var PDO
	 */
	public $pdo;

	/**
	 * Connection constructor.
	 * Sets up a connection to a DB given an array of config options
	 *
	 * @param array $config
	 * @throws Exception
	 */
	public function __construct(array $config) {
		if (!isset($config['driver'])) {
			$message = __METHOD__ . ' : ' . self::ERROR_UNABLE . PHP_EOL;
			throw new Exception($message);
		}

		$dsn = $config['driver']
			. ':host=' . $config['host']
			. ';dbname=' . $config['dbname'];

		try {
			$this->pdo = new PDO($dsn,
				$config['user'],
				$config['password'],
				[PDO::ATTR_ERRMODE => $config['errmode']]
			);
		} catch (PDOException $e) {
			error_log($e->getMessage());
			echo $e->getMessage();
		}
	}

	/**
	 * Get instance of class - singleton pattern
	 *
	 * @return PDOConnection
	 */
	public static function getInstance() {
		if ( self::$instance === NULL ) {
			self::$instance = new self( include HOURS_OP_MANAGER_DB_CONFIG_FILE );
		}

		return self::$instance;
	}

	public function __call( $method, $arguments ) {
		return call_user_func_array( [$this->pdo, $method], $arguments );
	}
}