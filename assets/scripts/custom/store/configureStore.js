import {createStore, applyMiddleware, compose} from "redux";
import createReducer from "../reducers/reducers";
import {loadDepts} from "../actions/departmentActions";
import {fromJS} from "immutable";
import {routerMiddleware} from "react-router-redux";
import thunk from "redux-thunk";

export default function configureStore( initialState = {}, history ) {
	// Create the store with two middlewares
	// 1. thunks
	// 2. routerMiddleware: Syncs the location/URL path to the state
	const middlewares = [
		thunk,
		routerMiddleware(history),
	];

	const enhancers = [
		applyMiddleware(...middlewares),
	];

	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	/* eslint-disable no-underscore-dangle */
	const composeEnhancers =
		process.env.NODE_ENV !== 'production' &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				// TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
				// Prevent recomputing reducers for `replaceReducer`
				shouldHotReload: false,
			})
			: compose;
	/* eslint-enable */

	const store = createStore(
		createReducer(),
		fromJS( initialState ),
		composeEnhancers(...enhancers)
	);

	store.dispatch( loadDepts() );

	return store;
}