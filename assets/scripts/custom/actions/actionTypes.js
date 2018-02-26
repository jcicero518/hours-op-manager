/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_LOADING = 'hours-op-manager/SET_LOADING';

export const CREATE_DEPT = 'hours-op-manager/CREATE_DEPT';
export const CREATE_DEPT_SUCCESS = 'hours-op-manager/CREATE_DEPT_SUCCESS';
export const CREATE_DEPT_ERROR = 'hours-op-manager/CREATE_DEPT_ERROR';

export const LOAD_DEPTS = 'hours-op-manager/LOAD_DEPTS';
export const LOAD_DEPTS_SUCCESS = 'hours-op-manager/LOAD_DEPTS_SUCCESS';
export const LOAD_DEPTS_ERROR = 'hours-op-manager/LOAD_DEPTS_ERROR';

export const DELETE_DEPT = 'hours-op-manager/DELETE_DEPT';
export const DELETE_DEPT_SUCCESS = 'hours-op-manager/DELETE_DEPT_SUCCESS';
export const DELETE_DEPT_ERROR = 'hours-op-manager/DELETE_DEPT_SUCCESS';

export const SET_DEPTS_ORDER = 'hours-op-manager/SET_DEPTS_ORDER';

export const SET_ACTIVE_PANE = 'hours-op-manager/SET_ACTIVE_PANE';
export const SET_ACTIVE_PANE_SUCCESS = 'hours-op-manager/SET_ACTIVE_PANE_SUCCESS';
export const SET_ACTIVE_MODAL = 'hours-op-manager/SET_ACTIVE_MODAL';

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const DEFAULT_LOCALE = 'en';
