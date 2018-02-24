<?php
/*
Plugin Name: Hours Op Manager
Plugin URI:  https://amorphouswebsolutions.com
Description: Hours of Operation Manager - Adds a new menu item to WP called "Manage Hours of Operation" where you can upload a CSV file.
Version:     1.0
Author:      Jeff Cicero
Author URI:  https://amorphouswebsolutions.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: hours-op-manager
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'HOURS_OP_MANAGER_VERSION', '1.0' );
define( 'HOURS_OP_MANAGER_SCHEMA', '1.0' );
global $wpdb;

if ( ! defined( 'HOURS_OP_MANAGER_CURRENT_ENVI' ) ) {
	define( 'HOURS_OP_MANAGER_CURRENT_ENVI', 'development' );
}

if ( ! defined( 'HOURS_TABLE' ) ) {
	define( 'HOURS_TABLE', $wpdb->prefix . 'hours_of_operation' );
}

if ( ! defined( 'HOURS_DEPT_TABLE' ) ) {
	define( 'HOURS_DEPT_TABLE', $wpdb->prefix . 'hours_of_operation_dept' );
}

if ( ! defined( 'HOURS_OP_MANAGER_TRANS_LAST_NAME' ) ) {
	define( 'HOURS_OP_MANAGER_TRANS_LAST_NAME', '_hours_op_manager_last_upload' );
}

if ( ! defined( 'HOURS_OP_MANAGER_DB_CONFIG_FILE' ) ) {
	define( 'HOURS_OP_MANAGER_DB_CONFIG_FILE', __DIR__ . '/config/db.config.php' );
}

if ( ! defined( 'HOURS_OP_MANAGER_BASE_PATH' ) ) {
	define( 'HOURS_OP_MANAGER_BASE_PATH', trailingslashit( plugins_url( 'hours-op-manager' ) ) );
}

/**
 * Fix any mixed line endings
 */
ini_set( 'auto_detect_line_endings', TRUE );

/**
 * Require all components needed for plugin
 */
require plugin_dir_path( __FILE__ ) . '/vendor/autoload.php';

use Amorphous\Plugin\Activate;
use Amorphous\Plugin\Plugin;

register_activation_hook( __FILE__, [Activate::class, 'activate'] );
register_deactivation_hook( __FILE__, [Activate::class, 'deactivate'] );

function hours_op_initialize() {
	$hoursOpManager = Plugin::getInstance();
	$hoursOpManager->run();
}

add_action( 'plugins_loaded', 'hours_op_initialize' );