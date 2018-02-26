
import {SET_ACTIVE_MODAL} from "./actionTypes";

export function setActiveModal( activeModal ) {
	activeModal = !activeModal;
	return {
		type: SET_ACTIVE_MODAL,
		activeModal: activeModal
	}
}