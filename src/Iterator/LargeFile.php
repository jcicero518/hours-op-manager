<?php

namespace Amorphous\Plugin\Iterator;

use Exception;
use InvalidArgumentException;
use SplFileObject;
use NoRewindIterator;

/**
 * Class LargeFile
 *
 * File reader using SPL library
 *
 * @package Amorphous\Plugin\Iterator
 */
class LargeFile {

	const ERROR_UNABLE = 'ERROR: Unable to open file';
	const ERROR_TYPE = 'ERROR: Type must be "ByLength", "ByLine", or "Csv"';

	protected $file;
	protected $allowed_types = [ 'ByLine', 'ByLength', 'Csv' ];

	/**
	 * LargeFile constructor.
	 *
	 * @param $filename
	 * @param string $mode
	 *
	 * @throws Exception
	 *
	 * Populates $file with new SPL File object instance.
	 */
	public function __construct($filename, $mode = 'r') {
		if (!file_exists($filename)) {
			$message = __METHOD__ . ' : ' . self::ERROR_UNABLE . PHP_EOL;
			$message .= strip_tags($filename) . PHP_EOL;
			throw new Exception($message);
		}
		$this->file = new SplFileObject($filename, $mode);
	}

	/**
	 * @return \Generator|int
	 *
	 * References SplFileObject method to read the file one line
	 * at a time with fgets.
	 *
	 * Suitable for smaller text files like Csvs and / or
	 * include line feeds.
	 */
	protected function fileIteratorByLine() {
		$count = 0;

		while (!$this->file->eof()) {
			yield $this->file->fgets();
			$count++;
		}
	}

	/**
	 * @param $numBytes
	 *
	 * @return \Generator|int
	 *
	 * References SplFileObject method to read the file one line
	 * at a time with freads.
	 *
	 * Suitable for larger binary files.
	 */
	protected function fileIteratorByLength($numBytes) {
		$count = 0;

		while (!$this->file->eof()) {
			yield $this->file->fread($numBytes);
			$count++;
		}
	}

	/**
	 * References SplFileObject method to read the file one line
	 * at a time with fgetcsv.
	 *
	 * @return \Generator|int
	 */
	protected function fileIteratorCsv() {
		$count = 0;

		while (!$this->file->eof()) {
			yield $this->file->fgetcsv();
			$count++;
		}
	}

	/**
	 * @param string $type
	 * @param null $numBytes
	 *
	 * @return NoRewindIterator
	 */
	public function getIterator($type = 'ByLine', $numBytes = null) {
		if (!in_array($type, $this->allowed_types)) {
			$message = __METHOD__ . ' : ' . self::ERROR_TYPE . PHP_EOL;
			throw new InvalidArgumentException($message);
		}
		$iterator = 'fileIterator' . $type;
		return new NoRewindIterator($this->$iterator($numBytes));
	}
}