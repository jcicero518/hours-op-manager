/*global HOM_WP_API */
import React, {Component} from "react";
import __ from "lodash";
import DataStore from "../store/DataStore";
import Department from "./Department";
import DepartmentPanelRow from "./DepartmentPanelRow";
import Modal from "./Modal";
import toastr from "toastr";

class DepartmentsContainer extends Component {

	constructor( props ) {
		super( props );
		let _ = this;
		_.state = {
			mounted: false,
			departments: null,
			activeModal: false,
			coverClass: 'modal-cover',
			modalContainerClass: 'modal-container',
			modalClass: 'modal',
			activePane: null
		};

		_.store = new DataStore( HOM_WP_API );

		_.toggleModal = _.toggleModal.bind( _ );
		_.createDepartment = _.createDepartment.bind( _ );
		_.deleteDepartment = _.deleteDepartment.bind( _ );
		_.setActivePane = _.setActivePane.bind( _ );
	}

	componentDidMount() {
		let _ = this;
		_.store.getDepartments().then( data => {
			_.setState({
				departments: __.sortBy( data, 'label' ),
				mounted: !_.state.mounted
			}, () => {
				// other callbacks, addl filtering / sorting
			});
		});
	}

	sortDepartments() {
		let _ = this;
		_.setState({
			departments: __.sortBy( _.state.departments, 'label' )
		});
	}

	toggleModal() {
		let _ = this;
		_.setState({
			activeModal: !_.state.activeModal
		})
	}

	createDepartment( department ) {
		let _ = this;
		_.setState({
			departments: _.state.departments.concat( [{
				id: department.id,
				label: department.label
			}])
		}, () => _.sortDepartments() );
	}

	handleDeleteSuccess( department ) {
		let _ = this;
		toastr.success( `You have removed the ${department} department from existence. `, 'Success!' );
	}

	handleDeleteFail() {
		let _ = this;
		toastr.error( 'Oops, something happened.', 'Notice!' );
	}

	deleteDepartment( event ) {
		let _ = this;

		const deleteAttrs = Object.assign( {},
			{
				id: event.target.value,
				label: event.target.getAttribute( 'data-label' )
			}
		);

		if ( ! window.confirm( `Are you sure that you want to delete ${deleteAttrs.label}?` ) ) {
			return false;
		}

		_.setState({
			departments: _.state.departments.filter( dept => {
				return dept.id !== deleteAttrs.id
			})
		});

		_.store.deleteDepartment( deleteAttrs.id ).then( result => {
			console.log(result, 'delete result');
			_.handleDeleteSuccess( deleteAttrs.label );

		}).catch( error => {
			console.warn( error );
			_.handleDeleteFail();
		});
	}

	setActivePane( paneId, expanded ) {
		let _ = this;
		_.setState( prevState => ({
			activePane: prevState.activePane === paneId ? null : paneId
		}));
	}

	render() {
		let _ = this;
		const {
			mounted,
			departments,
			activePane
		} = _.state;


		let output,
		initialOutput = (
			<div className="departments-outer-container">
				<div id="department-accordion" className="container accordion accordion-container">
					<h3>Departments <button onClick={_.toggleModal} className="page-title-action">Add New Department</button></h3>
				</div>
				<p>Get started by adding a new department.</p>
			</div>
		);

		departments ? output = (
			<div className="departments-outer-container">
				<div id="department-accordion" className="container accordion accordion-container">
					<h3>Departments <button onClick={_.toggleModal} className="page-title-action">Add New Department</button></h3>

					{departments.map( dept => (
						<DepartmentPanelRow key={dept.id} {...dept}>
							<Department activePane={activePane} setActivePane={_.setActivePane} handleDelete={_.deleteDepartment} key={dept.id} {...dept} />
						</DepartmentPanelRow>
					))}

				</div>
				<Modal
					activateModal={_.state.activeModal}
					handleCreateDepartment={_.createDepartment}
					handleToggle={_.toggleModal}
					coverClass={_.state.coverClass}
					modalContainerClass={_.state.modalContainerClass}
					modalClass={_.state.modalClass} />
			</div>
		) : output = initialOutput;

		return output;
	}
}

//ReactDOM.render( <DepartmentsContainer/>, document.getElementById( 'app-container' ) );
export default DepartmentsContainer;