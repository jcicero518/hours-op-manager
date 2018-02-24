import PropTypes from 'prop-types'
import React, {Component} from "react";
import "../store/DataStore";
import DataStore from "../store/DataStore";
import Spinner from "react-spinkit";
import toastr from "toastr";
//import {Form, Icon, IconGroup} from "semantic-ui-react";

class Modal extends Component {

	constructor( props ) {
		super( props );
		let _ = this;

		_.state = {
			modalOpen: false,
			activeClass: 'is-active',
			formValid: false,
			formSubmitted: false,
			validationError: false
		};

		_.store = new DataStore();
		_.toggleModal = _.toggleModal.bind( _ );
		_.handleSubmit = _.handleSubmit.bind( _ );
	}

	componentDidMount() {
		let _ = this;
		const {coverClass, modalContainerClass, modalClass} = _.props;

		_.coverClass = coverClass;
		_.modalContainerClass = modalContainerClass;
		_.modalClass = modalClass;
	}

	toggleModal() {
		let _ = this;
		_.props.handleToggle();
	}

	toggleSubmitted() {
		let _ = this;
		_.setState({
			formSubmitted: !_.state.formSubmitted
		});
	}

	toggleValidation() {
		let _ = this;
		_.setState({
			validationError: !_.state.validationError
		});
	}

	handleSuccess( department ) {
		let _ = this;
		toastr.success( 'Created new department', 'Success!' );
		_.props.handleToggle();
		_.props.handleCreateDepartment( department );
		_.toggleSubmitted();
	}

	handleFail() {
		let _ = this;
		toastr.error( 'Invalid name or this department already exists', 'Notice!' );
		_.props.handleToggle();
		_.toggleSubmitted();
	}

	handleSubmit( event ) {
		let _ = this;
		event.preventDefault();
		_.toggleSubmitted();

		let department = event.target.department.value;

		/*if ( department.length && department.length >= 3 ) {
			_.store.createDepartment( department ).then( result => {
				result ? _.handleSuccess( Object.assign( {}, {id: result, label: department}) ) : _.handleFail();
			});
		} else {
			_.toggleValidation();
		}*/

		if ( department.length && department.length >= 3 ) {
			_.props.handleToggle();
			_.props.handleCreateDepartment( department );
			_.toggleSubmitted();
		} else {
			_.toggleValidation();
		}

	}

	render() {
		let _ = this;
		const {activeClass} = _.state;

		const modalContainerClass = _.props.activateModal ? `${_.modalContainerClass} ${activeClass}` : _.props.modalContainerClass;
		const coverClass = _.props.activateModal ? `${_.coverClass} ${activeClass}` : _.coverClass;
		const modalClass = _.modalClass;
		const spinnerClass = !_.state.formSubmitted ? '' : activeClass;
		const inputClass = !_.state.validationError ? '' : 'has-errors';

		return (
			<div>
				<div className={modalContainerClass}>
					<div className="modal-header"><button onClick={_.toggleModal}>toggle</button></div>
					<div className={modalClass}>
						<div className="postbox">
							<h3>New Department</h3>
							<div className="wp-body">
								<form onSubmit={_.handleSubmit}>
									<input className={inputClass} type="text" name="department" placeholder="Department" autoFocus="true" onChange={() => {}} />
									<input type="submit" value="Submit" />
									<Spinner className={spinnerClass} name="circle" color="blue" />
								</form>
							</div>
						</div>
					</div>
				</div>
				<div onClick={_.toggleModal} className={coverClass}> </div>
			</div>
		)
	}
}

Modal.propTypes = {
	activateModal: PropTypes.bool,
    coverClass: PropTypes.string,
    handleCreateDepartment: PropTypes.func,
    handleToggle: PropTypes.func,
    modalClass: PropTypes.string,
    modalContainerClass: PropTypes.string
};

export default Modal;

