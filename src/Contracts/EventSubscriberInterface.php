<?php

namespace Amorphous\Plugin\Contracts;

interface EventSubscriberInterface {

	/**
	 * Returns an array of hooks that this subscriber wants to register with
	 * the Wordpress Plugin API
	 *
	 * Array key is the name of the "hook", or name of what becomes the
	 * action or filter internally in WP
	 *
	 * Value can be:
	 * - The method name
	 * ['hook_name' => 'action_name']
	 *
	 * - An array with the method name and priority
	 * ['hook_name' => ['method_name', $priority] ]
	 *
	 * - An array with the method name, priority and number of accepted arguments
	 * ['hook_name' => ['method_name', $priority, $accepted_args] ]
	 *
	 * @return mixed
	 */
	public static function get_subscribed_hooks();
}