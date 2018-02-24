<?php

namespace Amorphous\Plugin;

/**
 * Class Helpers
 *
 * Some helpers to remove some clutter from other
 * classes. Originally a Trait, but $this scope
 * in WP is wonky
 *
 * @package Amorphous\Plugin
 */
class Helpers {

	/**
	 * Generates array properties to feed into the
	 * WP file uploader - wp_handle_upload
	 *
	 * @return array
	 */
	public static function uploader_overrides() {
		return [
			//'action' => 'csv-upload-parse',
			'test_form' => FALSE,
			'mimes'  => [
				'csv' => 'text/csv'
			]
		];
	}

	/**
	 * Simple SQL string for truncating the Hours
	 * table before subsequent uploads
	 *
	 * @return string
	 */
	public static function get_truncate_sql() {
		return 'TRUNCATE TABLE `' . HOURS_TABLE . '`';
	}

}