/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
import ld from "lodash";

import {
	CREATE_DEPT,
	CREATE_DEPT_SUCCESS,
	CREATE_DEPT_ERROR,
	LOAD_DEPTS_SUCCESS,
	LOAD_DEPTS,
	LOAD_DEPTS_ERROR,
	DELETE_DEPT,
	DELETE_DEPT_SUCCESS,
	DELETE_DEPT_ERROR,
	SET_DEPTS_ORDER,
	SET_ACTIVE_PANE,
	SET_ACTIVE_MODAL,
	SET_LOADING,
	LOAD_REPOS_SUCCESS,
	LOAD_REPOS,
	LOAD_REPOS_ERROR,
} from "../actions/actionTypes";

// The initial state of the App
const initialState = fromJS({
	loading: false,
	error: false,
	currentUser: false,
	userData: {
		repositories: false,
	},
	departments: null,
	activeModal: false,
	coverClass: 'modal-cover',
	modalContainerClass: 'modal-container',
	modalClass: 'modal',
	activePane: null,
	displayMessage: false,
	successMessage: null
});

let __ = ld.noConflict();

function appReducer(state = initialState, action) {

	switch (action.type) {
		case SET_LOADING:
			return state.set('loading', true);
		case CREATE_DEPT:
			const updatedDepartments = state.get('departments').concat([{
				id: action.department.id,
				label: action.department.label
			}]);
			return state
			.set('loading', true)
			.set('departments', updatedDepartments);
		case CREATE_DEPT_SUCCESS:
			// added new dept action.newDepartment
			return state
			.set('departments', state.get('departments') )
			.set('error', false);
		case CREATE_DEPT_ERROR:
			return state
			.set('error', action.error)
			.set('loading', false);
		case LOAD_DEPTS:
			return state
			.set('loading', true)
			.set('error', false)
			.set('departments', false);
		case LOAD_DEPTS_SUCCESS:
			return state
			.set('departments', action.departments)
			.set('loading', false)
			.set('error', false);
		case LOAD_DEPTS_ERROR:
			return state
			.set('error', action.error)
			.set('loading', false);
		case DELETE_DEPT:
			return state
			.set('loading', true)
			.set('departments', state.get('departments').filter( dept => {
				return dept.id !== action.department.id
			}));
		case DELETE_DEPT_SUCCESS:
			return state
			.set('departments', state.get('departments') )
			.set('error', false)
			.set('displayMessage', true)
			.set('successMessage', action.message);
		case DELETE_DEPT_ERROR:
			return state
			.set('error', action.error)
			.set('loading', false);
		case SET_DEPTS_ORDER:
			return state
			.set('departments', __.sortBy( state.get('departments'), 'label' ) );
		case SET_ACTIVE_PANE:
			return state
			.update( 'activePane', activePane => action.activePane );
		case SET_ACTIVE_MODAL:
			return state
			.set('activeModal', !state.get('activeModal') );
		case LOAD_REPOS:
			return state
			.set('loading', true)
			.set('error', false)
			.setIn(['userData', 'repositories'], false);
		case LOAD_REPOS_SUCCESS:
			return state
			.setIn(['userData', 'repositories'], action.repos)
			.set('loading', false)
			.set('currentUser', action.username);
		case LOAD_REPOS_ERROR:
			return state
			.set('error', action.error)
			.set('loading', false);
		default:
			return state;
	}
}

export default appReducer;
