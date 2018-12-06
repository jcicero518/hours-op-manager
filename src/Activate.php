<?php

namespace Amorphous\Plugin;

use Amorphous\Plugin\Database\Connection;

class Activate {

	public static $charset_collate = '';
	public static $prefix = 'wp_';

	public static function activate() {
		global $wpdb;

		if ( !empty( $wpdb->charset ) ) {
			self::$charset_collate = 'DEFAULT CHARACTER SET ' . $wpdb->charset;
		}

		if ( !empty( $wpdb->collate ) ) {
			self::$charset_collate .= ' COLLATE=' . $wpdb->collate;
		}

		if ( $wpdb->prefix !== 'wp_' ) {
			self::$prefix = $wpdb->prefix;
		}

		self::installSchema();
	}

	public static function deactivate() {
		global $wpdb;

		if ( $wpdb->prefix !== 'wp_' ) {
			self::$prefix = $wpdb->prefix;
		}

		self::deleteSchema();
	}

	private static function getSchemaSql() {
		return 'CREATE TABLE IF NOT EXISTS `' . self::$prefix . 'hours_of_operation` (
			`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			`did` int(11) unsigned NOT NULL DEFAULT \'0\',
  			`begin_date` varchar(20) DEFAULT NULL,
	  		`end_date` varchar(20) DEFAULT NULL,
	  		`mon` varchar(64) DEFAULT NULL,
	  		`tue` varchar(64) DEFAULT NULL,
	  		`wed` varchar(64) DEFAULT NULL,
	  		`thu` varchar(64) DEFAULT NULL,
	  		`fri` varchar(64) DEFAULT NULL,
	  		`sat` varchar(64) DEFAULT NULL,
	  		`sun` varchar(64) DEFAULT NULL,
	  		PRIMARY KEY (`id`),
	  		KEY `DEPTID` (`did`)
		  ) ENGINE=InnoDB ' . self::$charset_collate;
	}

	private static function getSchemaDeptSql() {
		return 'CREATE TABLE IF NOT EXISTS `' . self::$prefix . 'hours_of_operation_dept` (
			`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
            `label` varchar(128) DEFAULT NULL,
            PRIMARY KEY (`id`)
		  ) ENGINE=InnoDB ' . self::$charset_collate;
	}

	/**
	 * Add sample department name
	 * @return string
	 */
	private static function getSampleDeptSql() {
		return 'INSERT INTO `' . self::$prefix . 'hours_of_operation_dept` (`label`) VALUES (\'First Department\')';
	}

	private static function installSchema() {
		global $wpdb;
		$connection = new Connection( $wpdb );

		$sql[] = self::getSchemaSql();
		$sql[] = self::getSchemaDeptSql();
		$sql[] = self::getSampleDeptSql();

		foreach( $sql as $value ) {
			$connection->query( $value );
		}
	}

	private static function deleteSchema() {
		global $wpdb;
		$connection = new Connection( $wpdb );
		$sql[] = 'DROP TABLE IF EXISTS `' . self::$prefix . 'hours_of_operation`';
		$sql[] = 'DROP TABLE IF EXISTS `' . self::$prefix . 'hours_of_operation_dept`';

		foreach( $sql as $value ) {
			$connection->query( $value );
		}

	}
}