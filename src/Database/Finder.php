<?php

namespace Amorphous\Plugin\Database;

/**
 * Class Finder
 *
 * Static SQL builder for various SELECT statements
 *
 * @package Amorphous\Plugin\Database
 */
class Finder {

	/**
	 * @var Finder instance
	 */
	protected static $instance;
	/**
	 * @var string
	 */
	public static $sql = '';
	/**
	 * @var string
	 */
	public static $prefix = '';
	/**
	 * @var string
	 */
	public static $join = '';
	/**
	 * @var array
	 */
	public static $where = [];
	/**
	 * @var string
	 */
	public static $group = '';
	/**
	 * @var array
	 */
	public static $control = ['', ''];

	/**
	 * @param $table
	 * @param null $cols
	 *
	 * @return Finder
	 *
	 * Returns singleton instance of class
	 */
	public static function select($table, $cols = NULL) {
		if ( NULL === self::$instance ) {
			self::$instance = new self();
		}

		if ($cols) {
			self::$prefix = 'SELECT ' . $cols . ' FROM ' . $table;
		} else {
			self::$prefix = 'SELECT * FROM ' . $table;
		}

		return self::$instance;
	}

	/**
	 * @param null $filter
	 *
	 * @return Finder
	 */
	public static function where($filter = NULL) {
		self::$where[0] = ' WHERE ' . $filter;
		return self::$instance;
	}

	/**
	 * @param $join1
	 * @param $join2
	 *
	 * @return Finder
	 */
	public static function innerJoin($join1, $join2) {
		self::$join = ' INNER JOIN ' . $join1 . ' ON ' . $join2;
		return self::$instance;
	}

	/**
	 * @param $a
	 * @param $b
	 *
	 * @return Finder
	 */
	public static function like($a, $b) {
		self::$where[] = trim($a . ' LIKE ' . $b);
		return self::$instance;
	}

	/**
	 * @param null $a
	 *
	 * @return Finder
	 */
	public static function sqlAnd($a = NULL) {
		self::$where[] = trim('AND ' . $a);
		return self::$instance;
	}

	/**
	 * @param null $a
	 *
	 * @return Finder
	 */
	public static function sqlOr($a = NULL) {
		self::$where[] = trim('OR' . $a);
		return self::$instance;
	}

	/**
	 * @param array $a
	 *
	 * @return Finder
	 */
	public static function sqlIn(array $a) {
		self::$where[] = 'IN ( ' . implode(',', $a) . ' )';
		return self::$instance;
	}

	/**
	 * @param null $a
	 *
	 * @return Finder
	 */
	public static function sqlNot($a = NULL) {
		self::$where[] = trim('NOT ' . $a);
		return self::$instance;
	}

	/**
	 * @param $limit
	 *
	 * @return Finder
	 */
	public static function limit($limit) {
		self::$control[0] = 'LIMIT ' . $limit;
		return self::$instance;
	}

	/**
	 * @param $offset
	 *
	 * @return Finder
	 */
	public static function offset($offset) {
		self::$control[1] = 'OFFSET ' . $offset;
		return self::$instance;
	}

	/**
	 * @param array $fields
	 *
	 * @return Finder
	 */
	public static function group(array $fields) {
		self::$group = 'GROUP BY ' . implode(',', $fields);
		return self::$instance;
	}

	/**
	 * Glue the pieces together and return
	 * final SQL string for validation
	 *
	 * @return string
	 */
	public static function getSql() {
		self::$sql = self::$prefix . self::$join . implode(' ', self::$where)
			. ' '
		    . self::$group
		             . ' '
			. self::$control[0]
			. ' '
			. self::$control[1];

		preg_replace('/ /', ' ', self::$sql);
		return trim(self::$sql);
	}
}