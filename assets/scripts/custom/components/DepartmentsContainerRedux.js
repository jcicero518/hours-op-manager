/*global HOM_WP_API */
import React, {Component} from "react";
import { connect } from 'react-redux';
import {
	Router,
	Route,
	Switch
} from "react-router-dom";
import { compose } from 'redux';
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
import {
	createDept,
	loadDepts,
	receivedCreateRequest,
	receivedLoadRequest,
	receivedDeleteRequest,
	deleteDept,
	deptsDeletedError,
	deptsLoaded,
	setDeptsOrder,
	setActivePane,
	setActiveModal
} from "../actions/actions";
import reducer from "../reducers/reducers";
import Spinner from "react-spinkit";
import Department from "./Department";
import DepartmentPanelRow from "./DepartmentPanelRow";
import Modal from "./Modal";
import toastr from "toastr";

class DepartmentsContainer extends Component {

	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		this.props.fetchData();
	}

	render() {
		let _ = this;
		let spinnerClass, hasDepartments;
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
		departments && departments.length
			? hasDepartments = ''
			: hasDepartments = 'Get started by adding a new department.';

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
				<Spinner className={spinnerClass} name="double-bounce" color="#0B568A" fadeIn="none" />
				<div id="department-accordion" className="container accordion accordion-container">
					<h3>Departments <button onClick={_.props.setActiveModal} className="page-title-action">Add New Department</button></h3>

					{departments.map( dept => (
						<DepartmentPanelRow key={dept.id} {...dept}>
							<Department activePane={activePane} setActivePane={_.props.setActivePane} handleDelete={_.props.deleteDepartment} key={dept.id} {...dept} />
						</DepartmentPanelRow>
					))}

				</div>
				<Modal
					activateModal={activeModal}
					handleCreateDepartment={_.props.createDepartment}
					handleToggle={_.props.setActiveModal}
					coverClass={coverClass}
					modalContainerClass={modalContainerClass}
					modalClass={modalClass} />
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

/*const mapStateToProps = ( state ) => {
	console.log(state.get('departments'), 'state in mapstatetoprops');
	return {
		departments: state.departments
	}
};*/

export default connect( mapStateToProps, mapDispatchToProps )( DepartmentsContainer );

/*const withConnect = connect( mapStateToProps, mapDispatchToProps );

export default compose(
	withConnect
)( DepartmentsContainer );*/

//export default DepartmentsContainer;