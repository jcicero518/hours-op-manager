<?php

namespace Amorphous\Plugin;

use Amorphous\Plugin\API\RestController;
use Amorphous\Plugin\Admin\Actions;
use Amorphous\Plugin\Entity\Hours;
use Amorphous\Plugin\Iterator\LargeFile;
use Amorphous\Plugin\Database\Connection;
use Amorphous\Plugin\Date\Date;
use ArrayIterator;

/**
 * Class Plugin
 *
 * Main plugin class - no more /includes/class-name-of-the-plugin-with-something.php
 *
 * @package Amorphous\Plugin
 */
class Plugin {

	/**
	 * @var Plugin instance
	 */
	protected static $instance;
	protected $adminActions;
	protected $carbonDate;

	/**
	 * Plugin constructor.
	 *
	 * Invoking does nothing right now, but allows
	 * for autoloader to find and cache the class
	 */
	public function __construct() {
		$this->adminActions = new Actions();
		$this->carbonDate = new Date();
	}

	/**
	 * Get instance of class - singleton pattern
	 *
	 * @return Plugin
	 */
	public static function getInstance() {
		if ( self::$instance === NULL ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Prevent the class from being cloned
	 *
	 * @return void
	 */
	protected function __clone() {
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; uh?' ), '1.0' );
	}

	/**
	 * Proxy for Admin\Actions
	 *
	 * @param $method
	 * @param $arguments
	 *
	 * @return mixed
	 */
	public function __call( $method, $arguments ) {
		return call_user_func_array( [$this->adminActions, $method], $arguments );
	}

	/**
	 * Invokes Actions method - no DI here due to
	 * $this not having the right scope
	 *
	 * @return void
	 */
	public function definePublicHooks() {
		add_action( 'wp_enqueue_scripts', function() {
			wp_enqueue_style( 'hours-op-manager-css', HOURS_OP_MANAGER_BASE_PATH . 'public/hours-op-manager.css' );
		});
	}

	/**
	 * Encapsulates addition of WP admin actions for
	 * adding a menu item and adding shortcodes
	 *
	 * @return void
	 */
	public function defineAdminHooks() {
		add_action( 'admin_menu', [Actions::class, 'addAdminMenus'] );
		add_action( 'admin_enqueue_scripts', [Actions::class, 'addScripts'] );
		add_action( 'init', [Actions::class, 'addShortCodes'] );
		add_action( 'init', function() {
			add_action( 'wp_ajax_upload_department_file', [$this, 'uploadDepartmentFile'] );
		});
		new RestController();
	}

	public function uploadDepartmentFile() {
		// make sure the request is valid
		wp_verify_nonce( filter_input( INPUT_POST, '_nonce', FILTER_SANITIZE_STRING ) );
		// get the department id
		$deptId = filter_input( INPUT_POST, 'departmentId', FILTER_SANITIZE_NUMBER_INT );

		if ( isset( $_FILES['file'], $deptId ) ) {
			$wpFile = wp_handle_upload( $_FILES['file'], Helpers::uploader_overrides() );

			if ( ! isset( $wpFile['error'] ) ) {
				// process csv file
				$largeFile = new LargeFile( $wpFile['file'] );
				$iterator  = $largeFile->getIterator( 'Csv' );

				$rawHeaders     = $iterator->current();
				$headerIterator = new ArrayIterator();
				foreach ( $rawHeaders as $header ) {
					$headerIterator->append( strtolower( str_replace( ' ', '_', $header ) ) );
				}

				$csvObject = new \stdClass();

				$headers = $headerIterator->getArrayCopy();

				$csvObject->headers = $headers;
				$csvObject->department = $deptId;

				$iterator->next();
				foreach ( $iterator as $row ) {
					$csvObject->body[] = array_combine( $headers, $row );
				}

				update_option( 'hours_op_manager_csv_' . $deptId, $csvObject );
				$this->carbonDate->setTransientLastDate( $deptId );
				// delete temp wp file
				wp_delete_file( $wpFile['file'] );
				echo json_encode( 'Successfully uploaded csv file' );
			} else {
				echo json_encode( $wpFile['error'] );
			}
		}

		exit;
	}

	/**
	 * Run the thing
	 *
	 * @return void
	 */
	public function run() {
		$this->definePublicHooks();
		$this->defineAdminHooks();
	}
}