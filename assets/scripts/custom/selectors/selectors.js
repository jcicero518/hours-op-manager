/**
 * The global state selectors
 */
/**
 * departments: null,
 activeModal: false,
 coverClass: 'modal-cover',
 modalContainerClass: 'modal-container',
 modalClass: 'modal',
 activePane: null
 */
import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectActivePane = () => createSelector(
	selectGlobal,
	(globalState) => globalState.get('activePane')
);

const makeSelectActiveModal = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('activeModal')
);

const makeSelectModalCoverClass = () => createSelector(
	selectGlobal,
	(globalState) => globalState.get('coverClass')
);

const makeSelectModalContainerClass = () => createSelector(
	selectGlobal,
	(globalState) => globalState.get('modalContainerClass')
);

const makeSelectModalClass = () => createSelector(
	selectGlobal,
	(globalState) => globalState.get('modalClass')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectDepts = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('departments')
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

export {
	selectGlobal,
    makeSelectActiveModal,
    makeSelectModalContainerClass,
	makeSelectModalCoverClass,
	makeSelectModalClass,
	makeSelectActivePane,
	makeSelectLoading,
    makeSelectError,
    makeSelectRepos,
	makeSelectDepts,
    makeSelectLocation,
};
