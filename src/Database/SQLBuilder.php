<?php

namespace Amorphous\Plugin\Database;

/**
 * Class SQLBuilder
 *
 * Separate static SQL builder for INSERTS into
 * separate table for CSV
 *
 * @package Amorphous\Plugin\Database
 */
class SQLBuilder {

	protected static $instance;

	public static $sql = '';

	public static $prefix = '';
	public static $cols = '';
	public static $values = '';
	public static $prepareString = '';
	public static $prepareArgs = [];

	/**
	 * Kick things off. Set instance and basic INSERT
	 * sql prefix
	 *
	 * @param string $table
	 *
	 * @return SQLBuilder
	 */
	public static function start( $table = HOURS_TABLE ) {
		if ( NULL === self::$instance ) {
			self::$instance = new self();
		}

		self::$prefix = 'INSERT INTO ' . $table . ' ';

		return self::$instance;
	}

	/**
	 * Prepare columns for insert.
	 * Replace any unfriendly spaces in table column
	 * name values with underscores
	 *
	 * @param mixed(string|array) $cols
	 *
	 * @return null
	 */
	public static function prepCols( $cols = NULL ) {
		if ( is_array( $cols ) ) {
			self::$cols = '(' . implode(',', str_replace( ' ', '_', $cols ) ) . ') ';
		} else {
			self::$cols = '(' . str_replace( ' ', '_', $cols ) . ') ';
		}

		return self::$instance;
	}

	/**
	 * Set VALUES set of insert SQL statement.
	 * Loop through all values to INSERT and setup
	 * the appropriate placeholder parameters for WP
	 * mysqli
	 *
	 * @param mixed(string|array) $values
	 *
	 * @return self
	 */
	public static function prepValues( $values = NULL ) {
		if ( is_array( $values ) ) {
			$value_types = [];
			foreach ( $values as $value ) {

				switch ($value) {
					case '':
						$value_types[] = '%s';
						break;
					case ( \is_int( $value ) ):
						$value_types[] = '%d';
						break;
					case ( \is_string( $value ) ):
						$value_types[] = '%s';
						break;
					default:
						$value_types[] = '%s';
				}
			}

			if ( \count( $value_types ) ) {
				self::$values = 'VALUES (' . implode( ',', $value_types ) . ')';
			}
		} else {
			self::$values = 'VALUES (' . $values . ')';
		}

		return self::$instance;
	}

	/**
	 * Glue the SQL components together
	 *
	 * @return null
	 */
	public static function prepForQuery() {
		self::$sql = self::$prefix . self::$cols . self::$values;
		return self::$instance;
	}

	/**
	 * Return SQL string
	 *
	 * @return string
	 */
	public static function getPrepQuery() {
		return trim( self::$sql );
	}


}