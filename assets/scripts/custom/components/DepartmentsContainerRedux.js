/*global HOM_WP_API */

/**
 * React / Redux core
 */
import React, {Component} from "react";
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 * Re-Selectors
 */
import { createStructuredSelector } from 'reselect';
import {
	makeSelectDepts,
	makeSelectModalClass,
	makeSelectModalCoverClass,
	makeSelectModalContainerClass,
	makeSelectActiveModal,
	makeSelectActivePane,
	makeSelectError,
	makeSelectLoading,
	makeSelectLocation
} from "../selectors/selectors";

/**
 * Action Creators
 */
import {
	createDept,
	loadDepts,
	deptsLoaded,
	deleteDept,
	deptsDeletedError,
	setDeptsOrder,
	receivedCreateRequest,
	receivedLoadRequest,
	receivedDeleteRequest,
} from "../actions/departmentActions";
import {setActiveModal} from "../actions/modalActions";
import {
	setActivePane,
	receivedPaneRequest
} from "../actions/panelActions";

/**
 * 3rd Party Components
 */
import Spinner from "react-spinkit";
import toastr from "toastr";

/**
 * Main Components
 */
import Department from "./Department";
import DepartmentPanelRow from "./DepartmentPanelRow";
import Modal from "./Modal";


class DepartmentsContainer extends Component {

	constructor( props ) {
		super( props );
		let _ = this;
		_.cache = {};
	}

	componentDidMount() {
		this.props.fetchData();
	}

	render() {
		let _ = this;
		let spinnerClass;
		const {
			loading,
			error,
			displayMessage,
			successMessage,
			departments,
			activePane,
			activeModal,
			coverClass,
			modalContainerClass,
			modalClass
		} = this.props;

		loading
			? spinnerClass = 'bigger-spinner is-active'
			: spinnerClass = '';

		if ( displayMessage ) {
			toastr.success( successMessage, 'Success!' );
		}

		let output,
		initialOutput = (
			<div className="departments-outer-container initial-container">
				<div id="department-accordion" className="container accordion accordion-container">
					<h3>Departments <button onClick={_.toggleModal} className="page-title-action">Add New Department</button></h3>
				</div>

				<Spinner className={spinnerClass} name="double-bounce" color="#0B568A" fadeIn="none" />
			</div>
		);

		departments ? output = (
			<div className="departments-outer-container">
				<Modal
					activateModal={activeModal}
					handleCreateDepartment={_.props.createDepartment}
					handleToggle={_.props.setActiveModal}
					coverClass={coverClass}
					modalContainerClass={modalContainerClass}
					modalClass={modalClass} />

				<div className="main-ui-flex-wrapper">
					<div className="accordion-wrapper">
						<div id="department-accordion" className="container accordion accordion-container">
							<h3>Departments <button onClick={_.props.setActiveModal} className="page-title-action">Add New Department</button></h3>

							{departments.map( dept => (
								<Department activePane={activePane} setActivePane={_.props.setActivePane} handleDelete={_.props.deleteDepartment} key={dept.id} {...dept} />
							))}

						</div>

					</div>
					<div className="feedback-wrapper">
						<Spinner className={spinnerClass} name="double-bounce" color="#0B568A" fadeIn="none" />
					</div>
				</div>
			</div>
		) : output = initialOutput;

		return output;
	}
}

export function mapDispatchToProps( dispatch ) {
	return {
		fetchData: () => dispatch( receivedLoadRequest() ),
		setActivePane: ( activePane ) => dispatch( setActivePane( activePane ) ),
		setActiveModal: () => dispatch( setActiveModal( !makeSelectActiveModal() ) ),
		createDepartment: ( department ) => dispatch( receivedCreateRequest( department ) ),
		deleteDepartment: ( event ) => {
			const deleteAttrs = Object.assign( {},
				{
					id: event.target.value,
					label: event.target.getAttribute( 'data-label' )
				}
			);
			let deleteSwitch = window.confirm( `Are you sure that you want to delete ${deleteAttrs.label}?` );
			deleteSwitch ? dispatch( receivedDeleteRequest( deleteAttrs ) ) : dispatch( deptsDeletedError( 'Cancelled' ) );
		},
		sortDepartments: () => dispatch( setDeptsOrder() )
	}
}

const mapStateToProps = createStructuredSelector({
	departments: makeSelectDepts(),
	activePane: makeSelectActivePane(),
	activeModal: makeSelectActiveModal(),
	coverClass: makeSelectModalCoverClass(),
	modalContainerClass: makeSelectModalContainerClass(),
	modalClass: makeSelectModalClass(),
	loading: makeSelectLoading(),
	error: makeSelectError()
});

export default connect( mapStateToProps, mapDispatchToProps )( DepartmentsContainer );

/*const withConnect = connect( mapStateToProps, mapDispatchToProps );

export default compose(
	withConnect
)( DepartmentsContainer );*/

//export default DepartmentsContainer;