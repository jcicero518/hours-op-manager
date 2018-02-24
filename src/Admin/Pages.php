<?php

namespace Amorphous\Plugin\Admin;

use Amorphous\Plugin\Iterator\LargeFile;
use Amorphous\Plugin\Date\Date;
use Exception;
use ArrayIterator;
use Amorphous\Plugin\Plugin;
use Amorphous\Plugin\Database\Connection;
use Amorphous\Plugin\Database\SQLBuilder;
use Amorphous\Plugin\Helpers;

/**
 * Class Pages
 *
 * WP admin menu page callback methods
 *
 * @package Amorphous\Plugin\Admin
 */
class Pages {

	/**
	 * const TABLE - default hours table
	 */
    const TABLE = HOURS_TABLE;

	/**
     * Main WP Admin Menu page callback. Wanted
     * to use a trait here but scope for $this is
     * elsewhere
     *
	 * @throws Exception
     * @return void
	 */
	public function managePage() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Sorry, you don\'t have access.' );
		}


		$carbonDate = new Date();

		if ( isset( $_POST['submit'] ) ) {
			if ( $_FILES['file'] ) {
			    global $wpdb;

			    $wpFile = wp_handle_upload( $_FILES['file'], Helpers::uploader_overrides() );

			    if ( ! isset( $wpFile['error'] ) ) {
				    $largeFile = new LargeFile( $wpFile['file'] );
				    $iterator  = $largeFile->getIterator( 'Csv' );

				    $rawHeaders     = $iterator->current();
				    $headerIterator = new ArrayIterator();
				    foreach ( $rawHeaders as $header ) {
					    $headerIterator->append( strtolower( "`$header`" ) );
				    }

				    $headers = $headerIterator->getArrayCopy();

				    // Check our DB connection
				    $connection = new Connection( $wpdb );
				    // wipe it for updates
				    $connection->query( Helpers::get_truncate_sql() );

				    // move on to the meat of the data
				    $iterator->next();

				    foreach ( $iterator as $row ) {
					    SQLBuilder::start();
					    SQLBuilder::prepCols( $headers );
					    SQLBuilder::prepValues( $row );
					    SQLBuilder::prepForQuery();

					    $sql       = SQLBuilder::getPrepQuery();
					    $statement = $connection->prepare( $sql, $row );
					    $connection->query( $statement );
				    }

				    // delete temp wp file
				    wp_delete_file( $wpFile['file'] );
				    // set last uploaded date
				    $carbonDate->setTransientLastDate();
				    ?>
                    <div class="notice notice-success">
                        <p><strong>Successfully uploaded CSV file.</strong></p>
                    </div>
                    <?php
			    } else {
			        ?>
                    <div class="notice notice-error">
                        <p><strong><?= $wpFile['error']; ?></strong></p>
                    </div>
                    <?php
                }
			} else {
			    throw new Exception( 'No $_FILES global available' );
            }
		}
		?>
		<div class="wrap about-wrap hours-op-manager-container">
			<h1><?= esc_html(get_admin_page_title()); ?></h1>
            <div id="app-container">
                <noscript>
                    <div class="notice notice-error">
                        <p><strong>Please enable JavaScript in order to use this functionality.</strong></p>
                    </div>
                </noscript>
            </div>
		</div>
		<?php
	}
}