/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
	CREATE_DEPT,
	CREATE_DEPT_SUCCESS,
	CREATE_DEPT_ERROR,
	LOAD_DEPTS,
	LOAD_DEPTS_SUCCESS,
	LOAD_DEPTS_ERROR,
	DELETE_DEPT,
	DELETE_DEPT_SUCCESS,
	DELETE_DEPT_ERROR,
	SET_DEPTS_ORDER
} from "./actionTypes";
import {isLoading} from "./loadingActions";

import DataStore from "../store/DataStore";

export function createDept( department ) {
	return {
		type: CREATE_DEPT,
		department
	}
}

export function deptCreated( newDepartment ) {
	return {
		type: CREATE_DEPT_SUCCESS,
		newDepartment
	}
}

export function deptsCreatedError( error ) {
	return {
		type: CREATE_DEPT_ERROR,
		error
	}
}

export function deleteDept( department ) {
	return {
		type: DELETE_DEPT,
		department
	}
}

export function deptsDeletedSuccess( message ) {
	return {
		type: DELETE_DEPT_SUCCESS,
		message
	}
}

export function deptsDeletedError( error ) {
	return {
		type: DELETE_DEPT_ERROR,
		error
	}
}
/**
 *
 * @return {object} An action object with a type of LOAD_DEPTS
 */
export function loadDepts() {
	return {
		type: LOAD_DEPTS
	}
}
/**
 * Dispatched when the depts are loaded by the request saga
 *
 * @param  {array} departments The department data
 *
 * @return {object} An action object with a type of LOAD_DEPTS_SUCCESS passing the depts
 */
export function deptsLoaded( departments ) {
	return {
		type: LOAD_DEPTS_SUCCESS,
		departments
	}
}

/**
 * Dispatched when loading the depts fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_DEPTS_ERROR passing the error
 */
export function deptsLoadingError( error ) {
	return {
		type: LOAD_DEPTS_ERROR,
		error
	}
}

export function setDeptsOrder() {
	return {
		type: SET_DEPTS_ORDER
	}
}

/**********
 * THUNKS
 **********/

export function receivedCreateRequest( department ) {
	return ( dispatch ) => {
		dispatch( isLoading() );

		const store = new DataStore();
		store.createDepartment( department ).then( response => {
			const newDepartment = Object.assign( {}, {
				id: response,
				label: department
			});
			dispatch( createDept( newDepartment ) );
			return newDepartment;
		}).then( newDept => {
			dispatch( deptCreated( newDept ) );
			dispatch( receivedLoadRequest() );
		}).catch( err => {
			dispatch( deptsCreatedError( err ) );
		})
	}
}

export function receivedLoadRequest() {
	return ( dispatch ) => {
		const store = new DataStore();
		store.getDepartments().then( response => {
			dispatch( deptsLoaded( response ) );
			return response;
		}).then( () => {
			dispatch( setDeptsOrder() );
		}).catch( err => {
			dispatch( deptsLoadingError( err ) );
		});
	}
}

export function receivedDeleteRequest( department ) {
	return ( dispatch ) => {
		dispatch( isLoading() );

		const store = new DataStore();
		store.deleteDepartment( department.id ).then( response => {
			dispatch( deleteDept( department ) );
			dispatch( deptsDeletedSuccess( `You have removed the ${department.label} department from existence. ` ) );
			dispatch( receivedLoadRequest() );
		}).catch( err => {
			dispatch( deptsDeletedError( err ) );
		})
	}
}