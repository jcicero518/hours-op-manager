<?php

namespace Amorphous\Plugin\Admin;

use Amorphous\Plugin\Date\Date;
use Amorphous\Plugin\Database\PDOConnection as Connection;
use Amorphous\Plugin\Entity\HoursRepository;
use Carbon\Carbon;

/**
 * Class Actions
 *
 * @package Amorphous\Plugin\Admin
 */
class Actions {

    protected $hoursRepository;
    protected static $pages;
    protected $carbonDate;

    protected $hoursInstance;
    protected $formattedBeginDate;

    public function __construct() {
        $this->hoursRepository = new HoursRepository( Connection::getInstance() );
        static::$pages = new Pages();
        $this->carbonDate = new Date();
        $this->displayHoursTable();
    }

	/**
	 * Adds menu page with WPs internal function
     *
     * @return void
	 */
	public static function addAdminMenus() {
		add_menu_page(
			'Hours of Operation Manager',
			'Manage Hours of Operation',
			'manage_options',
			'manage-hours-of-operation',
			[static::$pages, 'managePage'],
			'dashicons-feedback'
		);
	}

	/**
	 * Encapsulates enqueue_admin_scripts action
     *
     * @return void
	 */
	public static function addScripts() {
	    $env = ( NULL !== HOURS_OP_MANAGER_CURRENT_ENVI ) ? HOURS_OP_MANAGER_CURRENT_ENVI : 'development';

		$uploadNonce = wp_create_nonce( 'upload_department_file' );

		$wp_all_options = wp_load_alloptions();
		$uploadOptions = array_filter( $wp_all_options, function( $arrayItem ) {
			return ( strpos( $arrayItem, '_transient__hours_op_manager_last_upload_') !== FALSE );
		}, ARRAY_FILTER_USE_KEY );

		$csvOptions = array_filter( $wp_all_options, function( $arrayItem ) {
			return ( strpos( $arrayItem, 'hours_op_manager_csv_') !== FALSE );
		}, ARRAY_FILTER_USE_KEY );

		$uploadDates = array_map( function( $option ) {
			return Carbon::parse( unserialize( $option, [Carbon::class] ) )->format( 'F d, Y g:i:s a' );
		}, $uploadOptions );

	    if ( $env === 'development' ) {
		    wp_enqueue_style( 'hours-op-manager-admin-css', HOURS_OP_MANAGER_BASE_PATH . 'dist/appStyle.min.css' );
		    wp_enqueue_script( 'hours-op-manager-admin-manifest', HOURS_OP_MANAGER_BASE_PATH . 'dist/manifest.bundle.js', [], '1.0', true );
		    wp_enqueue_script( 'hours-op-manager-admin-vendor', HOURS_OP_MANAGER_BASE_PATH . 'dist/vendor.bundle.js', [], '1.0', true );
		    wp_enqueue_script( 'hours-op-manager-admin', HOURS_OP_MANAGER_BASE_PATH . 'dist/app.bundle.js', ['jquery'], '1.0', true );
		    wp_localize_script( 'hours-op-manager-admin', 'HOM_WP_API', [
		       'ajax_url' => admin_url( 'admin-ajax.php' ),
               'rest_url' => rest_url(),
               'hours_op_options' => [
	               'upload_dates' => $uploadDates,
	               'csv_options' => $csvOptions
               ],
               'uploadNonce' => $uploadNonce
            ]);
	    } else {
		    wp_enqueue_style( 'hours-op-manager-admin-css', HOURS_OP_MANAGER_BASE_PATH . 'build/dist/appStyle.min.css' );
		    wp_enqueue_script( 'hours-op-manager-admin-manifest', HOURS_OP_MANAGER_BASE_PATH . 'build/dist/manifest.bundle.js', [], '1.0', true );
		    wp_enqueue_script( 'hours-op-manager-admin-vendor', HOURS_OP_MANAGER_BASE_PATH . 'build/dist/vendor.bundle.js', [], '1.0', true );
		    wp_enqueue_script( 'hours-op-manager-admin', HOURS_OP_MANAGER_BASE_PATH . 'build/dist/app.bundle.js', [], '1.0', true );
		    wp_localize_script( 'hours-op-manager-admin', 'HOM_WP_API', [
			    'ajax_url' => admin_url( 'admin-ajax.php' ),
			    'rest_url' => rest_url(),
			    'hours_op_options' => [
				    'upload_dates' => $uploadDates,
				    'csv_options' => $csvOptions
			    ],
			    'uploadNonce' => $uploadNonce
		    ]);
        }
    }

	/**
	 * Encapsulates hours table WP action in closure with
     * customizable arguments from shortcode implementation
     *
     * TODO: Break this up into smaller coupled classes - SOLID & DRY!
     *
     * @throws \Exception with generic message
     * @return void
	 */
	public function displayHoursTable() {

		add_action( 'display_hours_options_table', function( $args ) {
			$tdWidth = \is_int( $args['tdwidth'] ) ? ' width="' . $args['tdwidth'] . '"' : '';
			$department = $args['department'];
			$rawOptions = get_option( 'hours_op_manager_csv_' . $department );
            $hoursOptions = $rawOptions->body;

			$rowId = 0;
			foreach ( $hoursOptions as $id => $hoursOption ) {
			    if ( $this->carbonDate->compareDates( $hoursOption['begin_date'], $hoursOption['end_date'] ) ) {
			        $rowId = $id;
                }
            }

            $hoursInstance = $hoursOptions[$rowId];
			$formattedBeginDate = $this->carbonDate->getFormattedDate( $hoursInstance['begin_date'], 'F d, Y' );
            ?>
            <div class="hours-op-table-container">

            <<?= $args['subheadtag']; ?>>Week of <?= $formattedBeginDate ?></<?= $args['subheadtag']; ?>>

            <table>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Monday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['mon']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Tuesday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['tue']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Wednesday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['wed']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Thursday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['thu']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Friday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['fri']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Saturday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['sat']; ?></p></td>
                </tr>
                <tr>
                    <td <?= $tdWidth; ?>><p><strong>Sunday</strong></p></td>
                    <td <?= $tdWidth; ?>><p><?= $hoursInstance['sun']; ?></p></td>
                </tr>
            </table>
            </div>

        <?php

        });
	}

	/**
	 * Encapsulates add_shortcode functionality with optional
     * arguments sent as defaults to action. Uses output
     * buffering
     *
     * @return void
	 */
	public static function addShortCodes() {

		add_shortcode( 'hours_op_options_table', function( $atts ) {
			$output = '';

			$args = shortcode_atts([
				'display' => 'table',
				'department' => 1,
				'tdwidth' => 234,
				'headertag' => 'h4',
				'headertext' => 'Hours of Operation',
				'subheadtag' => 'p'
			], $atts );

			ob_start();
			do_action( 'display_hours_options_table', $args );

			$output .= ob_get_contents();
			ob_end_clean();

			echo $output;
		});
	}
}