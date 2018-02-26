
import {SET_ACTIVE_PANE} from "./actionTypes";

export function setActivePane( paneId ) {
	return {
		type: SET_ACTIVE_PANE,
		activePane: paneId
	}
}

/**********
 * THUNKS
 **********/

/**
 *
 * @param paneId
 * @returns {function(*, *)}
 */
export function receivedPaneRequest( paneId ) {
	return ( dispatch, getState ) => {
		dispatch( setActivePane( paneId ) );
	}
}