<?php

namespace Amorphous\Plugin\Entity;

/**
 * Class Base
 *
 * @package Amorphous\Plugin\Entity
 */
class Base {

	/**
	 * @var int
	 */
	protected $id = 0;
	/**
	 * @var array
	 */
	protected $mapping = [
		'id' => 'id'
	];

	/**
	 * Make sure we get an integer and not a string ID = "1"
	 *
	 * @return int
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * Set integer ID
	 *
	 * @param $id
	 */
	public function setId($id) {
		$this->id = (int)$id;
	}

	/**
	 * Maps data from subclass methods
	 *
	 * @param $data
	 * @param Base $instance
	 *
	 * @return Base|bool
	 */
	public static function arrayToEntity($data, Base $instance) {
		if ($data && is_array($data)) {
			foreach ($instance->mapping as $dbColumn => $propertyName) {
				$method = 'set' . ucfirst($propertyName);
				$instance->$method($data[$dbColumn]);
			}
			return $instance;
		}
		return false;
	}

	/**
	 * Maps subclass objects into plain arrays
	 *
	 * @return array
	 */
	public function entityToArray() {
		$data = array();
		foreach ($this->mapping as $dbColumn => $propertyName) {
			$method = 'get' . ucfirst($propertyName);
			$data[$dbColumn] = $this->$method() ? $this->method() : NULL;
		}
		return $data;
	}
}