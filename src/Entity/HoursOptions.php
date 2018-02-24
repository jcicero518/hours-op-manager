<?php

namespace Amorphous\Plugin\Entity;

/**
 * Class Hours
 *
 * Subclass of Base, contains overrides for mapping
 * property and getters / fluent setters
 *
 * @package Amorphous\Plugin\Entity
 */
class HoursOptions extends Base {

	protected $begin_date;
	protected $end_date;
	protected $mon;
	protected $tue;
	protected $wed;
	protected $thu;
	protected $fri;
	protected $sat;
	protected $sun;

	protected $department;

	protected $mapping = [
		'id' => 'id',
		'begin_date' => 'begindate',
		'end_date' => 'enddate',
		'mon' => 'mon',
		'tue' => 'tue',
		'wed' => 'wed',
		'thu' => 'thu',
		'fri' => 'fri',
		'sat' => 'sat',
		'sun' => 'sun'
	];

	/**
	 * @return mixed
	 */
	public function getBeginDate() {
		return $this->begin_date;
	}

	/**
	 * @param mixed $begin_date
	 *
	 * @return Hours
	 */
	public function setBeginDate( $begin_date ) {
		$this->begin_date = $begin_date;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getEndDate() {
		return $this->end_date;
	}

	/**
	 * @param mixed $end_date
	 *
	 * @return Hours
	 */
	public function setEndDate( $end_date ) {
		$this->end_date = $end_date;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getMon() {
		return $this->mon;
	}

	/**
	 * @param mixed $mon
	 *
	 * @return Hours
	 */
	public function setMon( $mon ) {
		$this->mon = $mon;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getTue() {
		return $this->tue;
	}

	/**
	 * @param mixed $tue
	 *
	 * @return Hours
	 */
	public function setTue( $tue ) {
		$this->tue = $tue;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getWed() {
		return $this->wed;
	}

	/**
	 * @param mixed $wed
	 *
	 * @return Hours
	 */
	public function setWed( $wed ) {
		$this->wed = $wed;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getThu() {
		return $this->thu;
	}

	/**
	 * @param mixed $thu
	 *
	 * @return Hours
	 */
	public function setThu( $thu ) {
		$this->thu = $thu;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getFri() {
		return $this->fri;
	}

	/**
	 * @param mixed $fri
	 *
	 * @return Hours
	 */
	public function setFri( $fri ) {
		$this->fri = $fri;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getSat() {
		return $this->sat;
	}

	/**
	 * @param mixed $sat
	 *
	 * @return Hours
	 */
	public function setSat( $sat ) {
		$this->sat = $sat;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getSun() {
		return $this->sun;
	}

	/**
	 * @param mixed $sun
	 *
	 * @return Hours
	 */
	public function setSun( $sun ) {
		$this->sun = $sun;

		return $this;
	}


}