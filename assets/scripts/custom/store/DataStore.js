/*global HOM_WP_API */
import axios from "axios";

class DataStore {

	constructor( adminUrl = '' ) {
		const appUrl = `${location.protocol}//${location.host}`;
		let _ = this;
		_.adminUrl = adminUrl;
		_.apiUrl = `${appUrl}/wp-json/hours-op-manager/v1`;
		_.data = [];
		_.allOptions = HOM_WP_API.hours_op_options;
	}

	getCsvOption( option ) {
		let _ = this;
		return _.allOptions['csv_options'][option] ? _.allOptions['csv_options'][option] : 'N/A';
	}

	getUploadsOption( option ) {
		let _ = this;
		return _.allOptions['upload_dates'][option] ? _.allOptions['upload_dates'][option] : 'N/A';
	}

	getOption( option ) {
		let _ = this;
		return _.allOptions[option] ? _.allOptions[option] : false;
	}

	api( endPoint, method = 'get', data = null ) {

		return new Promise( ( resolve, reject ) => {
			axios[method]( endPoint, data ? data : '' ).then( ( response ) => {
				resolve( response.data );
			}).catch( ( error ) => {
				reject( error );
			});
		});
	}

	getDepartments() {
		return this.api( `${this.apiUrl}/departments` ).then( result => {
			const payload = result;
			return payload.length ? payload : [];
		}).catch( error => {
			console.warn( error );
		});
	}

	getDepartmentById( id ) {
		return this.api( `${this.apiUrl}/departments/${id}`).then( result => {
			const payload = result;
			return payload.length ? payload : [];
		}).catch( error => {
			console.warn( error );
		});
	}

	createDepartment( name ) {
		return this.api( `${this.apiUrl}/departmentsCreate`, 'post', {'name': name} ).then( result => {
			const payload = result;
			return payload ? payload : false;
		}).catch( error => {
			console.warn( error );
		});
	}

	deleteDepartment( id ) {
		return this.api( `${this.apiUrl}/departments/${id}`, 'delete' ).then( result => {
			const payload = result;
			return payload ? payload : false;
		}).catch( error => {
			console.warn( error );
		});
	}
}

export default DataStore;