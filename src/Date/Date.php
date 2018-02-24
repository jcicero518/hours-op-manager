<?php

namespace Amorphous\Plugin\Date;

use Carbon\Carbon;

/**
 * Class Date
 *
 * Uses Carbon package to extend PHP's
 * native DateTime functionality
 *
 * @package Amorphous\Plugin\Date
 */
class Date {

	/**
	 * const string default format from CSV
	 */
	const DATE_FORMAT = 'n/d/y';
	/**
	 * const string timezone
	 */
	const TZ = 'America/New_York';

	/**
	 * Date constructor.
	 *
	 * @param Carbon $carbon
	 */
	public function __construct() {
		/* TODO: remove or setup with DI */
	}

	/**
	 * Compare begin and end dates with current date to determine
	 * whether it's "between" them
	 *
	 * @param $beginDate
	 * @param $endDate
	 *
	 * @return bool
	 */
	public function compareDates( $beginDate, $endDate ) {
		$begin = Carbon::parse( $beginDate );
		$end = Carbon::parse( $endDate );
		return Carbon::now()->between( $begin, $end );
		//return Carbon::create( 2017, 6, 29 )->between( $begin, $end );
	}

	/**
	 * Helper function - returns Carbon instance of a date
	 *
	 * @param $date
	 *
	 * @return string
	 */
	public function getParsedDate( $date ) {
		return Carbon::parse( $date )->format( self::DATE_FORMAT );
	}

	/**
	 * Get string representation of date in specified format
	 *
	 * @param $date
	 * @param string $format
	 *
	 * @return string
	 */
	public function getFormattedDate( $date, $format = self::DATE_FORMAT ) {
		if ( $date instanceof Carbon ) {
			return $date->format( $format );
		}
		return Carbon::now( self::TZ )->format( $format );
	}

	/**
	 * Set WP transient with current date for last upload
	 *
	 * @return void
	 */
	public function setTransientLastDate( $deptId = 1 ) {
		set_transient( HOURS_OP_MANAGER_TRANS_LAST_NAME . '_' . $deptId, Carbon::now( self::TZ ), 0 );
	}

	/**
	 * Get value of last upload date from WP transient
	 * with custom date formatting
	 *
	 * @return string
	 */
	public function getTransientLastDate( $deptId = 1 ) {
		if ( get_transient( HOURS_OP_MANAGER_TRANS_LAST_NAME . '_' . $deptId ) ) {
			return $this->getFormattedDate( get_transient( HOURS_OP_MANAGER_TRANS_LAST_NAME . '_' . $deptId ), 'F d, Y g:i:s a' );
		}
		return 'Not yet';
	}

}