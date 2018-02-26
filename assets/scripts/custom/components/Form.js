/*global HOM_WP_API */
import PropTypes from 'prop-types'
import React, {Component} from "react";
import axios, {post} from "axios";
import toastr from "toastr";
import {tween, physics, styler, easing, value} from "popmotion";
import DataStore from "../store/DataStore";
import Actions from "./Actions";

class Form extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			file: null,
			submitted: false,
			validationError: false
		};
		this.config = {
			uploadUrl: HOM_WP_API.ajax_url,
			action: 'upload_department_file',
			_nonce: HOM_WP_API.uploadNonce,
			headers: {
				'content-type': 'multipart/form-data'
			},
			onUploadProgress( progressEvent ) {
				let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
			}
		};
		this.store = new DataStore();

		this.handleChange = this.handleChange.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
		this.uploadFile = this.uploadFile.bind( this );
	}

	initMotion( deptId ) {
		const circleStyler = styler(document.getElementById(`tick-outline-path-${deptId}`));
		const tickStyler = styler(document.getElementById(`tick-path-${deptId}`));

		function showTick() {
			// Complete outline
			tween({
				from: circleStyler.get('pathLength'),
				to: 100
			}).start(circleStyler.set('pathLength'));

			tween().start((v) => tickStyler.set({
				opacity: v,
				pathLength: v * 100
			}));
		}

		tween({ ease: easing.easeIn }).start({
			update: (v) => circleStyler.set({
				opacity: v,
				pathLength: v * 45
			}),
			complete: () => physics({ velocity: -400 })
			.start(circleStyler.set('rotate'))
		});

		// Emulate data received after delay
		setTimeout(showTick, 2000);
	}

	uploadFile( file ) {
		let _ = this;
		let formData = new FormData();
		formData.append( 'action', _.config.action );
		formData.append( 'departmentId', _.props.departmentId );
		formData.append( '_nonce', _.config._nonce );
		formData.append( 'file', file );

		return post( _.config.uploadUrl, formData, _.config.headers );
	}

	handleChange( event ) {
		this.setState({
			file: event.target.files[0],
			//validationError: !this.state.validationError
		});
	}

	handleDelete( event ) {
		this.props.handleDelete( event );
	}

	handleSubmit( event ) {
		event.preventDefault();
		if ( ! this.state.file ) {
			this.setState({
				validationError: !this.state.validationError
			});
			return false;
		}
		this.uploadFile( this.state.file ).then( result => {
			console.log( result.data );
			//toastr.success( result.data, 'Success' );
			this.initMotion( this.props.departmentId );
			this.setState({
				submitted: !this.state.submitted
			});
		}).catch( err => {
			toastr.danger( err, 'Error' );
		});
	}

	render() {
		const {departmentId, departmentLabel} = this.props;
		const {submitted, validationError} = this.state;

		const lastUploaded = this.store.getUploadsOption( `_transient__hours_op_manager_last_upload_${departmentId}` );
		const uploadedMessage = '( Upload a CSV file first )';

		return (
			<div className="cf pane-content-container">
				<div className="upload-pane">
					<p><strong>Upload a CSV file below for this department.</strong></p>
					<form name={`dept_form_${departmentId}`} id={`dept_form_${departmentLabel}`} onSubmit={this.handleSubmit} method="post">
						<input onChange={this.handleChange} type="file" name="file" id={`dept_file_${departmentId}`} ref="file"
						       defaultValue={this.state.file}
						       className={validationError ? 'has-errors' : ''}
						/>
						<input name="action" type="hidden" value="csv-upload-parse" />
						<input className="button action" type="submit" name="submit" value="Upload" disabled={submitted ? 'disabled' : ''} />

						<div className="message-container">
							<p><strong>Last upload</strong>: {lastUploaded}</p>
							<label>
								<strong>Department shortcode </strong>
							</label>
							{(lastUploaded !== 'N/A' || submitted === true)
								? <textarea id={`shortcode_id_${departmentId}`} value={`[hours_op_options_table department=${departmentId}]`} readOnly> </textarea>
								: uploadedMessage}
						</div>
					</form>
					<div className="message-container">
						<label>Other Actions</label>
						<button onClick={this.handleDelete} name="delete" id={`dept_delete_${departmentId}`} value={departmentId} data-label={`${departmentLabel}`}>Delete</button>
						<Actions displayButton={(lastUploaded !== 'N/A' || submitted === true)} copyTarget={`shortcode_id_${departmentId}`} />
					</div>
				</div>
				<div className="feedback-pane">
					<svg className="progress-icon" width="150" height="150" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<g className="tick-icon" strokeWidth="2" stroke="#14D790" fill="none" transform="translate(1, 1.2)">
							<path id={`tick-outline-path-${departmentId}`} d="M14 28c7.732 0 14-6.268 14-14S21.732 0 14 0 0 6.268 0 14s6.268 14 14 14z" opacity="0" />
							<path id={`tick-path-${departmentId}`} d="M6.173 16.252l5.722 4.228 9.22-12.69" opacity="0"/>
						</g>
					</svg>
				</div>
			</div>
		)
	}
}

Form.propTypes = {
	departmentId: PropTypes.string,
	departmentLabel: PropTypes.string,
	handleDelete: PropTypes.func
};

export default Form;

