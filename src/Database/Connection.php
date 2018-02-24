<?php

namespace Amorphous\Plugin\Database;

use Exception;
use wpdb;

/**
 * Class Connection
 *
 * Abstract away using $wpdb directly. Uses existing
 * WP DB connection
 *
 * @package Amorphous\Plugin\Database
 */
class Connection {

	/**
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Sets up connection to DB through WP's
	 * $wpdb global
	 *
	 * Connection constructor.
	 *
	 * @param wpdb $database
	 */
	public function __construct( wpdb $database ) {
		try {
			$connected = $database->check_connection();

			if ($connected) {
				$this->wpdb = $database;
			}
		} catch (\Throwable $e) {
			echo $e->getMessage();
		}
	}

	/**
	 * Sanitize SQL strings
	 *
	 * @param string $sql
	 * @param array $args
	 *
	 * @return string
	 */
	public function prepare( $sql, array $args ) {
		return $this->wpdb->prepare($sql, $args);
	}

	/**
	 * Execute query SQL
	 *
	 * @param string $sql
	 */
	public function query( $sql ) {
		try {
			$this->wpdb->query($sql);
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}

	public function getLastResult() {
		return $this->wpdb->last_result;
	}

	public function getLastQuery() {
		return $this->wpdb->last_query;
	}

	/**
	 * Abstraction of $wpdb->get_results, returns
	 * data as associative array similar to PDO::FETCH_ASSOC
	 *
	 * @param string $sql
	 *
	 * @return array|bool|null|object
	 */
	public function getResults( $sql ) {
		$result = false;

		try {
			$result = $this->wpdb->get_results($sql, ARRAY_A);
		} catch (Exception $e) {
			echo $e->getMessage();
		}

		return $result;
	}
}