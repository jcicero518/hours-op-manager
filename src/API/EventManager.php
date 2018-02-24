<?php

namespace Amorphous\Plugin\API;

use Amorphous\Plugin\Contracts\EventSubscriberInterface;

/**
 * Class EventManager
 *
 * An event subscriber that stores an instance of the WP event manager
 * to trigger additional events
 *
 * @package Amorphous\Plugin\API
 */
class EventManager {

	/**
	 * The WP Event Manager
	 *
	 * @var EventManager
	 */
	protected $event_manager;

	/**
	 * Setter injection - set Event Manager for the subscriber
	 *
	 * @param EventManager $event_manager
	 */
	public function setEventManager( EventManager $event_manager ) {
		$this->event_manager = $event_manager;
	}

	/**
	 * Add a callback to a specific hook in the WP plugin API
	 *
	 * @param $hook_name
	 * @param $callback
	 * @param int $priority
	 * @param int $accepted_args
	 */
	public function add_callback( $hook_name, $callback, $priority = 10, $accepted_args = 1 ) {
		add_filter( $hook_name, $callback, $priority, $accepted_args );
	}

	/**
	 * registers all the hooks that the given subscriber wants to
	 * register with the Plugin API
	 *
	 * @param EventSubscriberInterface $subscriber
	 */
	public function add_subscriber( EventSubscriberInterface $subscriber ) {
		foreach ( $subscriber->get_subscribed_hooks() as $subscribed_hook => $parameters ) {
			$this->add_subscriber_callback( $subscriber, $subscribed_hook, $parameters );
		}
	}

	/**
	 * @return mixed
	 */
	public function execute() {
		return call_user_func_array( 'do_action', func_get_args() );
	}

	/**
	 * Filters the given value by applying all the changes from the callbacks.
	 * registered with the given hook. Returns the filtered value.
	 * @return mixed
	 */
	public function filter() {
		return apply_filters( func_get_args() );
	}

	public function get_current_hook() {
		return current_filter();
	}

	/**
	 * Adds the given subscriber's callback to a specific hook
	 * of the WordPress plugin API.
	 *
	 * @param EventSubscriberInterface $subscriber
	 * @param $hook_name
	 * @param $parameters
	 */
	private function add_subscriber_callback( EventSubscriberInterface $subscriber, $hook_name, $parameters ) {
		if ( is_string( $parameters ) ) {
			$this->add_callback( $hook_name, array( $subscriber, $parameters ) );
		} elseif ( is_array( $parameters ) && isset( $parameters[0] ) ) {
			$this->add_callback( $hook_name, array( $subscriber, $parameters[0] ), isset( $parameters[1] ) ? $parameters[1] : 10, isset( $parameters[2] ) ? $parameters[2] : 1 );
		}
	}
}