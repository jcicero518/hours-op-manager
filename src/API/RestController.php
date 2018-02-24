<?php

namespace Amorphous\Plugin\API;

use Amorphous\Plugin\Database\Connection;
use Amorphous\Plugin\Database\SQLBuilder;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class RestController extends WP_REST_Controller {

	protected $namespace = 'hours-op-manager/v1';

	public function __construct() {
		add_action( 'rest_api_init', function() {
			$this->register_routes();
		});
	}
	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @since 4.7.0
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, 'departments', [
			'methods' => WP_REST_Server::READABLE,
			'callback' => [$this, 'get_items'],
			'args' => [],
			'permission_callback' => [$this, 'get_items_permissions_check']
		]);

		register_rest_route( $this->namespace, 'departments/(?P<id>[\d]+)', [
			'methods' => WP_REST_Server::READABLE,
			'callback' => [$this, 'get_item'],
			'args' => [],
			'permission_callback' => [$this, 'get_items_permissions_check']
		]);

		register_rest_route( $this->namespace, 'departments/(?P<id>[\d]+)', [
			'methods' => WP_REST_Server::DELETABLE,
			'callback' => [$this, 'delete_item'],
			'args' => [],
			'permission_callback' => [$this, 'delete_item_permissions_check']
		]);

		register_rest_route( $this->namespace, 'departmentsCreate', [
			'methods' => WP_REST_Server::CREATABLE,
			'callback' => [$this, 'create_item'],
			'args' => [],
			'permissions_callback' => [$this, 'create_item_permissions_check']
		]);
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return TRUE;
	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		global $wpdb;

		$connection = new Connection( $wpdb );
		$sql = 'SELECT * FROM ' . HOURS_DEPT_TABLE;
		$data = $connection->getResults( $sql );

		return rest_ensure_response( $data );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		$params = $request->get_params();
		$id = (int)$params['id'];

		global $wpdb;

		$connection = new Connection( $wpdb );
		$sql = $connection->prepare( 'SELECT * FROM ' . HOURS_DEPT_TABLE . ' WHERE id = %d', [$id] );
		$data = $connection->getResults( $sql );

		return rest_ensure_response( $data );
	}

	public function create_item( $request ) {
		$params = json_decode( $request->get_body() );
		$name = ucwords( $params->name );

		global $wpdb;

		$lastId = false;
		$connection = new Connection( $wpdb );
		// check to make sure dept doesn't exist already
		$sql = $connection->prepare( 'SELECT COUNT(*) as count FROM ' . HOURS_DEPT_TABLE . ' WHERE label = %s', [$name] );
		$count = $connection->getResults( $sql )[0]['count'];

		if ( ! $count ) {
			SQLBuilder::start( HOURS_DEPT_TABLE );
			SQLBuilder::prepCols( ['label'] );
			SQLBuilder::prepValues( ['label' => $name] );
			SQLBuilder::prepForQuery();

			$insertSql = SQLBuilder::getPrepQuery();
			$statement = $connection->prepare( $insertSql, [$name] );
			$connection->query( $statement );
			$connection->query( 'SELECT LAST_INSERT_ID() as lastId' );
			$lastId = $connection->getLastResult()[0]->lastId;
		}

		return rest_ensure_response( $lastId );
	}

	public function create_item_permissions_check( $request ) {
		return TRUE;
	}

	/**
	 * TODO: Remove options table entries for this department as well
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function delete_item( $request ) {
		$params = $request->get_params();
		$dId = (int)$params['id'];

		global $wpdb;

		$connection = new Connection( $wpdb );
		$sql = $connection->prepare( 'DELETE FROM ' . HOURS_DEPT_TABLE . ' WHERE id = %d LIMIT 1', [$dId] );
		$connection->getResults( $sql );

		/*if ( ! $result ) {
			return new WP_Error( 'Cannot delete this item', '', 403 );
		}*/

		$response = new WP_REST_Response();
		$response->set_data( [ 'deleted' => TRUE ] );
		$response->set_status( 204 );

		return $response;
		//return rest_ensure_response( $data );
	}

	public function delete_item_permissions_check( $request ) {
		return TRUE;
	}

	/**
	 * Prepares the item for the REST response.
	 *
	 * @since 4.7.0
	 *
	 * @param mixed $item              WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function prepare_item_for_response( $item, $request ) {

	}


}